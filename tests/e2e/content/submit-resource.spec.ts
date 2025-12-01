import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Submit Resource', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can submit a valid resource', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillResourceForm({
			title: 'Svelte Documentation',
			link: 'https://svelte.dev/docs',
			description: 'The official Svelte documentation with guides and API reference.',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})

	test('can submit a resource with optional image', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillResourceForm({
			title: 'Svelte Tutorial',
			link: 'https://learn.svelte.dev',
			description: 'Interactive tutorial for learning Svelte from scratch.',
			image: 'https://svelte.dev/images/twitter-thumbnail.jpg',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})

	test('validates required title field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.descriptionField.fill('This is a test description')

		await submitPage.submit()

		await submitPage.expectValidationError('Title must be at least 5 characters long')
	})

	test('validates required link field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.descriptionField.fill('This is a test description')

		await submitPage.submit()

		await submitPage.expectValidationError('Please enter a valid URL')
	})

	test('validates link is a valid URL', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceLinkField.fill('not-a-valid-url')
		await submitPage.descriptionField.fill('This is a test description')

		await submitPage.submit()

		await submitPage.expectValidationError('Please enter a valid URL')
	})

	test('validates required description field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.descriptionField.fill('Short')

		await submitPage.submit()

		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})

	test('validates image URL format when provided', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.descriptionField.fill('This is a test description that is long enough')
		await submitPage.resourceImageField.fill('not-a-valid-url')

		await submitPage.submit()

		await submitPage.expectValidationError('Please enter a valid image URL')
	})
})
