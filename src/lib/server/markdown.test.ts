import { describe, expect, test } from 'bun:test'
import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
	test('removes inline event handlers', async () => {
		const html = await renderMarkdown('<img src=x onerror=alert(1)>')
		expect(html).toContain('<img')
		expect(html).not.toContain('onerror')
	})

	test('removes script tags', async () => {
		const html = await renderMarkdown('safe<script>alert(1)</script>')
		expect(html).toContain('safe')
		expect(html).not.toContain('<script>')
		expect(html).not.toContain('alert(1)')
	})
})
