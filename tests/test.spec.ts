import { test } from '@playwright/test'
import { HomePage } from './pages/HomePage'

test('index page loads', async ({ page }) => {
	const homePage = new HomePage(page)
	await homePage.goto()
	await homePage.expectHomeLoaded()
})
