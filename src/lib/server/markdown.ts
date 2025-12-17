import { marked } from 'marked'
import markedShiki from 'marked-shiki'
import { createHighlighter, type Highlighter } from 'shiki'

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
	return marked(markdown) as string
}
