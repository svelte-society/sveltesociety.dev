# E2E Test Templates

Copy and customize these templates.

---

## Test File Template

```typescript
// tests/e2e/[category]/[feature].spec.ts
import { test, expect } from '@playwright/test'
import { FeaturePage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('[Feature Name]', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		// await loginAs(page, 'admin')  // Uncomment if auth required
	})

	test('can view [feature]', async ({ page }) => {
		const featurePage = new FeaturePage(page)
		await featurePage.goto()

		await featurePage.expectItemsDisplayed()
	})

	test('can create [item]', async ({ page }) => {
		const featurePage = new FeaturePage(page)
		await featurePage.goto()

		await featurePage.fillName('Test Item')
		await featurePage.submit()

		await expect(page).toHaveURL(/success/)
	})

	test('can edit [item]', async ({ page }) => {
		const featurePage = new FeaturePage(page)
		await featurePage.gotoEdit('item_id')

		await featurePage.updateName('Updated Name')
		await featurePage.save()

		await expect(featurePage.successMessage).toBeVisible()
	})

	test('can delete [item]', async ({ page }) => {
		const featurePage = new FeaturePage(page)
		await featurePage.gotoEdit('item_id')

		await featurePage.delete()
		await featurePage.confirmDelete()

		await expect(page).toHaveURL('/feature')
	})
})
```

---

## Page Object Template

```typescript
// tests/pages/FeaturePage.ts
import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * FeaturePage - Page Object Model for [feature description]
 *
 * Accessible at /[route]
 *
 * @example
 * const featurePage = new FeaturePage(page)
 * await featurePage.goto()
 * await featurePage.doAction()
 */
export class FeaturePage extends BasePage {
	// ========== NAVIGATION ==========

	async goto(): Promise<void> {
		await this.page.goto('/feature')
	}

	async gotoEdit(id: string): Promise<void> {
		await this.page.goto(`/feature/${id}/edit`)
	}

	// ========== SELECTORS ==========

	get nameInput(): Locator {
		return this.page.getByTestId('input-name')
	}

	get descriptionInput(): Locator {
		return this.page.getByTestId('textarea-description')
	}

	get submitButton(): Locator {
		return this.page.getByTestId('submit-button')
	}

	get saveButton(): Locator {
		return this.page.getByTestId('save-button')
	}

	get deleteButton(): Locator {
		return this.page.getByTestId('delete-button')
	}

	get confirmDeleteButton(): Locator {
		return this.page.getByTestId('confirm-delete-button')
	}

	get successMessage(): Locator {
		return this.page.getByTestId('success-message')
	}

	get items(): Locator {
		return this.page.getByTestId('item')
	}

	item(index: number): Locator {
		return this.items.nth(index)
	}

	// ========== ACTIONS ==========

	async fillName(name: string): Promise<void> {
		await this.nameInput.fill(name)
	}

	async fillDescription(description: string): Promise<void> {
		await this.descriptionInput.fill(description)
	}

	async updateName(name: string): Promise<void> {
		await this.nameInput.clear()
		await this.nameInput.fill(name)
	}

	async submit(): Promise<void> {
		await this.submitButton.click()
	}

	async save(): Promise<void> {
		await this.saveButton.click()
	}

	async delete(): Promise<void> {
		await this.deleteButton.click()
	}

	async confirmDelete(): Promise<void> {
		await this.confirmDeleteButton.click()
	}

	async clickItem(index: number): Promise<void> {
		await this.item(index).click()
	}

	// ========== GETTERS ==========

	async getItemCount(): Promise<number> {
		return await this.items.count()
	}

	async getItemTitles(): Promise<string[]> {
		await this.items.first().waitFor({ state: 'visible', timeout: 10000 })
		const titleElements = this.page.getByTestId('item-title')
		const titles = await titleElements.allTextContents()
		return titles.map((t) => t.trim()).filter((t) => t.length > 0)
	}

	// ========== ASSERTIONS ==========

	async expectItemsDisplayed(): Promise<void> {
		const count = await this.getItemCount()
		if (count === 0) {
			throw new Error('Expected items to be displayed, but found 0')
		}
	}

	async expectItemWithTitle(title: string): Promise<void> {
		const titles = await this.getItemTitles()
		if (!titles.some((t) => t.includes(title))) {
			throw new Error(`Expected item with title "${title}", found: ${titles.join(', ')}`)
		}
	}
}
```

---

## Admin Test Template

```typescript
// tests/e2e/admin/[feature].spec.ts
import { test, expect } from '@playwright/test'
import { AdminFeaturePage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Admin: [Feature Name]', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('admin can view [feature] list', async ({ page }) => {
		const adminPage = new AdminFeaturePage(page)
		await adminPage.goto()

		await adminPage.expectItemsDisplayed()
	})

	test('admin can create [item]', async ({ page }) => {
		const adminPage = new AdminFeaturePage(page)
		await adminPage.gotoCreate()

		await adminPage.fillForm({
			name: 'New Item',
			description: 'Item description'
		})
		await adminPage.save()

		await expect(adminPage.successMessage).toBeVisible()
	})

	test('admin can edit [item]', async ({ page }) => {
		const adminPage = new AdminFeaturePage(page)
		await adminPage.gotoEdit('item_id')

		await adminPage.updateName('Updated Name')
		await adminPage.save()

		await expect(adminPage.successMessage).toBeVisible()
	})

	test('admin can delete [item]', async ({ page }) => {
		const adminPage = new AdminFeaturePage(page)
		await adminPage.gotoEdit('item_id')

		await adminPage.delete()
		await adminPage.confirmDelete()

		await expect(page).toHaveURL(/\/admin\/feature/)
	})

	test('non-admin cannot access', async ({ page }) => {
		await loginAs(page, 'viewer')

		await page.goto('/admin/feature')

		// Should redirect or show unauthorized
		await expect(page).not.toHaveURL(/\/admin\/feature/)
	})
})
```

---

## Public Test Template

```typescript
// tests/e2e/public/[feature].spec.ts
import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage, ContentDetailPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Public: [Feature Name]', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can browse content', async ({ page }) => {
		const listPage = new ContentListPage(page)
		await listPage.goto('recipe')

		await listPage.expectContentDisplayed()
	})

	test('can view content detail', async ({ page }) => {
		const listPage = new ContentListPage(page)
		await listPage.goto('recipe')
		await listPage.clickContentCard(0)

		const detailPage = new ContentDetailPage(page)
		await expect(detailPage.title).toBeVisible()
	})

	test('can search for content', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await homePage.search('Counter')

		const listPage = new ContentListPage(page)
		await listPage.expectContentDisplayed()
		await listPage.expectContentWithTitle('Counter')
	})
})
```

---

## Adding to pages/index.ts

```typescript
// tests/pages/index.ts
export { BasePage } from './BasePage'
export { HomePage } from './HomePage'
// ... existing exports ...
export { FeaturePage } from './FeaturePage' // Add new POM
```
