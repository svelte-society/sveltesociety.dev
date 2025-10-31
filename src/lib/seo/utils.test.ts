import { describe, expect, test } from 'bun:test'
import {
	formatMetaDescription,
	sanitizeTitle,
	getAbsoluteUrl,
	getOgImageUrl,
	escapeJsonLd,
	toIso8601,
	getOgType,
	getSchemaType,
	formatContentType,
	buildSeoConfig,
	buildHomepageMeta,
	buildContentMeta,
	buildCategoryMeta,
	buildStaticPageMeta
} from '$lib/seo/utils'
import { SEO_CONFIG } from '$lib/seo/config'

describe('SEO Utility Functions', () => {
	describe('formatMetaDescription', () => {
		test('returns description when under max length', () => {
			const desc = 'This is a short description'
			expect(formatMetaDescription(desc)).toBe(desc)
		})

		test('truncates long descriptions at word boundary', () => {
			const longDesc = 'a'.repeat(200)
			const result = formatMetaDescription(longDesc)
			expect(result.length).toBeLessThanOrEqual(163) // 160 + "..."
			expect(result).toContain('...')
		})

		test('removes extra whitespace', () => {
			const desc = 'This  has   extra    spaces'
			const result = formatMetaDescription(desc)
			expect(result).toBe('This has extra spaces')
		})

		test('returns default when empty', () => {
			expect(formatMetaDescription('')).toBe(SEO_CONFIG.defaultDescription)
		})
	})

	describe('sanitizeTitle', () => {
		test('returns title when under max length', () => {
			const title = 'Short Title'
			expect(sanitizeTitle(title)).toBe(title)
		})

		test('truncates long titles', () => {
			const longTitle = 'a'.repeat(100)
			const result = sanitizeTitle(longTitle)
			expect(result.length).toBeLessThanOrEqual(60)
		})

		test('removes extra whitespace', () => {
			const title = 'Title  with   spaces'
			expect(sanitizeTitle(title)).toBe('Title with spaces')
		})

		test('returns default when empty', () => {
			expect(sanitizeTitle('')).toBe(SEO_CONFIG.defaultTitle)
		})
	})

	describe('getAbsoluteUrl', () => {
		test('converts relative path to absolute URL', () => {
			const result = getAbsoluteUrl('/about')
			expect(result).toBe('https://sveltesociety.dev/about')
		})

		test('handles path without leading slash', () => {
			const result = getAbsoluteUrl('about')
			expect(result).toBe('https://sveltesociety.dev/about')
		})

		test('removes double slashes', () => {
			const result = getAbsoluteUrl('//about')
			expect(result).toBe('https://sveltesociety.dev/about')
		})
	})

	describe('getOgImageUrl', () => {
		test('generates OG image URL from slug', () => {
			const result = getOgImageUrl('my-awesome-post')
			expect(result).toBe('/og-image/my-awesome-post')
		})
	})

	describe('escapeJsonLd', () => {
		test('escapes quotes', () => {
			expect(escapeJsonLd('Say "hello"')).toBe('Say \\"hello\\"')
		})

		test('escapes backslashes', () => {
			expect(escapeJsonLd('Path\\to\\file')).toBe('Path\\\\to\\\\file')
		})

		test('escapes newlines', () => {
			expect(escapeJsonLd('Line 1\nLine 2')).toBe('Line 1\\nLine 2')
		})

		test('returns empty string for empty input', () => {
			expect(escapeJsonLd('')).toBe('')
		})
	})

	describe('toIso8601', () => {
		test('converts Date object to ISO 8601', () => {
			const date = new Date('2024-01-15T10:30:00Z')
			const result = toIso8601(date)
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
		})

		test('converts date string to ISO 8601', () => {
			const result = toIso8601('2024-01-15')
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/)
		})

		test('returns current date for empty input', () => {
			const result = toIso8601('')
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/)
		})
	})

	describe('getOgType', () => {
		test('returns video.other for video content', () => {
			expect(getOgType('video')).toBe('video.other')
		})

		test('returns article for recipe content', () => {
			expect(getOgType('recipe')).toBe('article')
		})

		test('returns article for library content', () => {
			expect(getOgType('library')).toBe('article')
		})

		test('returns website for collection content', () => {
			expect(getOgType('collection')).toBe('website')
		})

		test('returns article for announcement content', () => {
			expect(getOgType('announcement')).toBe('article')
		})

		test('returns website for unknown content type', () => {
			expect(getOgType('unknown')).toBe('website')
		})
	})

	describe('getSchemaType', () => {
		test('returns VideoObject for video content', () => {
			expect(getSchemaType('video')).toBe('VideoObject')
		})

		test('returns TechArticle for recipe content', () => {
			expect(getSchemaType('recipe')).toBe('TechArticle')
		})

		test('returns SoftwareSourceCode for library content', () => {
			expect(getSchemaType('library')).toBe('SoftwareSourceCode')
		})

		test('returns Article for unknown content type', () => {
			expect(getSchemaType('unknown')).toBe('Article')
		})
	})

	describe('formatContentType', () => {
		test('capitalizes content type', () => {
			expect(formatContentType('recipe')).toBe('Recipe')
			expect(formatContentType('video')).toBe('Video')
		})
	})

	describe('buildSeoConfig', () => {
		test('builds complete config with defaults', () => {
			const config = buildSeoConfig({
				title: 'Test Page',
				description: 'Test description',
				url: 'https://example.com/test'
			})

			expect(config.title).toBe('Test Page')
			expect(config.description).toBe('Test description')
			expect(config.url).toBe('https://example.com/test')
			expect(config.type).toBe('website')
			expect(config.siteName).toBe('Svelte Society')
			expect(config.locale).toBe('en_US')
			expect(config.imageWidth).toBe(1200)
			expect(config.imageHeight).toBe(630)
		})

		test('includes Twitter Card configuration', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com'
			})

			expect(config.twitter).toBeDefined()
			expect(config.twitter?.card).toBe('summary_large_image')
			expect(config.twitter?.site).toBe('@sveltesociety')
		})

		test('uses default image when not provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com'
			})

			expect(config.image).toBe('/og-default.png')
		})

		test('uses custom image when provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com',
				image: '/custom-image.png'
			})

			expect(config.image).toBe('/custom-image.png')
		})

		test('includes article metadata when provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com',
				article: {
					publishedTime: '2024-01-15T10:00:00Z',
					author: 'John Doe'
				}
			})

			expect(config.article).toBeDefined()
			expect(config.article?.publishedTime).toBe('2024-01-15T10:00:00Z')
			expect(config.article?.author).toBe('John Doe')
		})
	})

	describe('buildHomepageMeta', () => {
		test('builds homepage meta configuration', () => {
			const meta = buildHomepageMeta()

			expect(meta.title).toBe('Svelte Society - Community of Svelte Developers')
			expect(meta.description).toContain('Discover recipes, videos, libraries')
			expect(meta.url).toBe('https://sveltesociety.dev')
			expect(meta.type).toBe('website')
			expect(meta.twitter?.card).toBe('summary_large_image')
		})
	})

	describe('buildContentMeta', () => {
		test('builds recipe content meta with article type', () => {
			const content = {
				title: 'My Recipe',
				description: 'A great recipe',
				type: 'recipe',
				slug: 'my-recipe',
				published_at: '2024-01-15',
				updated_at: '2024-01-20'
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/recipe/my-recipe')

			expect(meta.title).toBe('My Recipe - Svelte Society')
			expect(meta.description).toBe('A great recipe')
			expect(meta.type).toBe('article')
			expect(meta.image).toBe('/og-image/my-recipe')
			expect(meta.article).toBeDefined()
			expect(meta.article?.section).toBe('Recipe')
		})

		test('builds video content meta with video type', () => {
			const content = {
				title: 'My Video',
				description: 'A great video',
				type: 'video',
				slug: 'my-video'
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/video/my-video')

			expect(meta.title).toBe('My Video - Svelte Society')
			expect(meta.type).toBe('video.other')
		})

		test('generates description when not provided', () => {
			const content = {
				title: 'My Content',
				type: 'recipe',
				slug: 'my-content'
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/recipe/my-content')

			expect(meta.description).toBe('View My Content on Svelte Society')
		})

		test('includes published and modified times when available', () => {
			const content = {
				title: 'My Article',
				type: 'recipe',
				slug: 'my-article',
				published_at: '2024-01-15T10:00:00Z',
				updated_at: '2024-01-20T15:30:00Z'
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/recipe/my-article')

			expect(meta.article?.publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
			expect(meta.article?.modifiedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
		})
	})

	describe('buildCategoryMeta', () => {
		test('builds category meta configuration', () => {
			const meta = buildCategoryMeta('recipe', 'https://sveltesociety.dev/recipe')

			expect(meta.title).toBe('Recipe - Svelte Society')
			expect(meta.description).toBe('Browse recipe from the Svelte Society community')
			expect(meta.type).toBe('website')
			expect(meta.url).toBe('https://sveltesociety.dev/recipe')
		})

		test('capitalizes category type', () => {
			const meta = buildCategoryMeta('video', 'https://sveltesociety.dev/video')

			expect(meta.title).toContain('Video')
			expect(meta.description).toContain('video')
		})
	})

	describe('buildStaticPageMeta', () => {
		test('builds static page meta configuration', () => {
			const meta = buildStaticPageMeta(
				'About',
				'Learn about Svelte Society',
				'https://sveltesociety.dev/about'
			)

			expect(meta.title).toBe('About - Svelte Society')
			expect(meta.description).toBe('Learn about Svelte Society')
			expect(meta.type).toBe('website')
			expect(meta.url).toBe('https://sveltesociety.dev/about')
		})
	})
})

describe('SEO Config Integration', () => {
	test('all meta builders include required OG fields', () => {
		const configs = [
			buildHomepageMeta(),
			buildContentMeta(
				{
					title: 'Test',
					type: 'recipe',
					slug: 'test'
				},
				'https://example.com'
			),
			buildCategoryMeta('recipe', 'https://example.com'),
			buildStaticPageMeta('Test', 'Test description', 'https://example.com')
		]

		configs.forEach((config) => {
			expect(config.title).toBeDefined()
			expect(config.description).toBeDefined()
			expect(config.url).toBeDefined()
			expect(config.type).toBeDefined()
			expect(config.image).toBeDefined()
			expect(config.siteName).toBeDefined()
			expect(config.locale).toBeDefined()
			expect(config.imageWidth).toBeDefined()
			expect(config.imageHeight).toBeDefined()
		})
	})

	test('all meta builders include Twitter Card config', () => {
		const configs = [
			buildHomepageMeta(),
			buildContentMeta(
				{
					title: 'Test',
					type: 'recipe',
					slug: 'test'
				},
				'https://example.com'
			),
			buildCategoryMeta('recipe', 'https://example.com'),
			buildStaticPageMeta('Test', 'Test description', 'https://example.com')
		]

		configs.forEach((config) => {
			expect(config.twitter).toBeDefined()
			expect(config.twitter?.card).toBe('summary_large_image')
			expect(config.twitter?.site).toBe('@sveltesociety')
		})
	})

	test('descriptions are within length limits', () => {
		const longDescription = 'a'.repeat(200)
		const meta = buildSeoConfig({
			title: 'Test',
			description: longDescription,
			url: 'https://example.com'
		})

		expect(meta.description.length).toBeLessThanOrEqual(163) // 160 + "..."
	})

	test('titles include site name suffix', () => {
		const contentMeta = buildContentMeta(
			{
				title: 'My Content',
				type: 'recipe',
				slug: 'test'
			},
			'https://example.com'
		)

		expect(contentMeta.title).toContain('Svelte Society')
	})
})
