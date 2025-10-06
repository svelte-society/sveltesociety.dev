import { expect, test } from '@playwright/test'

test('index page loads', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
})
