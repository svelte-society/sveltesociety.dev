import { test, expect } from '../../fixtures/auth.fixture'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Submit Library', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can submit a valid library', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillLibraryForm({
			githubRepo: 'sveltejs/svelte',
			description: 'Cybernetically enhanced web apps - the official Svelte repository.',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})

	test('validates required github_repo field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('library')
		await submitPage.descriptionField.fill('This is a test description')

		await submitPage.submit()
		await submitPage.expectValidationError('GitHub repository is required for library submissions')
	})

	test('validates required description field', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.selectContentType('library')
		await submitPage.githubRepoField.fill('sveltejs/svelte')
		await submitPage.descriptionField.fill('Short')

		await submitPage.submit()
		await submitPage.expectValidationError('Description must be at least 10 characters long')
	})

	test('can submit a monorepo package with path', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillLibraryForm({
			githubRepo: 'sveltejs/kit/packages/kit',
			description: 'The fastest way to build Svelte apps - SvelteKit package from monorepo.',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})

	test('can submit a monorepo package with full GitHub URL', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()

		await submitPage.fillLibraryForm({
			githubRepo: 'https://github.com/sveltejs/kit/tree/main/packages/adapter-node',
			description: 'Adapter for SvelteKit apps that generates a standalone Node server.',
			tags: ['svelte']
		})

		await submitPage.submit()
		await submitPage.expectSuccessRedirect()
	})
})
