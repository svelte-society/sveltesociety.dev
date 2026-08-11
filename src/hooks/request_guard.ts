import type { Handle } from '@sveltejs/kit'

const PER_IP_LIMIT = 120
const GLOBAL_LIMIT = 30
const WINDOW_MS = 60_000

const clients = new Map<string, { startedAt: number; count: number }>()
let globalSecond = 0
let globalCount = 0
let lastCleanup = 0

export const request_guard: Handle = async ({ event, resolve }) => {
	const now = Date.now()
	const second = Math.floor(now / 1000)

	if (second !== globalSecond) {
		globalSecond = second
		globalCount = 0
	}
	globalCount += 1

	if (globalCount > GLOBAL_LIMIT) {
		return new Response('Too many requests', { status: 429, headers: { 'Retry-After': '1' } })
	}

	const ip = event.request.headers.get('cf-connecting-ip') ?? event.getClientAddress()
	const existing = clients.get(ip)
	if (!existing || now - existing.startedAt >= WINDOW_MS) {
		clients.set(ip, { startedAt: now, count: 1 })
	} else {
		existing.count += 1
		if (existing.count > PER_IP_LIMIT) {
			return new Response('Too many requests', { status: 429, headers: { 'Retry-After': '60' } })
		}
	}

	if (now - lastCleanup >= WINDOW_MS) {
		lastCleanup = now
		for (const [clientIp, entry] of clients) {
			if (now - entry.startedAt >= WINDOW_MS) clients.delete(clientIp)
		}
	}

	return resolve(event)
}
