import { type Page, type Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * UserManagementPage - Page Object Model for admin user management
 *
 * Represents pages for viewing and managing users in the admin panel
 * Accessible at /admin/users (list) and /admin/users/:id (edit)
 *
 * Provides methods for:
 * - Viewing the users list
 * - Navigating to user edit pages
 * - Editing user profiles
 * - Changing user roles
 *
 * @example
 * const userMgmt = new UserManagementPage(page)
 * await userMgmt.gotoUsersList()
 * const count = await userMgmt.getUserCount()
 */
export class UserManagementPage extends BasePage {
	readonly usersTable: Locator
	readonly userRow: Locator
	readonly usernameInput: Locator
	readonly emailInput: Locator
	readonly roleSelect: Locator
	readonly updateButton: Locator
	readonly backLink: Locator

	constructor(page: Page) {
		super(page)
		this.usersTable = page.getByTestId('users-table')
		this.userRow = page.getByTestId('users-table-row')
		this.usernameInput = page.getByTestId('input-username')
		this.emailInput = page.getByTestId('input-email')
		this.roleSelect = page.getByTestId('select-role')
		this.updateButton = page.getByRole('button', { name: /update role/i })
		this.backLink = page.getByRole('link', { name: /back to users/i })
	}

	async gotoUsersList(): Promise<void> {
		await this.page.goto('/admin/users')
	}

	async gotoEditUser(userId: string): Promise<void> {
		await this.page.goto(`/admin/users/${userId}`)
	}

	async getUserCount(): Promise<number> {
		await this.usersTable.waitFor({ state: 'visible' })
		return await this.userRow.count()
	}

	async getUsernameByRow(index: number): Promise<string> {
		const row = this.userRow.nth(index)
		return (await row.locator('[data-testid="user-username"]').textContent()) || ''
	}

	async getRoleByRow(index: number): Promise<string> {
		const row = this.userRow.nth(index)
		return (await row.locator('[data-testid="user-role"]').textContent()) || ''
	}

	async clickEditForRow(index: number): Promise<void> {
		const row = this.userRow.nth(index)
		await row.getByTestId('edit-button').click()
	}

	async editUserRole(role: string): Promise<void> {
		await this.roleSelect.click()
		await this.page.getByRole('option', { name: role }).click()
		await this.updateButton.click()
	}

	async editUserProfile(data: {
		username?: string
		email?: string
		role?: string
		bio?: string
		location?: string
		twitter?: string
	}): Promise<void> {
		if (data.username !== undefined) {
			await this.usernameInput.fill(data.username)
		}

		if (data.email !== undefined) {
			await this.emailInput.fill(data.email)
		}

		if (data.role !== undefined) {
			await this.roleSelect.selectOption({ label: data.role })
		}

		if (data.bio !== undefined) {
			await this.page.getByTestId('input-bio').fill(data.bio)
		}

		if (data.location !== undefined) {
			await this.page.getByTestId('input-location').fill(data.location)
		}

		if (data.twitter !== undefined) {
			await this.page.getByTestId('input-twitter').fill(data.twitter)
		}

		await this.updateButton.click()
	}

	async expectUserInList(username: string): Promise<void> {
		await expect(this.page.getByTestId('user-username').filter({ hasText: username })).toBeVisible()
	}

	async expectRoleIs(role: string): Promise<void> {
		await expect(this.roleSelect).toHaveValue(role)
	}
}
