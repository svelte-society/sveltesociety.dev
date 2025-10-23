import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'

test.describe('Submit Recipe', () => {
	// All submission tests require authentication
	test.use({ authenticatedAs: 'viewer' })

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
		// Don't fill title - it's required
		await submitPage.descriptionField.fill('This is a test description')
		await submitPage.bodyField.fill('This is test body content')

		await submitPage.submit()

		// Should show validation error
		await submitPage.expectValidationError('Title must be at least 5 characters long')
	})

	test('validates required description field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('recipe')
		await submitPage.titleField.fill('Test Recipe Title')
		// Description is required and must be at least 10 characters
		await submitPage.descriptionField.fill('Short')
		await submitPage.bodyField.fill('This is test body content')

		await submitPage.submit()

		// Should show validation error
		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})

	test('validates required body field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('recipe')
		await submitPage.titleField.fill('Test Recipe Title')
		await submitPage.descriptionField.fill('This is a test description that is long enough')
		// Don't fill body - it's required
		await submitPage.submit()

		// Should show validation error
		await submitPage.expectValidationError('Recipe content must be at least 10 characters long')
	})
})
