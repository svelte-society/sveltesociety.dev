import { describe, expect, test } from 'bun:test'
import { renderMarkdown, sanitizeHtml } from './markdown'

describe('sanitizeHtml', () => {
	test.each([
		'<script>alert(1)</script>',
		'<img src=x onerror=alert(1)>',
		'<a href="javascript:alert(1)">click</a>',
		'<svg><a xlink:href="javascript:alert(1)">x</a></svg>',
		'<math><mi>x</mi></math>',
		'<iframe srcdoc="<script>alert(1)</script>"></iframe>',
		'<form><button formaction="javascript:alert(1)">x</button></form>'
	])('removes executable markup from %s', (payload) => {
		const sanitized = sanitizeHtml(payload)
		expect(sanitized).not.toMatch(/script|onerror|javascript:|<svg|<math|<iframe|<form|formaction/i)
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
