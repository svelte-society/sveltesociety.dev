import type { Page } from '@playwright/test'

/**
 * Mock Plunk API responses for E2E tests.
 * Intercepts all requests to the Plunk API (localhost:3001) and returns
 * successful mock responses.
 *
 * @example
 * test.beforeEach(async ({ page }) => {
 *   await setupPlunkMock(page)
 * })
 */
export async function setupPlunkMock(page: Page): Promise<void> {
	// Mock all Plunk API endpoints
	await page.route('**/localhost:3001/**', async (route) => {
		const url = route.request().url()
		const method = route.request().method()

		// Generate a mock ID for responses that need it
		const mockId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

		// Handle different endpoints
		if (url.includes('/v1/send')) {
			// Email send endpoint
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true, id: mockId })
			})
		} else if (url.includes('/contacts')) {
			if (method === 'GET') {
				// Get contacts - return empty list or mock contacts
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						contacts: [
							{
								id: 'mock_contact_1',
								email: 'test@example.com',
								subscribed: true,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString()
							}
						],
						total: 1,
						hasMore: false,
						cursor: null
					})
				})
			} else if (method === 'POST') {
				// Create/subscribe contact
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true, id: mockId })
				})
			} else {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true })
				})
			}
		} else if (url.includes('/campaigns')) {
			if (url.includes('/send')) {
				// Send campaign endpoint
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true })
				})
			} else if (method === 'POST') {
				// Create campaign
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: { id: mockId }
					})
				})
			} else if (method === 'PUT') {
				// Update campaign
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true })
				})
			} else if (method === 'DELETE') {
				// Delete campaign
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true })
				})
			} else {
				// GET campaign
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: {
							id: mockId,
							name: 'Mock Campaign',
							status: 'draft'
						}
					})
				})
			}
		} else {
			// Default successful response for any other endpoint
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			})
		}
	})
}
