import type { Handle } from '@sveltejs/kit'

const PER_IP_MINUTE_LIMIT = 30
const PER_IP_SECOND_LIMIT = 4
const GLOBAL_SECOND_LIMIT = 30
const WINDOW_MS = 60_000

type ClientWindow = {
	startedAt: number
	count: number
	second: number
	secondCount: number
}

const clients = new Map<string, ClientWindow>()
let globalSecond = 0
let globalCount = 0
let lastCleanup = 0

function rateLimited(retryAfter: string): Response {
	return new Response('Too many requests', {
		status: 429,
		headers: { 'Retry-After': retryAfter }
	})
}

export const request_guard: Handle = async ({ event, resolve }) => {
	const now = Date.now()
	const second = Math.floor(now / 1000)
	const ip = event.request.headers.get('cf-connecting-ip') ?? event.getClientAddress()
	let client = clients.get(ip)

	if (!client || now - client.startedAt >= WINDOW_MS) {
		client = { startedAt: now, count: 0, second, secondCount: 0 }
		clients.set(ip, client)
	}

	if (client.second !== second) {
		client.second = second
		client.secondCount = 0
	}
	client.count += 1
	client.secondCount += 1

	// Reject abusive clients before they consume the shared origin allowance.
	if (client.secondCount > PER_IP_SECOND_LIMIT) return rateLimited('1')
	if (client.count > PER_IP_MINUTE_LIMIT) return rateLimited('60')

	if (second !== globalSecond) {
		globalSecond = second
		globalCount = 0
	}
	globalCount += 1
	const isBrowserNavigation =
		event.request.method === 'GET' && event.request.headers.get('accept')?.includes('text/html')
	if (!isBrowserNavigation && globalCount > GLOBAL_SECOND_LIMIT) return rateLimited('1')

	if (now - lastCleanup >= WINDOW_MS) {
		lastCleanup = now
		for (const [clientIp, entry] of clients) {
			if (now - entry.startedAt >= WINDOW_MS) clients.delete(clientIp)
		}
	}

	return resolve(event)
}
