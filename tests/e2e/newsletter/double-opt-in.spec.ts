import { test, expect } from '@playwright/test'
import { NewsletterSubscribePage, NewsletterConfirmPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { setupPlunkMock } from '../../helpers/plunk-mock'

test.describe('Newsletter Double Opt-In Flow', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await setupPlunkMock(page)
	})

	test.describe('Subscription Form', () => {
		test('subscription form is visible and interactive', async ({ page }) => {
			const subscribePage = new NewsletterSubscribePage(page)
			await subscribePage.goto()

			// Verify form elements are present
			await expect(subscribePage.emailInput).toBeVisible()
			await expect(subscribePage.submitButton).toBeVisible()
			await expect(subscribePage.submitButton).toHaveText('Subscribe')

			// Verify email can be entered
			await subscribePage.emailInput.fill('test@example.com')
			await expect(subscribePage.emailInput).toHaveValue('test@example.com')
		})
	})

	test.describe('Confirmation Page', () => {
		test('shows invalid state for non-existent token', async ({ page }) => {
			const confirmPage = new NewsletterConfirmPage(page)
			await confirmPage.goto('invalid-token-123')

			await confirmPage.expectPageLoaded()
			await confirmPage.expectInvalid()
		})

		test('shows invalid state for malformed token', async ({ page }) => {
			const confirmPage = new NewsletterConfirmPage(page)
			await confirmPage.goto('not-a-valid-uuid')

			await confirmPage.expectPageLoaded()
			await confirmPage.expectInvalid()
		})

		test('invalid page shows try again button', async ({ page }) => {
			const confirmPage = new NewsletterConfirmPage(page)
			await confirmPage.goto('fake-token')

			await confirmPage.expectPageLoaded()
			await expect(confirmPage.tryAgainButton).toBeVisible()
		})

		test('invalid page has browse content button', async ({ page }) => {
			const confirmPage = new NewsletterConfirmPage(page)
			await confirmPage.goto('fake-token')

			await confirmPage.expectPageLoaded()
			await expect(confirmPage.browseButton).toBeVisible()
		})

		test('browse button navigates to homepage', async ({ page }) => {
			const confirmPage = new NewsletterConfirmPage(page)
			await confirmPage.goto('some-token')

			await confirmPage.expectPageLoaded()
			await confirmPage.browseButton.click()

			await expect(page).toHaveURL('/')
		})

		test('confirmation page displays appropriate content', async ({ page }) => {
			const confirmPage = new NewsletterConfirmPage(page)
			await confirmPage.goto('test-token')

			await confirmPage.expectPageLoaded()
			// Should display the invalid link state since token doesn't exist
			await confirmPage.expectInvalid()
		})
	})

	test.describe('Email Input Validation', () => {
		test('accepts valid email format', async ({ page }) => {
			const subscribePage = new NewsletterSubscribePage(page)
			await subscribePage.goto()

			await subscribePage.emailInput.fill('valid@example.com')

			const isValid = await subscribePage.emailInput.evaluate((el: HTMLInputElement) =>
				el.checkValidity()
			)
			expect(isValid).toBe(true)
		})

		test('rejects invalid email format via HTML5 validation', async ({ page }) => {
			const subscribePage = new NewsletterSubscribePage(page)
			await subscribePage.goto()
			await subscribePage.expectFormVisible()

			await subscribePage.emailInput.click()
			await subscribePage.emailInput.fill('invalid-email')
			await expect(subscribePage.emailInput).toHaveValue('invalid-email')

			const isValid = await subscribePage.emailInput.evaluate((el: HTMLInputElement) =>
				el.checkValidity()
			)
			expect(isValid).toBe(false)
		})
	})
})
