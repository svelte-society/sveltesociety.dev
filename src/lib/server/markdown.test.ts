import { describe, expect, test } from 'bun:test'
import { JSDOM } from 'jsdom'
import { renderMarkdown, sanitizeHtml } from './markdown'

const ACTIVE_TAGS = [
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
	'meta',
	'svg',
	'math'
].join(',')

const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href', 'action', 'formaction'])
const DANGEROUS_SCHEME = /^(?:javascript|vbscript|data):/i

function inspectExecutableMarkup(html: string) {
	const document = new JSDOM(html).window.document
	const activeTags = Array.from(document.querySelectorAll(ACTIVE_TAGS), (element) =>
		element.tagName.toLowerCase()
	)
	const eventHandlers: string[] = []
	const dangerousUrls: string[] = []

	for (const element of document.querySelectorAll('*')) {
		for (const attribute of element.attributes) {
			const name = attribute.name.toLowerCase()
			if (name.startsWith('on')) eventHandlers.push(name)

			const normalizedValue = attribute.value.replace(/[\u0000-\u0020\u007f-\u009f]/g, '')
			if (URL_ATTRIBUTES.has(name) && DANGEROUS_SCHEME.test(normalizedValue)) {
				dangerousUrls.push(`${name}=${normalizedValue}`)
			}
		}
	}

	return { activeTags, eventHandlers, dangerousUrls }
}

describe('sanitizeHtml', () => {
	test('parser inspection detects unsanitized executable markup', () => {
		expect(
			inspectExecutableMarkup(
				'<script>alert(1)</script><img src=x onload=alert(1)><a href="java&#x73;cript:alert(1)">x</a>'
			)
		).toEqual({
			activeTags: ['script'],
			eventHandlers: ['onload'],
			dangerousUrls: ['href=javascript:alert(1)']
		})
	})

	test.each([
		'<script>alert(1)</script>',
		'<img src=x onerror=alert(1)>',
		'<img src=x onload=alert(1)>',
		'<a href="javascript:alert(1)">click</a>',
		'<a href="java&#x73;cript:alert(1)">click</a>',
		'<svg><a xlink:href="javascript:alert(1)">x</a></svg>',
		'<math><mi>x</mi></math>',
		'<iframe srcdoc="<script>alert(1)</script>"></iframe>',
		'<form><button formaction="javascript:alert(1)">x</button></form>',
		'<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=alert(1)>">',
		'<noscript><p title="</noscript><img src=x onload=alert(1)>">'
	])('removes executable markup from %s', (payload) => {
		const sanitized = sanitizeHtml(payload)
		expect(inspectExecutableMarkup(sanitized)).toEqual({
			activeTags: [],
			eventHandlers: [],
			dangerousUrls: []
		})
	})

	test('preserves safe Markdown and Shiki structures', async () => {
		const rendered = await renderMarkdown(
			'# Heading\n\n[Safe](https://example.com)\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n```svelte\n<h1>{title}</h1>\n```'
		)
		expect(rendered).toContain('<h1>Heading</h1>')
		expect(rendered).toContain('href="https://example.com"')
		expect(rendered).toContain('<table>')
		expect(rendered).toContain('<pre')
		expect(rendered).toContain('<span')
		expect(rendered).toContain('style="')
	})
})
