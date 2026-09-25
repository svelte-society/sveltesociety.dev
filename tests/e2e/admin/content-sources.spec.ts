import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { ContentEditPage } from '../../pages'
import { loginAs } from '../../helpers/auth'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { CONTENT_SOURCE_FIXTURES } from '../../fixtures/content-sources'

test.describe('Moderation source details', () => {
	test.beforeAll(() => {
		// Seed only this suite's isolated database; tests never mutate shared fixtures.
		execFileSync(
			'bun',
			[
				'-e',
				`
			import { Database } from 'bun:sqlite'
			const db = new Database('test-admin-content-sources.db')
			db.exec('PRAGMA busy_timeout = 10000')
			const insert = db.prepare(
				'INSERT OR IGNORE INTO content (id, title, type, status, body, slug, description, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
			)
			for (const item of Object.values(await Bun.stdin.json())) {
				insert.run(item.id, 'Source review: ' + item.id, item.type, 'pending_review', '', item.id, 'Content awaiting review', JSON.stringify(item.metadata))
			}
			db.close()
		`
			],
			{ input: JSON.stringify(CONTENT_SOURCE_FIXTURES) }
		)
	})

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('reviews a pending library source in a new tab without losing edits', async ({
		page,
		context
	}) => {
		const fixture = CONTENT_SOURCE_FIXTURES.library
		const editPage = new ContentEditPage(page)
		await editPage.gotoEdit(fixture.id)
		await expect(editPage.sourceLinks).toHaveCount(1)
		await expect(editPage.sourceLinks).toHaveAttribute('href', fixture.metadata.github)
		await expect(editPage.sourceLinks).toHaveAttribute('rel', 'noopener noreferrer')
		await expect(editPage.packagePath).toHaveText(fixture.metadata.packagePath)
		await expect(editPage.submitterNotes).toHaveText(fixture.metadata.submitter_notes)
		await expect(editPage.submitterNotes.getByTestId('notes-html-probe')).toHaveCount(0)
		await editPage.editDescription('Unsaved moderation edit')

		await context.route(fixture.metadata.github, (route) =>
			route.fulfill({ body: 'Repository source' })
		)
		const popupPromise = context.waitForEvent('page')
		await editPage.sourceLinks.click()
		const popup = await popupPromise
		await expect(popup).toHaveURL(fixture.metadata.github)
		await expect(page).toHaveURL(new RegExp(`/admin/content/${fixture.id}$`))
		await expect(editPage.descriptionTextarea).toHaveValue('Unsaved moderation edit')
		await popup.close()
	})

	for (const kind of ['resource', 'video'] as const) {
		test(`shows the submitted ${kind} URL`, async ({ page }) => {
			const fixture = CONTENT_SOURCE_FIXTURES[kind]
			const editPage = new ContentEditPage(page)
			await editPage.gotoEdit(fixture.id)
			const url = 'link' in fixture.metadata ? fixture.metadata.link : fixture.metadata.watchUrl
			await expect(editPage.sourceLinks).toHaveCount(1)
			await expect(editPage.sourceLinks).toHaveAttribute('href', url)
		})
	}

	test('preserves the exact package URL and imported attribution', async ({ page }) => {
		const fixture = CONTENT_SOURCE_FIXTURES.imported
		const editPage = new ContentEditPage(page)
		await editPage.gotoEdit(fixture.id)
		await expect(editPage.sourceLinks).toHaveCount(2)
		await expect(editPage.sourceLinks.nth(0)).toHaveAttribute('href', fixture.metadata.packageUrl)
		await expect(editPage.sourceLinks.nth(1)).toHaveAttribute(
			'href',
			fixture.metadata.externalSource.url
		)
		await expect(editPage.reviewDetails.getByTestId('content-import-source')).toHaveText('github')
		await expect(editPage.reviewDetails.getByTestId('content-import-id')).toHaveText('example/ui')
		await expect(editPage.reviewDetails.getByTestId('content-import-fetched')).toContainText('2026')
	})

	test('does not make unsafe submission URLs clickable', async ({ page }) => {
		const editPage = new ContentEditPage(page)
		await editPage.gotoEdit(CONTENT_SOURCE_FIXTURES.unsafe.id)
		await expect(editPage.reviewDetails).toBeVisible()
		await expect(editPage.sourceLinks).toHaveCount(0)
		await expect(editPage.submitterNotes).toHaveText(
			CONTENT_SOURCE_FIXTURES.unsafe.metadata.submitter_notes
		)
	})

	test('hides the panel when there are no source details or notes', async ({ page }) => {
		const editPage = new ContentEditPage(page)
		await editPage.gotoEdit(CONTENT_SOURCE_FIXTURES.noSource.id)
		await expect(editPage.reviewDetails).toHaveCount(0)
	})
})
