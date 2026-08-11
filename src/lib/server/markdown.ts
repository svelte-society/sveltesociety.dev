import DOMPurify, { type Config, type UponSanitizeAttributeHook } from 'isomorphic-dompurify'
import { marked } from 'marked'
import markedShiki from 'marked-shiki'
import { createHighlighter, type Highlighter } from 'shiki'

const DATA_URI_ATTRIBUTES = new Set(['href', 'src', 'xlink:href'])
const URI_WHITESPACE = /[\u0000-\u0020\u007f-\u009f\u00a0\u1680\u180e\u2000-\u2029\u205f\u3000]/g
const DATA_SCHEME = /^data:/i

const removeDataUri: UponSanitizeAttributeHook = (_element, hookEvent) => {
	if (
		DATA_URI_ATTRIBUTES.has(hookEvent.attrName) &&
		DATA_SCHEME.test(hookEvent.attrValue.replace(URI_WHITESPACE, ''))
	) {
		hookEvent.keepAttr = false
	}
}

DOMPurify.addHook('uponSanitizeAttribute', removeDataUri)

const SANITIZE_CONFIG: Config = {
	USE_PROFILES: { html: true },
	FORBID_TAGS: [
		'script',
		'style',
		'iframe',
		'object',
		'embed',
		'form',
		'input',
		'button',
		'textarea',
		'select',
		'option',
		'template',
		'base',
		'link',
		'meta'
	],
	FORBID_ATTR: ['formaction', 'srcdoc'],
	SANITIZE_NAMED_PROPS: true
}

const SANITIZE_CACHE_LIMIT = 500
const sanitizeCache = new Map<string, string>()

export function sanitizeHtml(html: string): string {
	const cached = sanitizeCache.get(html)
	if (cached !== undefined) {
		// Refresh insertion order so frequently read content remains cached.
		sanitizeCache.delete(html)
		sanitizeCache.set(html, cached)
		return cached
	}

	const sanitized = DOMPurify.sanitize(html, SANITIZE_CONFIG)
	sanitizeCache.set(html, sanitized)

	if (sanitizeCache.size > SANITIZE_CACHE_LIMIT) {
		const oldest = sanitizeCache.keys().next().value
		if (oldest !== undefined) sanitizeCache.delete(oldest)
	}

	return sanitized
}

let highlighter: Highlighter | null = null

async function getHighlighter(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['github-light'],
			langs: ['javascript', 'typescript', 'svelte', 'html', 'css', 'json', 'bash', 'shell']
		})
	}
	return highlighter
}

let markedConfigured = false

async function configureMarked(): Promise<void> {
	if (markedConfigured) return

	const hl = await getHighlighter()

	marked.use(
		markedShiki({
			highlight(code, lang) {
				const language = hl.getLoadedLanguages().includes(lang) ? lang : 'text'
				return hl.codeToHtml(code, {
					lang: language,
					theme: 'github-light'
				})
			}
		})
	)

	markedConfigured = true
}

/**
 * Render markdown to HTML with syntax highlighting via shiki.
 * This is async because shiki needs to be initialized on first use.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
	await configureMarked()
	return sanitizeHtml(await marked(markdown))
}
