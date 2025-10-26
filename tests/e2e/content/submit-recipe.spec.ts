import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Submit Recipe', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can submit a valid recipe', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillRecipeForm({
			title: 'Test Recipe: Building a Counter Component',
			description: 'Learn how to build a simple counter component in Svelte 5 using runes.',
			body: '## Introduction\n\nThis recipe shows you how to build a counter.\n\n## Code\n\n```svelte\n<script>\nlet count = $state(0)\n</script>\n\n<button onclick={() => count++}>{count}</button>\n```',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})

	test('validates required title field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('recipe')
		await submitPage.descriptionField.fill('This is a test description')
		await submitPage.bodyField.fill('This is test body content')

		await submitPage.submit()

		await submitPage.expectValidationError('Title must be at least 5 characters long')
	})

	test('validates required description field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('recipe')
		await submitPage.titleField.fill('Test Recipe Title')
		await submitPage.descriptionField.fill('Short')
		await submitPage.bodyField.fill('This is test body content')

		await submitPage.submit()

		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})

	test('validates required body field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('recipe')
		await submitPage.titleField.fill('Test Recipe Title')
		await submitPage.descriptionField.fill('This is a test description that is long enough')
		await submitPage.submit()

		await submitPage.expectValidationError('Recipe content must be at least 10 characters long')
	})
})
