import { Buffer } from 'node:buffer'
import { expect, test, type Page } from '@playwright/test'
import * as devalue from 'devalue'
import { TEST_USERS } from '../../fixtures/test-data'
import { loginAs } from '../../helpers/auth'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { UserManagementPage } from '../../pages/UserManagementPage'

function encodeRemoteArgument(value: unknown): string {
	return Buffer.from(devalue.stringify(value), 'utf8').toString('base64url')
}

async function discoverUserRemotes(page: Page, roleFormAction: string) {
	const action = new URL(roleFormAction, page.url())
	const remoteAction = action.searchParams.get('/remote')
	const match = remoteAction?.match(/^([^/]+)\/updateUserRole(?:\/|$)/)

	if (!match) {
		throw new Error(`Could not discover user Remote Functions from action: ${roleFormAction}`)
	}

	const moduleId = match[1]
	return {
		getUsers: new URL(`/_app/remote/${moduleId}/getUsers`, action.origin),
		updateUserRole: new URL(`/_app/remote/${moduleId}/updateUserRole`, action.origin)
	}
}

test.describe.configure({ mode: 'serial' })

test.describe('Remote Function authorization boundary', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('an unauthenticated read is rejected with omitted and spoofed path headers', async ({
		page,
		request
	}) => {
		await loginAs(page, 'admin')
		const userPage = new UserManagementPage(page)
		await userPage.gotoEditUser(TEST_USERS.viewer.id)
		const endpoints = await discoverUserRemotes(page, await userPage.getRoleFormAction())
		const isolatedDatabase = (await page.context().cookies()).find(
			(cookie) => cookie.name === 'test_db'
		)
		expect(isolatedDatabase).toBeTruthy()

		for (const headers of [{}, { 'x-sveltekit-pathname': '/' }]) {
			const url = new URL(endpoints.getUsers)
			url.searchParams.set('payload', encodeRemoteArgument({ page: 1, perPage: 1 }))
			const response = await request.get(url.href, {
				headers: {
					'content-type': 'application/json',
					cookie: `test_db=${isolatedDatabase!.value}`,
					...headers
				}
			})
			const body = await response.text()

			expect(response.status()).toBe(200)
			expect(JSON.parse(body)).toMatchObject({
				type: 'error',
				status: 401,
				error: { message: 'Authentication required' }
			})
			expect(body).not.toContain('newsletter_preference')
		}
	})

	test('an unauthenticated role mutation is rejected without changing the user', async ({
		page,
		request
	}) => {
		await loginAs(page, 'admin')
		const userPage = new UserManagementPage(page)
		await userPage.gotoEditUser(TEST_USERS.viewer.id)
		const before = await userPage.roleSelect.inputValue()
		const endpoints = await discoverUserRemotes(page, await userPage.getRoleFormAction())
		const isolatedDatabase = (await page.context().cookies()).find(
			(cookie) => cookie.name === 'test_db'
		)
		expect(isolatedDatabase).toBeTruthy()

		const response = await request.post(endpoints.updateUserRole.href, {
			form: { id: TEST_USERS.viewer.id, 'n:role': before === '1' ? '2' : '1' },
			headers: {
				origin: endpoints.updateUserRole.origin,
				cookie: `test_db=${isolatedDatabase!.value}`,
				'x-sveltekit-pathname': '/'
			}
		})

		expect(response.status()).toBe(200)
		expect(await response.json()).toMatchObject({
			type: 'error',
			status: 401,
			error: { message: 'Authentication required' }
		})

		await userPage.reload()
		await expect(userPage.roleSelect).toHaveValue(before)
	})
})
