import dns from 'node:dns/promises'
import net from 'node:net'

function isPrivateIPv4(ip: string): boolean {
	const parts = ip.split('.').map((part) => Number(part))
	if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
		return true
	}

	const [a, b] = parts
	return (
		a === 10 ||
		a === 127 ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 168) ||
		(a === 100 && b >= 64 && b <= 127) ||
		a === 0
	)
}

function isPrivateIPv6(ip: string): boolean {
	const normalized = ip.toLowerCase()

	if (normalized === '::1' || normalized === '::') return true
	if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true // fc00::/7
	if (normalized.startsWith('fe8') || normalized.startsWith('fe9')) return true // fe80::/10
	if (normalized.startsWith('fea') || normalized.startsWith('feb')) return true

	if (normalized.startsWith('::ffff:')) {
		return isPrivateIPv4(normalized.slice('::ffff:'.length))
	}

	return false
}

function isPrivateIp(ip: string): boolean {
	const type = net.isIP(ip)
	if (type === 4) return isPrivateIPv4(ip)
	if (type === 6) return isPrivateIPv6(ip)
	return true
}

async function resolvesToPrivateAddress(hostname: string): Promise<boolean> {
	const records = await dns.lookup(hostname, { all: true, verbatim: true })
	if (records.length === 0) {
		return true
	}
	return records.some((record) => isPrivateIp(record.address))
}

function isBlockedHostname(hostname: string): boolean {
	const normalized = hostname.toLowerCase().replace(/\.$/, '')
	return (
		normalized === 'localhost' || normalized.endsWith('.localhost') || normalized.endsWith('.local')
	)
}

export async function assertSafeExternalUrl(rawUrl: string): Promise<URL> {
	const parsed = new URL(rawUrl)

	if (!['http:', 'https:'].includes(parsed.protocol)) {
		throw new Error('Unsupported URL protocol')
	}

	if (parsed.username || parsed.password) {
		throw new Error('URLs with credentials are not allowed')
	}

	if (isBlockedHostname(parsed.hostname)) {
		throw new Error('Blocked hostname')
	}

	const hostType = net.isIP(parsed.hostname)
	if (hostType !== 0) {
		if (isPrivateIp(parsed.hostname)) {
			throw new Error('Blocked target host')
		}
		return parsed
	}

	if (await resolvesToPrivateAddress(parsed.hostname)) {
		throw new Error('Blocked target host')
	}

	return parsed
}

const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308])

type SafeFetchOptions = RequestInit & {
	maxRedirects?: number
}

export async function fetchSafeExternalUrl(
	input: string | URL,
	options: SafeFetchOptions = {}
): Promise<{ response: Response; finalUrl: URL }> {
	const { maxRedirects = 3, ...fetchOptions } = options
	let currentUrl =
		typeof input === 'string'
			? await assertSafeExternalUrl(input)
			: await assertSafeExternalUrl(input.toString())

	for (let i = 0; i <= maxRedirects; i++) {
		const response = await fetch(currentUrl, {
			...fetchOptions,
			redirect: 'manual'
		})

		if (REDIRECT_STATUS_CODES.has(response.status)) {
			const location = response.headers.get('location')
			if (!location) {
				throw new Error('Redirect target missing')
			}

			currentUrl = await assertSafeExternalUrl(new URL(location, currentUrl).toString())
			continue
		}

		return { response, finalUrl: currentUrl }
	}

	throw new Error('Too many redirects')
}
