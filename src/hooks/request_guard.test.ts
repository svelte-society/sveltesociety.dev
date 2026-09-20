import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test'
import type { RequestEvent } from '@sveltejs/kit'
import { request_guard } from './request_guard'

let now = 1_800_000_000_000
let nextVisitor = 0
let clock: ReturnType<typeof spyOn<typeof Date, 'now'>>

beforeEach(() => {
	now += 120_000
	nextVisitor = 0
	clock = spyOn(Date, 'now').mockImplementation(() => now)
})

afterEach(() => clock.mockRestore())

type RequestOptions = {
	ip?: string | null
	peer?: string
	path?: string
	method?: string
	headers?: Record<string, string>
}

async function request({
	ip = `198.51.100.${++nextVisitor}`,
	peer = '172.18.0.2',
	path = '/_app/remote/test/query',
	method = 'GET',
	headers = {}
}: RequestOptions = {}) {
	const url = new URL(path, 'https://sveltesociety.dev')
	const requestHeaders = new Headers(headers)
	if (ip !== null) requestHeaders.set('CF-Connecting-IP', ip)
	const event = {
		url,
		request: new Request(url, { method, headers: requestHeaders }),
		getClientAddress: () => peer
	} as RequestEvent
	return request_guard({ event, resolve: async () => new Response('ok') })
}

async function saturateCrawlerBudget() {
	for (let index = 0; index < 100; index++) {
		expect((await request()).status).toBe(200)
	}
	expect((await request()).status).toBe(429)
}

describe('request guard behind Cloudflare Tunnel', () => {
	test('distinct Cloudflare visitors sharing a proxy have independent limits', async () => {
		for (let index = 0; index < 20; index++) {
			expect((await request({ ip: '203.0.113.1' })).status).toBe(200)
		}
		const blocked = await request({ ip: '203.0.113.1' })
		expect(blocked.status).toBe(429)
		expect(blocked.headers.get('Retry-After')).toBe('1')
		expect((await request({ ip: '2001:db8::2' })).status).toBe(200)
	})

	test.each([null, ''])('uses the peer when the Cloudflare header is %p', async (ip) => {
		for (let index = 0; index < 20; index++) {
			expect((await request({ ip, peer: '203.0.113.1' })).status).toBe(200)
		}
		expect((await request({ ip, peer: '203.0.113.1' })).status).toBe(429)
		expect((await request({ ip, peer: '203.0.113.2' })).status).toBe(200)
	})

	test('does not use an arbitrary forwarded-for value to evade the visitor limit', async () => {
		for (let index = 0; index < 21; index++) {
			const response = await request({
				ip: '203.0.113.1',
				headers: { 'x-forwarded-for': `192.0.2.${index}` }
			})
			expect(response.status).toBe(index < 20 ? 200 : 429)
		}
	})

	test.each([
		['GET', '/_app/remote/test/query'],
		['GET', '/libraries/__data.json'],
		['HEAD', '/libraries/__data.json']
	])('same-origin %s %s without Origin survives crawler saturation', async (method, path) => {
		await saturateCrawlerBudget()
		const response = await request({ method, path, headers: { 'sec-fetch-site': 'same-origin' } })
		expect(response.status).toBe(200)
	})

	test('browser reads still obey the per-visitor limit', async () => {
		for (let index = 0; index < 21; index++) {
			const response = await request({
				ip: '203.0.113.1',
				headers: { 'sec-fetch-site': 'same-origin' }
			})
			expect(response.status).toBe(index < 20 ? 200 : 429)
		}
	})

	test.each<RequestOptions>([
		{ method: 'GET', headers: { accept: 'text/html' } },
		{
			method: 'POST',
			headers: { origin: 'https://sveltesociety.dev', 'sec-fetch-site': 'same-origin' }
		},
		{ method: 'POST', path: '/api/webhooks/stripe' }
	])('preserves existing exemptions under crawler saturation: %p', async (options) => {
		await saturateCrawlerBudget()
		expect((await request(options)).status).toBe(200)
	})

	test.each<RequestOptions>([
		{ method: 'GET', headers: { accept: 'text/html' } },
		{ method: 'GET', headers: { 'sec-fetch-site': 'same-origin' } },
		{
			method: 'POST',
			headers: { origin: 'https://sveltesociety.dev', 'sec-fetch-site': 'same-origin' }
		},
		{ method: 'POST', path: '/api/webhooks/stripe' }
	])('exempt traffic does not consume the crawler allowance: %p', async (options) => {
		for (let index = 0; index < 101; index++) {
			expect((await request(options)).status).toBe(200)
		}
		expect((await request()).status).toBe(200)
		await saturateRemainingBudget()
	})

	test.each<RequestOptions>([
		{ headers: { 'sec-fetch-site': 'cross-site' } },
		{ headers: { 'sec-fetch-site': 'same-site' } },
		{ headers: { origin: 'https://elsewhere.example', 'sec-fetch-site': 'same-origin' } },
		{ method: 'POST', headers: { 'sec-fetch-site': 'same-origin' } }
	])('does not extend the browser exemption to %p', async (options) => {
		await saturateCrawlerBudget()
		expect((await request(options)).status).toBe(429)
	})

	test('abusive visitors are rejected before consuming the crawler allowance', async () => {
		for (let index = 0; index < 150; index++) await request({ ip: '203.0.113.1' })
		for (let index = 0; index < 80; index++) expect((await request()).status).toBe(200)
		expect((await request()).status).toBe(429)
	})

	test('global denials are transient and cannot be cached for another visitor', async () => {
		await saturateCrawlerBudget()
		const blocked = await request()
		expect(blocked.headers.get('Retry-After')).toBe('1')
		expect(blocked.headers.get('Cache-Control')).toBe('no-store')
		now += 1000
		expect((await request()).status).toBe(200)
	})

	test('the minute budget remains enforced and resets after the window', async () => {
		for (let second = 0; second < 15; second++) {
			for (let index = 0; index < 20; index++) {
				expect((await request({ ip: '203.0.113.1' })).status).toBe(200)
			}
			now += 1000
		}
		const blocked = await request({ ip: '203.0.113.1' })
		expect(blocked.status).toBe(429)
		expect(blocked.headers.get('Retry-After')).toBe('60')
		now += 45_000
		expect((await request({ ip: '203.0.113.1' })).status).toBe(200)
	})
})

async function saturateRemainingBudget() {
	for (let index = 0; index < 99; index++) expect((await request()).status).toBe(200)
	expect((await request()).status).toBe(429)
}
