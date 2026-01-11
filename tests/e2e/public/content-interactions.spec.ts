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

			// Wait for button to be enabled (user is authenticated)
			await expect(detailPage.likeButton).toBeEnabled()

			// Get initial like count and state
			const initialLikeCount = await detailPage.getLikeCount()
			const initiallyLiked = await detailPage.isLiked()

			// Like the content and wait for UI to update
			await detailPage.like()

			// Wait for button title to change (this indicates the action completed)
			await expect(detailPage.likeButton).toHaveAttribute(
				'title',
				initiallyLiked ? 'Like' : 'Remove like'
			)

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

			// Wait for button to be enabled
			await expect(detailPage.likeButton).toBeEnabled()

			// First, like the content
			await detailPage.like()

			// Wait for title to change to "Remove like"
			await expect(detailPage.likeButton).toHaveAttribute('title', 'Remove like')

			const likeCountAfterLike = await detailPage.getLikeCount()
			const likedState = await detailPage.isLiked()
			expect(likedState).toBe(true)

			// Now unlike it
			await detailPage.like()

			// Wait for title to change back to "Like"
			await expect(detailPage.likeButton).toHaveAttribute('title', 'Like')

			// Verify like count decreased by 1
			const finalLikeCount = await detailPage.getLikeCount()
			expect(finalLikeCount).toBe(likeCountAfterLike - 1)

			// Verify button state changed
			const finalLikedState = await detailPage.isLiked()
			expect(finalLikedState).toBe(false)
		})

		test('like button is a clickable button', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

			await detailPage.expectContentLoaded()

			// Verify like button is a regular button type (not submit)
			await expect(detailPage.likeButton).toHaveAttribute('type', 'button')
		})
	})

	test.describe('Authenticated Users - Save Functionality', () => {
		test('can save content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

			await detailPage.expectContentLoaded()

			// Wait for button to be enabled
			await expect(detailPage.saveButton).toBeEnabled()

			// Get initial save count and state
			const initialSaveCount = await detailPage.getSaveCount()
			const initiallySaved = await detailPage.isSaved()

			// Save the content
			await detailPage.save()

			// Wait for UI to update - button title should change
			await expect(detailPage.saveButton).toHaveAttribute(
				'title',
				initiallySaved ? 'Save' : 'Unsave'
			)

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

			// Wait for button to be enabled
			await expect(detailPage.saveButton).toBeEnabled()

			// Check initial state - ensure content is saved first
			const isSavedInitially = await detailPage.isSaved()
			if (!isSavedInitially) {
				// Save the content first
				await detailPage.save()
				// Wait for title to change to "Unsave"
				await expect(detailPage.saveButton).toHaveAttribute('title', 'Unsave')
			}

			// Content should now be saved
			expect(await detailPage.isSaved()).toBe(true)
			const saveCountBeforeUnsave = await detailPage.getSaveCount()

			// Now unsave it
			await detailPage.save()

			// Wait for title to change back to "Save"
			await expect(detailPage.saveButton).toHaveAttribute('title', 'Save')

			// Verify save count decreased by 1
			const finalSaveCount = await detailPage.getSaveCount()
			expect(finalSaveCount).toBe(saveCountBeforeUnsave - 1)

			// Verify button state changed
			const finalSavedState = await detailPage.isSaved()
			expect(finalSavedState).toBe(false)
		})

		test('save button is a clickable button', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

			await detailPage.expectContentLoaded()

			// Verify save button is a regular button type (not submit)
			await expect(detailPage.saveButton).toHaveAttribute('type', 'button')
		})
	})

	test.describe('Cross-Content Type Interactions', () => {
		test('can interact with library content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto('library', 'test-library-testing-library-content_library_001')

			await detailPage.expectContentLoaded()

			// Wait for buttons to be enabled
			await expect(detailPage.likeButton).toBeEnabled()
			await expect(detailPage.saveButton).toBeEnabled()

			// Test like
			await detailPage.like()
			await expect(detailPage.likeButton).toHaveAttribute('title', 'Remove like')
			expect(await detailPage.isLiked()).toBe(true)

			// Test save
			await detailPage.save()
			await expect(detailPage.saveButton).toHaveAttribute('title', 'Unsave')
			expect(await detailPage.isSaved()).toBe(true)
		})

		test('can interact with announcement content', async ({ page }) => {
			await loginAs(page, 'viewer')
			const detailPage = new ContentDetailPage(page)
			await detailPage.goto(
				'announcement',
				'test-announcement-svelte-5-released-content_announcement_001'
			)

			await detailPage.expectContentLoaded()

			// Wait for buttons to be enabled
			await expect(detailPage.likeButton).toBeEnabled()
			await expect(detailPage.saveButton).toBeEnabled()

			// Test like
			await detailPage.like()
			await expect(detailPage.likeButton).toHaveAttribute('title', 'Remove like')
			expect(await detailPage.isLiked()).toBe(true)

			// Test save
			await detailPage.save()
			await expect(detailPage.saveButton).toHaveAttribute('title', 'Unsave')
			expect(await detailPage.isSaved()).toBe(true)
		})
	})
})
