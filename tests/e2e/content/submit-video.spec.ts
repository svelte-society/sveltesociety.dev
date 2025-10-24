import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Submit Video', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page, 'content-submit-video')
	})

	test('can submit a valid video', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillVideoForm({
			url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
			description: 'A comprehensive tutorial on building reactive UIs with Svelte 5 runes.',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})

	test('validates required url field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('video')
		await submitPage.descriptionField.fill('This is a test description')

		await submitPage.submit()
		await submitPage.expectValidationError('Please enter a valid YouTube URL')
	})

	test('validates required description field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('video')
		await submitPage.urlField.fill('https://youtube.com/watch?v=dQw4w9WgXcQ')
		await submitPage.descriptionField.fill('Short')

		await submitPage.submit()
		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})
})
