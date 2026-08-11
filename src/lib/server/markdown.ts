import sanitizeHtmlLibrary from 'sanitize-html'
import { marked } from 'marked'
import markedShiki from 'marked-shiki'
import { createHighlighter, type Highlighter } from 'shiki'

const SANITIZE_CONFIG: sanitizeHtmlLibrary.IOptions = {
	allowedTags: [
		...sanitizeHtmlLibrary.defaults.allowedTags,
		'img',
		'figure',
		'figcaption'
	],
	allowedAttributes: {
		'*': ['class', 'style', 'title'],
		a: ['href', 'target', 'rel'],
		img: ['src', 'srcset', 'alt', 'width', 'height', 'loading'],
		code: ['class'],
		pre: ['class'],
		span: ['class', 'style']
	},
	allowedSchemes: ['http', 'https', 'mailto', 'tel'],
	allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
	allowProtocolRelative: true,
	disallowedTagsMode: 'discard',
	nonTextTags: ['style', 'script', 'textarea', 'option']
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

	const sanitized = sanitizeHtmlLibrary(html, SANITIZE_CONFIG)
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
