import { test, expect } from '@playwright/test'
import { ContentDetailPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Content Interactions (Like/Save)', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test.describe('Unauthenticated Users', () => {
		test('like and save buttons are disabled when not logged in', async ({ page }) => {
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

			await detailPage.expectContentLoaded()

			// Buttons should be visible but disabled
			await expect(detailPage.likeButton).toBeVisible()
			await expect(detailPage.saveButton).toBeVisible()
			await expect(detailPage.likeButton).toBeDisabled()
			await expect(detailPage.saveButton).toBeDisabled()
		})

		test('like and save buttons have correct initial counts', async ({ page }) => {
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

			await detailPage.expectContentLoaded()

			const likeCount = await detailPage.getLikeCount()
			const saveCount = await detailPage.getSaveCount()

			// Verify counts are numbers >= 0
			expect(likeCount).toBeGreaterThanOrEqual(0)
			expect(saveCount).toBeGreaterThanOrEqual(0)
		})
	})

	test.describe('Authenticated Users - Like Functionality', () => {
		test('can like content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

			await detailPage.expectContentLoaded()

			// Get initial like count and state
			const initialLikeCount = await detailPage.getLikeCount()
			const initiallyLiked = await detailPage.isLiked()

			// Like the content
			await detailPage.like()

			// Wait for the interaction to complete
			await page.waitForTimeout(500)

			// Verify like count increased by 1
			const newLikeCount = await detailPage.getLikeCount()
			if (!initiallyLiked) {
				expect(newLikeCount).toBe(initialLikeCount + 1)
			}

			// Verify button state changed
			const nowLiked = await detailPage.isLiked()
			expect(nowLiked).toBe(!initiallyLiked)
		})

		test('can unlike content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

			await detailPage.expectContentLoaded()

			// First, like the content
			await detailPage.like()
			await page.waitForTimeout(500)

			const likeCountAfterLike = await detailPage.getLikeCount()
			const likedState = await detailPage.isLiked()
			expect(likedState).toBe(true)

			// Now unlike it
			await detailPage.like()
			await page.waitForTimeout(500)

			// Verify like count decreased by 1
			const finalLikeCount = await detailPage.getLikeCount()
			expect(finalLikeCount).toBe(likeCountAfterLike - 1)

			// Verify button state changed
			const finalLikedState = await detailPage.isLiked()
			expect(finalLikedState).toBe(false)
		})

		test('like button has data-sveltekit-keepfocus attribute', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

			await detailPage.expectContentLoaded()

			// Verify like button has the data-sveltekit-keepfocus attribute to prevent focus loss
			await expect(detailPage.likeButton).toHaveAttribute('data-sveltekit-keepfocus')
		})
	})

	test.describe('Authenticated Users - Save Functionality', () => {
		test('can save content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

			await detailPage.expectContentLoaded()

			// Get initial save count and state
			const initialSaveCount = await detailPage.getSaveCount()
			const initiallySaved = await detailPage.isSaved()

			// Save the content
			await detailPage.save()

			// Wait for the interaction to complete
			await page.waitForTimeout(500)

			// Verify save count increased by 1
			const newSaveCount = await detailPage.getSaveCount()
			if (!initiallySaved) {
				expect(newSaveCount).toBe(initialSaveCount + 1)
			}

			// Verify button state changed
			const nowSaved = await detailPage.isSaved()
			expect(nowSaved).toBe(!initiallySaved)
		})

		test('can unsave content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

			await detailPage.expectContentLoaded()

			// First, save the content
			await detailPage.save()
			await page.waitForTimeout(500)

			const saveCountAfterSave = await detailPage.getSaveCount()
			const savedState = await detailPage.isSaved()
			expect(savedState).toBe(true)

			// Now unsave it
			await detailPage.save()
			await page.waitForTimeout(500)

			// Verify save count decreased by 1
			const finalSaveCount = await detailPage.getSaveCount()
			expect(finalSaveCount).toBe(saveCountAfterSave - 1)

			// Verify button state changed
			const finalSavedState = await detailPage.isSaved()
			expect(finalSavedState).toBe(false)
		})

		test('save button has data-sveltekit-keepfocus attribute', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

			await detailPage.expectContentLoaded()

			// Verify save button has the data-sveltekit-keepfocus attribute to prevent focus loss
			await expect(detailPage.saveButton).toHaveAttribute('data-sveltekit-keepfocus')
		})
	})

	test.describe('Cross-Content Type Interactions', () => {
		test('can interact with library content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('library', 'test-library-testing-library-content_library_001')

			await detailPage.expectContentLoaded()

			// Test both like and save
			await detailPage.like()
			await page.waitForTimeout(500)
			expect(await detailPage.isLiked()).toBe(true)

			await detailPage.save()
			await page.waitForTimeout(500)
			expect(await detailPage.isSaved()).toBe(true)
		})

		test('can interact with announcement content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('announcement', 'test-announcement-svelte-5-released-content_announcement_001')

			await detailPage.expectContentLoaded()

			// Test both like and save
			await detailPage.like()
			await page.waitForTimeout(500)
			expect(await detailPage.isLiked()).toBe(true)

			await detailPage.save()
			await page.waitForTimeout(500)
			expect(await detailPage.isSaved()).toBe(true)
		})
	})

})
