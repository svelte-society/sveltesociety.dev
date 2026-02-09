import { describe, expect, test } from 'bun:test'
import { assertSafeExternalUrl, fetchSafeExternalUrl } from './url'

describe('assertSafeExternalUrl', () => {
	test('rejects localhost URLs', async () => {
		await expect(assertSafeExternalUrl('http://localhost:3000')).rejects.toThrow()
	})

	test('rejects private IPv4 URLs', async () => {
		await expect(assertSafeExternalUrl('http://127.0.0.1')).rejects.toThrow()
		await expect(assertSafeExternalUrl('http://10.0.0.1')).rejects.toThrow()
	})

	test('rejects private IPv6 URLs', async () => {
		await expect(assertSafeExternalUrl('http://[::1]')).rejects.toThrow()
	})

	test('rejects non-http protocols', async () => {
		await expect(assertSafeExternalUrl('file:///etc/passwd')).rejects.toThrow()
	})

	test('allows public IPv4 URLs', async () => {
		const parsed = await assertSafeExternalUrl('https://1.1.1.1/resource')
		expect(parsed.hostname).toBe('1.1.1.1')
		expect(parsed.protocol).toBe('https:')
	})
})

describe('fetchSafeExternalUrl', () => {
	test('rejects redirects to private hosts', async () => {
		const originalFetch = globalThis.fetch

		globalThis.fetch = (async () => {
			return new Response(null, {
				status: 302,
				headers: { location: 'http://127.0.0.1/admin' }
			})
		}) as typeof fetch

		try {
			await expect(fetchSafeExternalUrl(new URL('https://1.1.1.1'))).rejects.toThrow()
		} finally {
			globalThis.fetch = originalFetch
		}
	})

	test('follows safe redirects', async () => {
		const originalFetch = globalThis.fetch
		let callCount = 0

		globalThis.fetch = (async () => {
			callCount++
			if (callCount === 1) {
				return new Response(null, {
					status: 302,
					headers: { location: 'https://8.8.8.8/path' }
				})
			}

			return new Response('ok', { status: 200 })
		}) as typeof fetch

		try {
			const { response, finalUrl } = await fetchSafeExternalUrl(new URL('https://1.1.1.1'))
			expect(response.status).toBe(200)
			expect(finalUrl.hostname).toBe('8.8.8.8')
		} finally {
			globalThis.fetch = originalFetch
		}
	})
})
