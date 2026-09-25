import { describe, expect, test } from 'bun:test'
import { getContentSourceLinks } from './content-sources'

describe('moderation source links', () => {
	test('keeps package and repository links without guessing a monorepo branch', () => {
		expect(
			getContentSourceLinks('library', {
				packageUrl: 'https://github.com/example/ui/tree/next/packages/svelte',
				github: 'https://github.com/example/ui',
				packagePath: 'packages/svelte'
			})
		).toEqual([
			{ label: 'Package', url: 'https://github.com/example/ui/tree/next/packages/svelte' },
			{ label: 'Repository', url: 'https://github.com/example/ui' }
		])
	})

	test.each([
		'javascript:alert(1)',
		'data:text/html,<script>alert(1)</script>',
		'file:///etc/passwd',
		'//example.com',
		'/relative',
		'not a URL',
		'https://',
		'https://trusted.example@untrusted.example',
		null,
		{},
		42
	])('does not render unsafe or invalid URLs: %p', (url) => {
		expect(
			getContentSourceLinks('library', {
				packageUrl: url,
				github: url,
				externalSource: { url }
			})
		).toEqual([])
	})

	test('normalizes and deduplicates valid source links', () => {
		expect(
			getContentSourceLinks('resource', {
				link: ' HTTPS://svelte.dev ',
				externalSource: { url: 'https://svelte.dev/' }
			})
		).toEqual([{ label: 'Resource', url: 'https://svelte.dev/' }])
		expect(getContentSourceLinks('resource', { link: 'http://example.com/docs' })[0].url).toBe(
			'http://example.com/docs'
		)
	})

	test('falls back to imported sources and validated YouTube IDs', () => {
		expect(
			getContentSourceLinks('video', {
				watchUrl: 'javascript:alert(1)',
				externalSource: { url: 'https://www.youtube.com/watch?v=abc123_-XYZ' },
				youtubeVideoId: 'other123456'
			})
		).toEqual([{ label: 'Imported source', url: 'https://www.youtube.com/watch?v=abc123_-XYZ' }])
		expect(getContentSourceLinks('video', { youtubeVideoId: 'abc123_-XYZ' })).toEqual([
			{ label: 'Video', url: 'https://www.youtube.com/watch?v=abc123_-XYZ' }
		])
		expect(getContentSourceLinks('video', { youtubeVideoId: 'abc&redirect=bad' })).toEqual([])
	})

	test('handles missing metadata and preserves source links on other imported types', () => {
		expect(getContentSourceLinks('recipe', null)).toEqual([])
		expect(getContentSourceLinks('recipe', {})).toEqual([])
		expect(
			getContentSourceLinks('announcement', { externalSource: { url: 'https://svelte.dev/blog' } })
		).toEqual([{ label: 'Imported source', url: 'https://svelte.dev/blog' }])
	})
})
