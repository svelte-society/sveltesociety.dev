import { test, expect } from '@playwright/test'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Structured Data (Schema.org)', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('homepage has Organization and WebSite schemas', async ({ page }) => {
		await page.goto('/')

		// Get all JSON-LD scripts
		const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
		expect(jsonLdScripts.length).toBeGreaterThan(0)

		// Get the schema content
		const schemaContent = await jsonLdScripts[0].textContent()
		expect(schemaContent).toBeTruthy()

		const schemas = JSON.parse(schemaContent!)
		expect(Array.isArray(schemas)).toBe(true)
		expect(schemas.length).toBe(2)

		// Verify Organization schema
		const orgSchema = schemas.find((s: any) => s['@type'] === 'Organization')
		expect(orgSchema).toBeDefined()
		expect(orgSchema['@context']).toBe('https://schema.org')
		expect(orgSchema.name).toBe('Svelte Society')
		expect(orgSchema.url).toBe('https://sveltesociety.dev')
		expect(orgSchema.logo).toContain('sveltesociety.dev')
		expect(orgSchema.description).toBeTruthy()
		expect(Array.isArray(orgSchema.sameAs)).toBe(true)
		expect(orgSchema.sameAs.length).toBeGreaterThan(0)

		// Verify WebSite schema
		const websiteSchema = schemas.find((s: any) => s['@type'] === 'WebSite')
		expect(websiteSchema).toBeDefined()
		expect(websiteSchema['@context']).toBe('https://schema.org')
		expect(websiteSchema.name).toBe('Svelte Society')
		expect(websiteSchema.url).toBe('https://sveltesociety.dev')
		expect(websiteSchema.potentialAction).toBeDefined()
		expect(websiteSchema.potentialAction['@type']).toBe('SearchAction')
		expect(websiteSchema.potentialAction.target['@type']).toBe('EntryPoint')
		expect(websiteSchema.potentialAction.target.urlTemplate).toContain('search_term_string')
	})

	test('video detail page has VideoObject and Breadcrumb schemas', async ({ page }) => {
		// Navigate directly to a known video detail page
		await page.goto('/video/test-video-svelte-5-intro')
		await page.waitForLoadState('networkidle')

		// Get all JSON-LD scripts
		const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
		expect(jsonLdScripts.length).toBeGreaterThan(0)

		// Get the schema content
		const schemaContent = await jsonLdScripts[0].textContent()
		expect(schemaContent).toBeTruthy()

		const schemas = JSON.parse(schemaContent!)
		expect(Array.isArray(schemas)).toBe(true)

		// Verify VideoObject schema
		const videoSchema = schemas.find((s: any) => s['@type'] === 'VideoObject')
		expect(videoSchema).toBeDefined()
		expect(videoSchema['@context']).toBe('https://schema.org')
		expect(videoSchema.name).toBeTruthy()
		expect(videoSchema.description).toBeTruthy()
		expect(videoSchema.thumbnailUrl).toBeTruthy()
		expect(videoSchema.uploadDate).toBeTruthy()
		// Check ISO 8601 date format
		expect(videoSchema.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

		// Verify BreadcrumbList schema
		const breadcrumbSchema = schemas.find((s: any) => s['@type'] === 'BreadcrumbList')
		expect(breadcrumbSchema).toBeDefined()
		expect(breadcrumbSchema['@context']).toBe('https://schema.org')
		expect(Array.isArray(breadcrumbSchema.itemListElement)).toBe(true)
		expect(breadcrumbSchema.itemListElement.length).toBeGreaterThanOrEqual(2)

		// Verify breadcrumb structure
		const firstCrumb = breadcrumbSchema.itemListElement[0]
		expect(firstCrumb['@type']).toBe('ListItem')
		expect(firstCrumb.position).toBe(1)
		expect(firstCrumb.name).toBe('Home')
		expect(firstCrumb.item).toBe('https://sveltesociety.dev')

		const secondCrumb = breadcrumbSchema.itemListElement[1]
		expect(secondCrumb.position).toBe(2)
		expect(secondCrumb.name).toContain('Video')
	})

	test('recipe detail page has TechArticle and Breadcrumb schemas', async ({ page }) => {
		// Navigate directly to a known recipe detail page
		await page.goto('/recipe/test-recipe-counter-component')
		await page.waitForLoadState('networkidle')

		// Get all JSON-LD scripts
		const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
		expect(jsonLdScripts.length).toBeGreaterThan(0)

		// Get the schema content
		const schemaContent = await jsonLdScripts[0].textContent()
		expect(schemaContent).toBeTruthy()

		const schemas = JSON.parse(schemaContent!)
		expect(Array.isArray(schemas)).toBe(true)

		// Verify TechArticle schema
		const articleSchema = schemas.find((s: any) => s['@type'] === 'TechArticle')
		expect(articleSchema).toBeDefined()
		expect(articleSchema['@context']).toBe('https://schema.org')
		expect(articleSchema.headline).toBeTruthy()
		expect(articleSchema.description).toBeTruthy()
		expect(articleSchema.datePublished).toBeTruthy()
		expect(articleSchema.dateModified).toBeTruthy()
		// Check ISO 8601 date format
		expect(articleSchema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
		expect(articleSchema.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

		// Verify BreadcrumbList schema
		const breadcrumbSchema = schemas.find((s: any) => s['@type'] === 'BreadcrumbList')
		expect(breadcrumbSchema).toBeDefined()
		expect(breadcrumbSchema.itemListElement.length).toBe(3)

		// Verify breadcrumb positions
		breadcrumbSchema.itemListElement.forEach((crumb: any, index: number) => {
			expect(crumb['@type']).toBe('ListItem')
			expect(crumb.position).toBe(index + 1)
			expect(crumb.name).toBeTruthy()
			expect(crumb.item).toBeTruthy()
		})
	})

	test('library detail page has SoftwareSourceCode and Breadcrumb schemas', async ({ page }) => {
		// Navigate directly to a known library detail page
		await page.goto('/library/test-library-testing-library')
		await page.waitForLoadState('networkidle')

		// Get all JSON-LD scripts
		const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
		expect(jsonLdScripts.length).toBeGreaterThan(0)

		// Get the schema content
		const schemaContent = await jsonLdScripts[0].textContent()
		expect(schemaContent).toBeTruthy()

		const schemas = JSON.parse(schemaContent!)
		expect(Array.isArray(schemas)).toBe(true)

		// Verify SoftwareSourceCode schema
		const softwareSchema = schemas.find((s: any) => s['@type'] === 'SoftwareSourceCode')
		expect(softwareSchema).toBeDefined()
		expect(softwareSchema['@context']).toBe('https://schema.org')
		expect(softwareSchema.name).toBeTruthy()
		expect(softwareSchema.description).toBeTruthy()
		expect(softwareSchema.programmingLanguage).toBeTruthy()

		// Verify BreadcrumbList schema
		const breadcrumbSchema = schemas.find((s: any) => s['@type'] === 'BreadcrumbList')
		expect(breadcrumbSchema).toBeDefined()
		expect(breadcrumbSchema.itemListElement.length).toBe(3)

		const lastCrumb = breadcrumbSchema.itemListElement[2]
		expect(lastCrumb.position).toBe(3)
		expect(lastCrumb.name).toBeTruthy()
	})
})
