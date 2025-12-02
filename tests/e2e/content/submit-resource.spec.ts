import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_IMAGE_PATH = path.join(__dirname, '../../fixtures/images/test-image.png')

test.describe('Submit Resource', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('validates required title field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.descriptionField.fill('This is a test description that is long enough')

		// Select a tag
		const tagsSelect = page.locator('[data-testid="tags-selector"]')
		await tagsSelect.selectOption({ index: 0 })

		await submitPage.submit()

		await submitPage.expectValidationError('Title is required for resources')
	})

	test('validates required link field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.descriptionField.fill('This is a test description that is long enough')

		// Select a tag
		const tagsSelect = page.locator('[data-testid="tags-selector"]')
		await tagsSelect.selectOption({ index: 0 })

		await submitPage.submit()

		await submitPage.expectValidationError('Link is required for resources')
	})

	test('validates link is a valid URL', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceLinkField.fill('not-a-valid-url')
		await submitPage.descriptionField.fill('This is a test description that is long enough')

		// Select a tag
		const tagsSelect = page.locator('[data-testid="tags-selector"]')
		await tagsSelect.selectOption({ index: 0 })

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

		// Select a tag
		const tagsSelect = page.locator('[data-testid="tags-selector"]')
		await tagsSelect.selectOption({ index: 0 })

		await submitPage.submit()

		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})

	test('validates required image upload', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Test Resource Title')
		await submitPage.resourceLinkField.fill('https://example.com')
		await submitPage.descriptionField.fill('This is a test description that is long enough')

		// Select a tag from the multi-select
		const tagsSelect = page.locator('[data-testid="tags-selector"]')
		await tagsSelect.selectOption({ index: 0 })

		await submitPage.submit()

		// Should show validation error for missing image
		await submitPage.expectValidationError('Image is required for resources')
	})

	test('shows image preview after file selection', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')

		// Upload a test image
		await submitPage.uploadResourceImage(TEST_IMAGE_PATH)

		// Should show preview
		await submitPage.expectImagePreview()
	})

	test('validates file type - rejects non-image files', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')

		// Create a temporary text file
		const textFilePath = path.join(__dirname, '../../fixtures/images/test.txt')
		const fs = await import('fs/promises')
		await fs.writeFile(textFilePath, 'This is not an image')

		try {
			// Try to upload a text file
			await submitPage.uploadResourceImage(textFilePath)

			// Should show error about invalid file type
			await submitPage.expectFileUploadError('Invalid file type')
		} finally {
			// Clean up
			await fs.unlink(textFilePath).catch(() => {})
		}
	})
})

test.describe('Submit Resource with S3', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	// This test requires S3 to be configured
	// Skip if S3 is not available
	test.skip(
		!process.env.USE_S3_THUMBNAILS || process.env.USE_S3_THUMBNAILS !== 'true',
		'Skipping S3 upload tests - S3 not configured'
	)

	test('can submit a valid resource with image upload', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('resource')
		await submitPage.resourceTitleField.fill('Svelte Documentation')
		await submitPage.resourceLinkField.fill('https://svelte.dev/docs')
		await submitPage.descriptionField.fill('The official Svelte documentation with guides and API reference.')

		// Upload image
		await submitPage.uploadResourceImage(TEST_IMAGE_PATH)

		// Select a tag from the multi-select
		const tagsSelect = page.locator('[data-testid="tags-selector"]')
		await tagsSelect.selectOption({ index: 0 })

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})
})
