import { describe, it, expect } from 'vitest'
import { generateOrganizationSchema } from './organization'
import { generateWebSiteSchema } from './website'
import { generateVideoSchema } from './video'
import { generateArticleSchema } from './article'
import { generateSoftwareSchema } from './software'
import { generateBreadcrumbSchema } from './breadcrumb'
import { SEO_CONFIG } from '../config'

describe('Schema Generators', () => {
	describe('generateOrganizationSchema', () => {
		it('should generate valid Organization schema', () => {
			const schema = generateOrganizationSchema()

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('Organization')
			expect(schema.name).toBe(SEO_CONFIG.siteName)
			expect(schema.url).toBe(SEO_CONFIG.siteUrl)
			expect(schema.logo).toBe(`${SEO_CONFIG.siteUrl}${SEO_CONFIG.logoUrl}`)
			expect(schema.description).toBe(SEO_CONFIG.defaultDescription)
			expect(schema.sameAs).toEqual([
				`https://twitter.com/${SEO_CONFIG.twitterHandle}`,
				`https://github.com/${SEO_CONFIG.githubOrg}`
			])
		})
	})

	describe('generateWebSiteSchema', () => {
		it('should generate valid WebSite schema with SearchAction', () => {
			const schema = generateWebSiteSchema()

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('WebSite')
			expect(schema.name).toBe(SEO_CONFIG.siteName)
			expect(schema.url).toBe(SEO_CONFIG.siteUrl)
			expect(schema.potentialAction).toBeDefined()
			expect(schema.potentialAction?.['@type']).toBe('SearchAction')
			expect(schema.potentialAction?.target['@type']).toBe('EntryPoint')
			expect(schema.potentialAction?.target.urlTemplate).toBe(
				`${SEO_CONFIG.siteUrl}/?q={search_term_string}`
			)
			expect(schema.potentialAction?.['query-input']).toBe('required name=search_term_string')
		})
	})

	describe('generateVideoSchema', () => {
		it('should generate valid VideoObject schema', () => {
			const input = {
				title: 'Test Video',
				description: 'Test video description',
				thumbnailUrl: 'https://example.com/thumb.jpg',
				uploadDate: '2025-01-01T00:00:00Z',
				contentUrl: 'https://youtube.com/watch?v=123',
				embedUrl: 'https://youtube.com/embed/123',
				authorName: 'Test Author',
				authorUrl: 'https://example.com/author',
				dateModified: '2025-01-15T00:00:00Z'
			}

			const schema = generateVideoSchema(input)

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('VideoObject')
			expect(schema.name).toBe(input.title)
			expect(schema.description).toBe(input.description)
			expect(schema.thumbnailUrl).toBe(input.thumbnailUrl)
			expect(schema.uploadDate).toBe(input.uploadDate)
			expect(schema.contentUrl).toBe(input.contentUrl)
			expect(schema.embedUrl).toBe(input.embedUrl)
			expect(schema.author).toEqual({
				'@type': 'Person',
				name: input.authorName,
				url: input.authorUrl
			})
			expect(schema.dateModified).toBe(input.dateModified)
		})

		it('should handle optional fields', () => {
			const input = {
				title: 'Test Video',
				description: 'Test video description',
				thumbnailUrl: 'https://example.com/thumb.jpg',
				uploadDate: '2025-01-01T00:00:00Z'
			}

			const schema = generateVideoSchema(input)

			expect(schema.contentUrl).toBeUndefined()
			expect(schema.embedUrl).toBeUndefined()
			expect(schema.author).toBeUndefined()
			expect(schema.dateModified).toBeUndefined()
		})
	})

	describe('generateArticleSchema', () => {
		it('should generate valid TechArticle schema', () => {
			const input = {
				headline: 'Test Article',
				description: 'Test article description',
				datePublished: '2025-01-01T00:00:00Z',
				dateModified: '2025-01-15T00:00:00Z',
				authorName: 'Test Author',
				authorUrl: 'https://example.com/author',
				imageUrl: 'https://example.com/image.jpg',
				url: 'https://example.com/article'
			}

			const schema = generateArticleSchema(input)

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('TechArticle')
			expect(schema.headline).toBe(input.headline)
			expect(schema.description).toBe(input.description)
			expect(schema.datePublished).toBe(input.datePublished)
			expect(schema.dateModified).toBe(input.dateModified)
			expect(schema.author).toEqual({
				'@type': 'Person',
				name: input.authorName,
				url: input.authorUrl
			})
			expect(schema.image).toBe(input.imageUrl)
			expect(schema.url).toBe(input.url)
		})

		it('should handle optional fields', () => {
			const input = {
				headline: 'Test Article',
				description: 'Test article description',
				datePublished: '2025-01-01T00:00:00Z',
				dateModified: '2025-01-15T00:00:00Z'
			}

			const schema = generateArticleSchema(input)

			expect(schema.author).toBeUndefined()
			expect(schema.image).toBeUndefined()
			expect(schema.url).toBeUndefined()
		})
	})

	describe('generateSoftwareSchema', () => {
		it('should generate valid SoftwareSourceCode schema', () => {
			const input = {
				name: 'Test Library',
				description: 'Test library description',
				codeRepository: 'https://github.com/test/repo',
				programmingLanguage: 'TypeScript',
				authorName: 'Test Author',
				authorUrl: 'https://example.com/author',
				datePublished: '2025-01-01T00:00:00Z',
				dateModified: '2025-01-15T00:00:00Z'
			}

			const schema = generateSoftwareSchema(input)

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('SoftwareSourceCode')
			expect(schema.name).toBe(input.name)
			expect(schema.description).toBe(input.description)
			expect(schema.codeRepository).toBe(input.codeRepository)
			expect(schema.programmingLanguage).toBe(input.programmingLanguage)
			expect(schema.author).toEqual({
				'@type': 'Person',
				name: input.authorName,
				url: input.authorUrl
			})
			expect(schema.datePublished).toBe(input.datePublished)
			expect(schema.dateModified).toBe(input.dateModified)
		})

		it('should default to JavaScript if no language provided', () => {
			const input = {
				name: 'Test Library',
				description: 'Test library description'
			}

			const schema = generateSoftwareSchema(input)

			expect(schema.programmingLanguage).toBe('JavaScript')
		})

		it('should handle optional fields', () => {
			const input = {
				name: 'Test Library',
				description: 'Test library description'
			}

			const schema = generateSoftwareSchema(input)

			expect(schema.codeRepository).toBeUndefined()
			expect(schema.author).toBeUndefined()
			expect(schema.datePublished).toBeUndefined()
			expect(schema.dateModified).toBeUndefined()
		})
	})

	describe('generateBreadcrumbSchema', () => {
		it('should generate valid BreadcrumbList schema', () => {
			const items = [
				{ name: 'Home', url: 'https://sveltesociety.dev' },
				{ name: 'Recipes', url: 'https://sveltesociety.dev/recipe' },
				{ name: 'Form Validation', url: 'https://sveltesociety.dev/recipe/form-validation' }
			]

			const schema = generateBreadcrumbSchema(items)

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('BreadcrumbList')
			expect(schema.itemListElement).toHaveLength(3)

			schema.itemListElement.forEach((item, index) => {
				expect(item['@type']).toBe('ListItem')
				expect(item.position).toBe(index + 1)
				expect(item.name).toBe(items[index].name)
				expect(item.item).toBe(items[index].url)
			})
		})

		it('should handle single breadcrumb item', () => {
			const items = [{ name: 'Home', url: 'https://sveltesociety.dev' }]

			const schema = generateBreadcrumbSchema(items)

			expect(schema.itemListElement).toHaveLength(1)
			expect(schema.itemListElement[0].position).toBe(1)
		})

		it('should handle empty array', () => {
			const items: Array<{ name: string; url: string }> = []

			const schema = generateBreadcrumbSchema(items)

			expect(schema.itemListElement).toHaveLength(0)
		})
	})

	describe('Schema validation', () => {
		it('should generate valid JSON-LD', () => {
			const schema = generateOrganizationSchema()
			const json = JSON.stringify(schema)

			expect(() => JSON.parse(json)).not.toThrow()
		})

		it('should not include undefined properties in JSON output', () => {
			const schema = generateVideoSchema({
				title: 'Test',
				description: 'Test',
				thumbnailUrl: 'https://example.com/thumb.jpg',
				uploadDate: '2025-01-01T00:00:00Z'
			})

			const json = JSON.stringify(schema)
			const parsed = JSON.parse(json)

			expect(parsed.contentUrl).toBeUndefined()
			expect(parsed.embedUrl).toBeUndefined()
			expect(parsed.author).toBeUndefined()
		})
	})
})
