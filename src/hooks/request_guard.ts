import type { Handle } from '@sveltejs/kit'

const PER_IP_MINUTE_LIMIT = 300
const PER_IP_SECOND_LIMIT = 20
const GLOBAL_SECOND_LIMIT = 100
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
		headers: { 'Retry-After': retryAfter, 'Cache-Control': 'no-store' }
	})
}

export const request_guard: Handle = async ({ event, resolve }) => {
	const now = Date.now()
	const second = Math.floor(now / 1000)
	// Cloudflare Tunnel preserves this header even though every socket has a proxy peer.
	// The origin must only be reachable through trusted ingress.
	const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress()
	// Expire old entries even when the current request will be rejected.
	if (now - lastCleanup >= WINDOW_MS) {
		lastCleanup = now
		for (const [clientIp, entry] of clients) {
			if (now - entry.startedAt >= WINDOW_MS) clients.delete(clientIp)
		}
	}

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

	const origin = event.request.headers.get('origin')
	const isRead = event.request.method === 'GET' || event.request.method === 'HEAD'
	const isBrowserNavigation =
		event.request.method === 'GET' && event.request.headers.get('accept')?.includes('text/html')
	// Same-origin GET/HEAD fetches (including SvelteKit queries and navigation data)
	// normally omit Origin. Fetch Metadata still identifies them as browser requests.
	const isSameOriginBrowserRequest =
		event.request.headers.get('sec-fetch-site') === 'same-origin' &&
		(origin === event.url.origin || (isRead && !origin))
	const isWebhook = event.url.pathname.startsWith('/api/webhooks/')
	if (!isBrowserNavigation && !isSameOriginBrowserRequest && !isWebhook) {
		if (second !== globalSecond) {
			globalSecond = second
			globalCount = 0
		}
		// Exempt requests must not spend the allowance reserved for non-browser traffic.
		globalCount += 1
		if (globalCount > GLOBAL_SECOND_LIMIT) return rateLimited('1')
	}

	return resolve(event)
}
