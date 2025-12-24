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
	pluralizeContentType,
	buildSeoConfig,
	buildHomepageMeta,
	buildContentMeta,
	buildCategoryMeta,
	buildStaticPageMeta
} from './utils'
import { SEO_CONFIG } from './config'

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

	describe('pluralizeContentType', () => {
		test('pluralizes known content types correctly', () => {
			expect(pluralizeContentType('library')).toBe('Libraries')
			expect(pluralizeContentType('recipe')).toBe('Recipes')
			expect(pluralizeContentType('video')).toBe('Videos')
			expect(pluralizeContentType('collection')).toBe('Collections')
			expect(pluralizeContentType('announcement')).toBe('Announcements')
			expect(pluralizeContentType('resource')).toBe('Resources')
		})

		test('handles case insensitivity', () => {
			expect(pluralizeContentType('LIBRARY')).toBe('Libraries')
			expect(pluralizeContentType('Recipe')).toBe('Recipes')
		})

		test('falls back to adding s for unknown types', () => {
			expect(pluralizeContentType('widget')).toBe('Widgets')
		})
	})

	describe('buildSeoConfig', () => {
		test('builds complete config with defaults matching Svead API', () => {
			const config = buildSeoConfig({
				title: 'Test Page',
				description: 'Test description',
				url: 'https://example.com/test'
			})

			expect(config.title).toBe('Test Page')
			expect(config.description).toBe('Test description')
			expect(config.url).toBe('https://example.com/test')
			expect(config.site_name).toBe('Svelte Society')
			expect(config.twitter_handle).toBe('@sveltesociety')
			expect(config.twitter_card_type).toBe('summary_large_image')
			expect(config.language).toBe('en')
		})

		test('uses default OG image when not provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com'
			})

			expect(config.open_graph_image).toBe('https://sveltesociety.dev/og-default.png')
		})

		test('uses custom OG image when provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com',
				open_graph_image: 'https://example.com/custom-image.png'
			})

			expect(config.open_graph_image).toBe('https://example.com/custom-image.png')
		})

		test('includes author_name when provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com',
				author_name: 'John Doe'
			})

			expect(config.author_name).toBe('John Doe')
		})

		test('includes og_type when provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com',
				og_type: 'article'
			})

			expect(config.og_type).toBe('article')
		})

		test('includes robots when provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com',
				robots: 'noindex, nofollow'
			})

			expect(config.robots).toBe('noindex, nofollow')
		})

		test('does not include og_type when not provided', () => {
			const config = buildSeoConfig({
				title: 'Test',
				description: 'Test',
				url: 'https://example.com'
			})

			expect(config.og_type).toBeUndefined()
		})
	})

	describe('buildHomepageMeta', () => {
		test('builds homepage meta configuration', () => {
			const meta = buildHomepageMeta()

			expect(meta.title).toBe('Svelte Society - Community of Svelte Developers')
			expect(meta.description).toContain('Discover recipes, videos, libraries')
			expect(meta.url).toBe('https://sveltesociety.dev')
			expect(meta.twitter_card_type).toBe('summary_large_image')
			expect(meta.open_graph_image).toBe('https://sveltesociety.dev/og-default.png')
		})
	})

	describe('buildContentMeta', () => {
		test('builds recipe content meta', () => {
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
			expect(meta.open_graph_image).toBe('https://sveltesociety.dev/og-image/my-recipe')
		})

		test('builds video content meta', () => {
			const content = {
				title: 'My Video',
				description: 'A great video',
				type: 'video',
				slug: 'my-video'
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/video/my-video')

			expect(meta.title).toBe('My Video - Svelte Society')
			expect(meta.open_graph_image).toBe('https://sveltesociety.dev/og-image/my-video')
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

		test('includes author when available', () => {
			const content = {
				title: 'My Article',
				type: 'recipe',
				slug: 'my-article',
				author: 'Jane Doe'
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/recipe/my-article')

			expect(meta.author_name).toBe('Jane Doe')
		})

		test('sets og_type based on content type', () => {
			const videoContent = {
				title: 'My Video',
				type: 'video',
				slug: 'my-video'
			}
			const videoMeta = buildContentMeta(videoContent, 'https://sveltesociety.dev/video/my-video')
			expect(videoMeta.og_type).toBe('video.other')

			const recipeContent = {
				title: 'My Recipe',
				type: 'recipe',
				slug: 'my-recipe'
			}
			const recipeMeta = buildContentMeta(recipeContent, 'https://sveltesociety.dev/recipe/my-recipe')
			expect(recipeMeta.og_type).toBe('article')

			const libraryContent = {
				title: 'My Library',
				type: 'library',
				slug: 'my-library'
			}
			const libraryMeta = buildContentMeta(libraryContent, 'https://sveltesociety.dev/library/my-library')
			expect(libraryMeta.og_type).toBe('article')
		})

		test('handles null published_at and updated_at', () => {
			const content = {
				title: 'My Content',
				type: 'recipe',
				slug: 'my-content',
				published_at: null,
				updated_at: null
			}

			const meta = buildContentMeta(content, 'https://sveltesociety.dev/recipe/my-content')

			expect(meta.title).toBe('My Content - Svelte Society')
		})
	})

	describe('buildCategoryMeta', () => {
		test('builds category meta configuration with pluralized description', () => {
			const meta = buildCategoryMeta('recipe', 'https://sveltesociety.dev/recipe')

			expect(meta.title).toBe('Recipe - Svelte Society')
			expect(meta.description).toBe('Browse recipes from the Svelte Society community')
			expect(meta.url).toBe('https://sveltesociety.dev/recipe')
			expect(meta.og_type).toBe('website')
		})

		test('capitalizes category type in title', () => {
			const meta = buildCategoryMeta('video', 'https://sveltesociety.dev/video')

			expect(meta.title).toContain('Video')
			expect(meta.description).toBe('Browse videos from the Svelte Society community')
		})

		test('handles library pluralization correctly', () => {
			const meta = buildCategoryMeta('library', 'https://sveltesociety.dev/library')

			expect(meta.title).toBe('Library - Svelte Society')
			expect(meta.description).toBe('Browse libraries from the Svelte Society community')
		})

		test('handles resource pluralization correctly', () => {
			const meta = buildCategoryMeta('resource', 'https://sveltesociety.dev/resource')

			expect(meta.title).toBe('Resource - Svelte Society')
			expect(meta.description).toBe('Browse resources from the Svelte Society community')
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
			expect(meta.url).toBe('https://sveltesociety.dev/about')
		})
	})
})

describe('SEO Config Integration', () => {
	test('all meta builders include required Svead fields', () => {
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
			expect(config.open_graph_image).toBeDefined()
			expect(config.site_name).toBeDefined()
			expect(config.twitter_handle).toBeDefined()
			expect(config.twitter_card_type).toBeDefined()
			expect(config.language).toBeDefined()
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
