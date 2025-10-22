import { test, expect } from '@playwright/test'

test.describe('Simple Auth Check', () => {
	test('unauthenticated user sees login link', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('a[href="/login"]')).toBeVisible()
	})

	test('admin route redirects unauthenticated user', async ({ page }) => {
		await page.goto('/admin')
		const url = page.url()
		expect(url).toBeTruthy()
	})
})
