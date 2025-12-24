import { describe, test, expect } from 'bun:test'
import { generateOrganizationSchema } from './organization'
import { generateWebSiteSchema } from './website'
import { generateVideoSchema } from './video'
import { generateArticleSchema } from './article'
import { generateSoftwareSchema } from './software'
import { generateBreadcrumbSchema } from './breadcrumb'
import { generateEventSchema, generateEventListSchema } from './event'
import { SEO_CONFIG } from '../config'

describe('Schema Generators', () => {
	describe('generateOrganizationSchema', () => {
		test('should generate valid Organization schema', () => {
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
		test('should generate valid WebSite schema with SearchAction', () => {
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
		test('should generate valid VideoObject schema', () => {
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

		test('should handle optional fields', () => {
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
		test('should generate valid TechArticle schema', () => {
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

		test('should handle optional fields', () => {
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
		test('should generate valid SoftwareSourceCode schema', () => {
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

		test('should default to JavaScript if no language provided', () => {
			const input = {
				name: 'Test Library',
				description: 'Test library description'
			}

			const schema = generateSoftwareSchema(input)

			expect(schema.programmingLanguage).toBe('JavaScript')
		})

		test('should handle optional fields', () => {
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
		test('should generate valid BreadcrumbList schema', () => {
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

		test('should handle single breadcrumb item', () => {
			const items = [{ name: 'Home', url: 'https://sveltesociety.dev' }]

			const schema = generateBreadcrumbSchema(items)

			expect(schema.itemListElement).toHaveLength(1)
			expect(schema.itemListElement[0].position).toBe(1)
		})

		test('should handle empty array', () => {
			const items: Array<{ name: string; url: string }> = []

			const schema = generateBreadcrumbSchema(items)

			expect(schema.itemListElement).toHaveLength(0)
		})
	})

	describe('generateEventSchema', () => {
		test('should generate valid Event schema', () => {
			const input = {
				name: 'Svelte Society Meetup',
				description: 'Monthly community meetup',
				startDate: '2025-02-15T18:00:00Z',
				endDate: '2025-02-15T20:00:00Z',
				url: 'https://example.com/event',
				imageUrl: 'https://example.com/event.jpg',
				organizerName: 'Svelte Society',
				organizerUrl: 'https://sveltesociety.dev',
				isOnline: true
			}

			const schema = generateEventSchema(input)

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('Event')
			expect(schema.name).toBe(input.name)
			expect(schema.description).toBe(input.description)
			expect(schema.startDate).toBe(input.startDate)
			expect(schema.endDate).toBe(input.endDate)
			expect(schema.url).toBe(input.url)
			expect(schema.image).toBe(input.imageUrl)
			expect(schema.eventStatus).toBe('https://schema.org/EventScheduled')
			expect(schema.eventAttendanceMode).toBe('https://schema.org/OnlineEventAttendanceMode')
			expect(schema.organizer).toEqual({
				'@type': 'Organization',
				name: input.organizerName,
				url: input.organizerUrl
			})
			expect(schema.location).toEqual({
				'@type': 'VirtualLocation',
				url: input.url
			})
		})

		test('should handle offline events with location', () => {
			const input = {
				name: 'Svelte Conf',
				startDate: '2025-06-01T09:00:00Z',
				location: 'San Francisco, CA',
				isOnline: false
			}

			const schema = generateEventSchema(input)

			expect(schema.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode')
			expect(schema.location).toEqual({
				'@type': 'Place',
				name: 'San Francisco, CA',
				address: 'San Francisco, CA'
			})
		})

		test('should handle minimal input', () => {
			const input = {
				name: 'Quick Event',
				startDate: '2025-03-01T10:00:00Z'
			}

			const schema = generateEventSchema(input)

			expect(schema.name).toBe(input.name)
			expect(schema.startDate).toBe(input.startDate)
			expect(schema.eventStatus).toBe('https://schema.org/EventScheduled')
			expect(schema.description).toBeUndefined()
			expect(schema.endDate).toBeUndefined()
			expect(schema.organizer).toBeUndefined()
		})
	})

	describe('generateEventListSchema', () => {
		test('should generate valid ItemList schema with events', () => {
			const events = [
				{
					name: 'Event 1',
					startDate: '2025-02-01T18:00:00Z',
					isOnline: true
				},
				{
					name: 'Event 2',
					startDate: '2025-03-01T18:00:00Z',
					isOnline: true
				}
			]

			const schema = generateEventListSchema(events, 'Upcoming Events')

			expect(schema['@context']).toBe('https://schema.org')
			expect(schema['@type']).toBe('ItemList')
			expect(schema.name).toBe('Upcoming Events')
			expect(schema.numberOfItems).toBe(2)
			expect(schema.itemListElement).toHaveLength(2)

			schema.itemListElement.forEach((item, index) => {
				expect(item['@type']).toBe('ListItem')
				expect(item.position).toBe(index + 1)
				expect(item.item['@type']).toBe('Event')
				expect(item.item.name).toBe(events[index].name)
			})
		})

		test('should handle empty events array', () => {
			const schema = generateEventListSchema([])

			expect(schema.numberOfItems).toBe(0)
			expect(schema.itemListElement).toHaveLength(0)
		})

		test('should handle optional list name', () => {
			const events = [{ name: 'Event', startDate: '2025-01-01T10:00:00Z' }]
			const schema = generateEventListSchema(events)

			expect(schema.name).toBeUndefined()
		})
	})

	describe('Schema validation', () => {
		test('should generate valid JSON-LD', () => {
			const schema = generateOrganizationSchema()
			const json = JSON.stringify(schema)

			expect(() => JSON.parse(json)).not.toThrow()
		})

		test('should not include undefined properties in JSON output', () => {
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
