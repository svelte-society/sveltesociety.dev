import { test, expect } from '../../fixtures/auth.fixture'
import { execFileSync } from 'node:child_process'
import { SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { LIBRARY_PREVIEW_FIXTURES } from '../../fixtures/library-preview'

function readSubmittedMetadata(description: string) {
	return JSON.parse(
		execFileSync(
			'bun',
			[
				'-e',
				`
				import { Database } from 'bun:sqlite'
				const db = new Database('test-content-submit-library.db', { readonly: true })
				const row = db.query('SELECT metadata FROM content WHERE description = ?').get(process.argv[1])
				if (!row) throw new Error('Submitted library was not stored')
				console.log(row.metadata)
				db.close()
			`,
				description
			],
			{ encoding: 'utf8' }
		)
	)
}

test.describe('Submit Library', () => {
	test.beforeAll(() => {
		// Both identities exist so a package preview must select the package, not the root.
		// The real preview route resolves these fixtures without external GitHub requests.
		execFileSync(
			'bun',
			[
				'-e',
				`
			import { Database } from 'bun:sqlite'
			const db = new Database('test-content-submit-library.db')
			db.exec('PRAGMA busy_timeout = 10000')
			const insert = db.prepare('INSERT OR IGNORE INTO content (id, title, type, status, body, slug, description, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
			for (const item of Object.values(await Bun.stdin.json())) {
				insert.run(item.id, item.title, 'library', 'published', '', item.slug, 'Library preview fixture', JSON.stringify({
					externalSource: { source: 'github', externalId: item.externalId }
				}))
			}
			db.close()
		`
			],
			{ input: JSON.stringify(LIBRARY_PREVIEW_FIXTURES) }
		)
	})

	for (const format of ['shorthand', 'url'] as const) {
		test(`previews the matching monorepo package using ${format}`, async ({ page }) => {
			const submitPage = new SubmitPage(page)
			const fixture = LIBRARY_PREVIEW_FIXTURES.package
			await submitPage.goto('library')
			await submitPage.githubRepoField.fill(
				format === 'shorthand' ? fixture.externalId : fixture.url
			)
			await expect(submitPage.libraryPreviewLink(fixture.title)).toHaveAttribute(
				'href',
				`/library/${fixture.slug}-${fixture.id}`
			)
		})
	}

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
		expect(
			readSubmittedMetadata(
				'The fastest way to build Svelte apps - SvelteKit package from monorepo.'
			)
		).toMatchObject({
			github: 'https://github.com/sveltejs/kit',
			packagePath: 'packages/kit'
		})
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
		expect(
			readSubmittedMetadata('Adapter for SvelteKit apps that generates a standalone Node server.')
		).toMatchObject({
			github: 'https://github.com/sveltejs/kit',
			packagePath: 'packages/adapter-node'
		})
	})
})
