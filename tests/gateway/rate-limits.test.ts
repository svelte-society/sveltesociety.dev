import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { Agent, request, type IncomingHttpHeaders } from 'node:http'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Exercise the production config without reducing its limits or replacing maps.
// Requires nginx on PATH, or NGINX_BIN=/absolute/path/to/nginx.
const nginx = process.env.NGINX_BIN || Bun.which('nginx')
if (!nginx) throw new Error('Gateway tests require nginx on PATH or NGINX_BIN.')
const productionConfig = await readFile(new URL('../../ops/nginx.conf', import.meta.url), 'utf8')

async function waitFor(check: () => boolean | Promise<boolean>, description: string) {
	const deadline = Date.now() + 5_000
	while (!(await check())) {
		if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${description}`)
		await Bun.sleep(10)
	}
}

async function unusedPort() {
	const listener = createServer()
	await new Promise<void>((resolve) => listener.listen(0, '127.0.0.1', resolve))
	const port = (listener.address() as { port: number }).port
	await new Promise<void>((resolve) => listener.close(() => resolve()))
	return port
}

type Reply = { status: number; headers: IncomingHttpHeaders; body: string }
type Log = {
	client_ip: string
	peer_ip: string
	cf_connecting_ip: string
	cf_ray: string
	uri: string
	status: number
	upstream_status: string
	limit_req_status: string
	limit_conn_status: string
}

async function startGateway() {
	const directory = await mkdtemp(join(tmpdir(), 'svelte-gateway-'))
	const agent = new Agent({ keepAlive: true, maxSockets: 64 })
	const held: (() => void)[] = []
	const backend = Bun.serve({
		hostname: '127.0.0.1',
		port: 0,
		async fetch(req) {
			const path = new URL(req.url).pathname
			if (path === '/api/webhooks/hold') await new Promise<void>((resolve) => held.push(resolve))
			if (path === '/upstream-429') {
				return new Response('application rate limit', {
					status: 429,
					headers: { 'Retry-After': '17', 'Cache-Control': 'private, no-store' }
				})
			}
			return Response.json(Object.fromEntries(req.headers))
		}
	})
	const port = await unusedPort()
	await mkdir(join(directory, 'logs'))
	await writeFile(join(directory, 'mime.types'), 'types { application/javascript js; }')
	// Only fixture ports, upstream, and filesystem paths differ from production.
	const config = productionConfig
		.replace('/tmp/nginx.pid', join(directory, 'nginx.pid'))
		.replaceAll('/var/log/nginx/', `${directory}/logs/`)
		.replace('/etc/nginx/mime.types', join(directory, 'mime.types'))
		.replace('/var/cache/nginx', join(directory, 'cache'))
		.replace('server web:3000;', `server 127.0.0.1:${backend.port};`)
		.replace('listen 8080;', `listen 127.0.0.1:${port};`)
	const configPath = join(directory, 'nginx.conf')
	await writeFile(configPath, config)
	const process = Bun.spawn(
		[nginx!, '-p', `${directory}/`, '-c', configPath, '-g', 'daemon off; master_process off;'],
		{
			stdout: 'pipe',
			stderr: 'pipe'
		}
	)
	const stderr = new Response(process.stderr).text()

	function send(
		path: string,
		headers: Record<string, string> = {},
		method = 'GET'
	): Promise<Reply> {
		return new Promise((resolve, reject) => {
			const req = request({ host: '127.0.0.1', port, path, method, agent, headers }, (res) => {
				const chunks: Buffer[] = []
				res.on('data', (chunk) => chunks.push(chunk))
				res.on('end', () =>
					resolve({
						status: res.statusCode!,
						headers: res.headers,
						body: Buffer.concat(chunks).toString()
					})
				)
				res.on('error', reject)
			})
			req.setTimeout(5_000, () => req.destroy(new Error('Gateway request timed out')))
			req.on('error', reject)
			req.end()
		})
	}
	async function stop() {
		for (const release of held) release()
		agent.destroy()
		process.kill('SIGTERM')
		await process.exited
		backend.stop(true)
		await rm(directory, { recursive: true, force: true })
	}
	try {
		await waitFor(async () => {
			if (process.exitCode !== null) throw new Error(await stderr)
			return send('/ready', { accept: 'text/html' }).then(
				() => true,
				() => false
			)
		}, 'Nginx startup')
	} catch (error) {
		await stop()
		throw error
	}
	return {
		send,
		stop,
		held,
		async logs(): Promise<Log[]> {
			return (await readFile(join(directory, 'logs/access.log'), 'utf8'))
				.trim()
				.split('\n')
				.map((line) => JSON.parse(line))
		}
	}
}

const visitor = (n: number) => `198.51.${Math.floor(n / 250)}.${(n % 250) + 1}`
const browserHeaders = { accept: 'application/json', 'sec-fetch-site': 'same-origin' }
let gateway: Awaited<ReturnType<typeof startGateway>>
beforeEach(async () => {
	gateway = await startGateway()
})
afterEach(async () => {
	await gateway?.stop()
})

describe('production Cloudflare Tunnel gateway', () => {
	test('separates visitors behind one peer, forwarding their IP and logging the limiter identity', async () => {
		const replies = await Promise.all(
			Array.from({ length: 360 }, (_, i) =>
				gateway.send('/rpc?private=not-logged', {
					...browserHeaders,
					'cf-connecting-ip': visitor(i),
					'cf-ray': `ray-${i}`
				})
			)
		)
		expect(replies.every((reply) => reply.status === 200)).toBe(true)
		for (const [i, reply] of replies.entries()) {
			const headers = JSON.parse(reply.body)
			expect(headers['cf-connecting-ip']).toBe(visitor(i))
			expect(headers['x-real-ip']).toBe(visitor(i))
			expect(headers['x-forwarded-for']).toBe(visitor(i))
		}
		const logs = (await gateway.logs()).filter((log) => log.uri === '/rpc')
		expect(logs).toHaveLength(360)
		expect(new Set(logs.map((log) => log.peer_ip))).toEqual(new Set(['127.0.0.1']))
		expect(new Set(logs.map((log) => log.client_ip)).size).toBe(360)
		expect(logs.find((log) => log.cf_ray === 'ray-0')).toMatchObject({
			client_ip: visitor(0),
			cf_connecting_ip: visitor(0),
			upstream_status: '200',
			limit_req_status: 'PASSED'
		})
		expect(JSON.stringify(logs)).not.toContain('private=')
	})

	test('falls back to the peer and normalizes forwarded headers in all proxy locations', async () => {
		for (const path of ['/rpc', '/_app/immutable/test.js', '/api/webhooks/test']) {
			for (const ip of ['', '2001:db8::123']) {
				const reply = await gateway.send(`${path}?visitor=${encodeURIComponent(ip)}`, {
					...browserHeaders,
					'cf-connecting-ip': ip,
					'x-real-ip': 'bad',
					'x-forwarded-for': 'bad'
				})
				expect(reply.status).toBe(200)
				const headers = JSON.parse(reply.body)
				for (const name of ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for']) {
					expect(headers[name]).toBe(ip || '127.0.0.1')
				}
			}
		}
	})

	test('still rate limits a single browser visitor, with retry and non-cacheable response headers', async () => {
		// Stay below the connection cap so this exercises the per-client request budget.
		const replies: Reply[] = []
		for (let batch = 0; batch < 12; batch++) {
			replies.push(
				...(await Promise.all(
					Array.from({ length: 20 }, () =>
						gateway.send('/rpc', { ...browserHeaders, 'cf-connecting-ip': visitor(1) })
					)
				))
			)
		}
		expect(replies.some((reply) => reply.status === 200)).toBe(true)
		const limited = replies.filter((reply) => reply.status === 429)
		expect(limited.length).toBeGreaterThan(0)
		for (const reply of limited) {
			expect(reply.headers['cache-control']).toBe('no-store')
			expect(reply.headers['retry-after']).toBe('1')
		}
		expect(
			(await gateway.logs()).some(
				(log) =>
					log.status === 429 && log.limit_req_status === 'REJECTED' && log.upstream_status === ''
			)
		).toBe(true)
	})

	test('keeps browser reads, HTML, same-origin writes, assets, and webhooks usable during a crawler flood', async () => {
		const crawl = await Promise.all(
			Array.from({ length: 800 }, (_, i) =>
				gateway.send('/crawl', { 'cf-connecting-ip': visitor(i) })
			)
		)
		expect(crawl.some((reply) => reply.status === 429)).toBe(true)
		const probes: { path: string; headers: Record<string, string>; method?: string }[] = [
			{ path: '/rpc', headers: browserHeaders },
			{ path: '/rpc', headers: browserHeaders, method: 'HEAD' },
			{ path: '/page', headers: { accept: 'text/html' } },
			{ path: '/rpc', headers: { origin: 'https://sveltesociety.dev' }, method: 'POST' },
			{ path: '/rpc', headers: { origin: 'https://www.sveltesociety.dev' }, method: 'POST' },
			{ path: '/_app/immutable/test.js', headers: {} },
			{ path: '/api/webhooks/test', headers: {}, method: 'POST' }
		]
		// These control requests run alongside the exempt probes, proving the
		// crawler budget is still saturated while browser traffic succeeds.
		const controls = Promise.all(
			Array.from({ length: 40 }, (_, i) =>
				gateway.send('/crawl-control', { 'cf-connecting-ip': visitor(2_000 + i) })
			)
		)
		const replies = await Promise.all(
			probes.flatMap((probe, index) =>
				Array.from({ length: 40 }, (_, i) =>
					gateway.send(
						probe.path,
						{
							...probe.headers,
							'cf-connecting-ip': visitor(1_000 + index * 40 + i)
						},
						probe.method
					)
				)
			)
		)
		expect(replies.every((reply) => reply.status === 200)).toBe(true)
		expect((await controls).some((reply) => reply.status === 429)).toBe(true)
	})

	test('exempts webhook delivery from request limits while keeping its connection cap', async () => {
		const replies: Reply[] = []
		for (let batch = 0; batch < 12; batch++) {
			replies.push(
				...(await Promise.all(
					Array.from({ length: 20 }, () =>
						gateway.send('/api/webhooks/test', { 'cf-connecting-ip': visitor(1) }, 'POST')
					)
				))
			)
		}
		expect(replies.every((reply) => reply.status === 200)).toBe(true)
	})

	test('does not turn same-site, cross-site, or Origin-less writes into browser exemptions', async () => {
		const untrusted: { headers: Record<string, string>; method?: string }[] = [
			{ headers: { 'sec-fetch-site': 'same-site' } },
			{ headers: { 'sec-fetch-site': 'cross-site' } },
			{ headers: { ...browserHeaders, origin: 'https://other.example' } },
			{ headers: browserHeaders, method: 'POST' }
		]
		for (const [index, options] of untrusted.entries()) {
			const replies = await Promise.all(
				Array.from({ length: 500 }, (_, i) =>
					gateway.send(
						'/crawl',
						{
							...options.headers,
							'cf-connecting-ip': visitor(index * 500 + i)
						},
						options.method
					)
				)
			)
			expect(replies.some((reply) => reply.status === 429)).toBe(true)
		}
	})

	test('keeps the per-client connection cap while allowing another visitor through the same peer', async () => {
		const pending = Array.from({ length: 60 }, () =>
			gateway.send('/api/webhooks/hold', { 'cf-connecting-ip': visitor(1) })
		)
		await waitFor(() => gateway.held.length === 50, '50 upstream requests')
		const otherVisitor = await gateway.send('/rpc', {
			...browserHeaders,
			'cf-connecting-ip': visitor(2)
		})
		expect(otherVisitor.status).toBe(200)
		await waitFor(
			async () =>
				(await gateway.logs()).filter((log) => log.limit_conn_status === 'REJECTED').length === 10,
			'connection rejections'
		)
		for (const release of gateway.held) release()
		const replies = await Promise.all(pending)
		expect(replies.filter((reply) => reply.status === 200)).toHaveLength(50)
		expect(replies.filter((reply) => reply.status === 429)).toHaveLength(10)
	})

	test('preserves application 429 responses and identifies their upstream origin in logs', async () => {
		const reply = await gateway.send('/upstream-429', {
			...browserHeaders,
			'cf-connecting-ip': visitor(1)
		})
		expect(reply.status).toBe(429)
		expect(reply.body).toBe('application rate limit')
		expect(reply.headers['retry-after']).toBe('17')
		expect(reply.headers['cache-control']).toBe('private, no-store')
		expect((await gateway.logs()).find((log) => log.uri === '/upstream-429')).toMatchObject({
			status: 429,
			upstream_status: '429',
			limit_req_status: 'PASSED'
		})
	})
})
