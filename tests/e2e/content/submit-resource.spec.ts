import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Submit Resource', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can navigate to resource submission via link', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.expectContentTypeNavVisible()
		await submitPage.selectContentType('resource')

		await expect(page).toHaveURL('/submit/resource')
	})

	test('validates required title field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		await submitPage.resourceDescriptionField.fill('This is a test description that is long enough')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.selectFirstTag()

		await submitPage.submit()

		await submitPage.expectValidationError('Title must be at least 5 characters long')
	})

	test('validates required link field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceDescriptionField.fill('This is a test description that is long enough')
		await submitPage.selectFirstTag()

		await submitPage.submit()

		await submitPage.expectValidationError('Please enter a valid URL')
	})

	test('validates link is a valid URL', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceDescriptionField.fill('This is a test description that is long enough')
		await submitPage.resourceLinkField.fill('not-a-valid-url')
		await submitPage.selectFirstTag()

		await submitPage.submit()

		await submitPage.expectValidationError('Please enter a valid URL')
	})

	test('validates required description field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.resourceDescriptionField.fill('Short')
		await submitPage.selectFirstTag()

		await submitPage.submit()

		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})

	// TODO: Fix tags validation with Remote Functions
	// The hidden input for array fields doesn't properly submit empty arrays,
	// so the server doesn't receive the field and validation is bypassed.
	// Need to investigate proper array field handling in Remote Functions.
	test.skip('validates required tags', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceDescriptionField.fill('This is a test description that is long enough')
		await submitPage.resourceLinkField.fill('https://example.com')
		// Don't select any tags

		await submitPage.submit()

		await submitPage.expectValidationError('Please select at least one tag')
	})

	test('can submit a valid resource', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		await submitPage.resourceTitleField.fill('Svelte Documentation')
		await submitPage.resourceDescriptionField.fill(
			'The official Svelte documentation with guides and API reference.'
		)
		await submitPage.resourceLinkField.fill('https://svelte.dev/docs')
		await submitPage.selectFirstTag()

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})
})

test.describe('Submit Navigation', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('shows content type navigation on submit page', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.expectContentTypeNavVisible()

		// All four links should be visible
		await expect(page.locator('[data-testid="submit-recipe-link"]')).toBeVisible()
		await expect(page.locator('[data-testid="submit-video-link"]')).toBeVisible()
		await expect(page.locator('[data-testid="submit-library-link"]')).toBeVisible()
		await expect(page.locator('[data-testid="submit-resource-link"]')).toBeVisible()
	})

	test('highlights active content type', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto('resource')

		// Resource link should have active styling (orange border)
		const resourceLink = page.locator('[data-testid="submit-resource-link"]')
		await expect(resourceLink).toHaveClass(/border-orange-500/)
	})
})
