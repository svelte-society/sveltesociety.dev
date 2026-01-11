# Page Object Models (POMs)

POMs encapsulate page interactions and make tests maintainable and readable.

## Creating a New POM

### 1. Create the File

Create `tests/pages/[FeatureName]Page.ts`:

```typescript
import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * [FeatureName]Page - Page Object Model for [description]
 *
 * Represents [what the page does].
 * Accessible at routes like [route examples].
 *
 * @example
 * const featurePage = new FeaturePage(page)
 * await featurePage.goto()
 * await featurePage.doSomething()
 */
export class FeaturePage extends BasePage {
	/**
	 * Navigate to the page
	 */
	async goto(): Promise<void> {
		await this.page.goto('/your-route')
	}

	// ========== SELECTORS ==========

	/**
	 * Primary action button
	 */
	get submitButton(): Locator {
		return this.page.getByTestId('submit-button')
	}

	/**
	 * Input field for name
	 */
	get nameInput(): Locator {
		return this.page.getByTestId('input-name')
	}

	/**
	 * All items in the list
	 */
	get items(): Locator {
		return this.page.getByTestId('item')
	}

	/**
	 * Item at a specific index
	 */
	item(index: number): Locator {
		return this.items.nth(index)
	}

	// ========== ACTIONS ==========

	/**
	 * Fill the form and submit
	 */
	async submitForm(name: string): Promise<void> {
		await this.nameInput.fill(name)
		await this.submitButton.click()
	}

	/**
	 * Click an item by index
	 */
	async clickItem(index: number): Promise<void> {
		await this.item(index).click()
	}

	// ========== GETTERS ==========

	/**
	 * Get count of items
	 */
	async getItemCount(): Promise<number> {
		return await this.items.count()
	}

	/**
	 * Get all item titles
	 */
	async getItemTitles(): Promise<string[]> {
		await this.items.first().waitFor({ state: 'visible', timeout: 10000 })
		const titles = await this.page.getByTestId('item-title').allTextContents()
		return titles.map((t) => t.trim()).filter((t) => t.length > 0)
	}

	// ========== ASSERTIONS ==========

	/**
	 * Verify items are displayed
	 */
	async expectItemsDisplayed(): Promise<void> {
		const count = await this.getItemCount()
		if (count === 0) {
			throw new Error('Expected items to be displayed, but found 0')
		}
	}

	/**
	 * Verify specific item exists
	 */
	async expectItemWithTitle(title: string): Promise<void> {
		const titles = await this.getItemTitles()
		if (!titles.some((t) => t.includes(title))) {
			throw new Error(`Expected item "${title}", found: ${titles.join(', ')}`)
		}
	}
}
```

### 2. Export from Index

Add to `tests/pages/index.ts`:

```typescript
export { FeaturePage } from './FeaturePage'
```

## Selector Patterns

### Use data-testid Attributes

```typescript
// Good - stable selector
get submitButton(): Locator {
  return this.page.getByTestId('submit-button')
}

// Bad - breaks with CSS changes
get submitButton(): Locator {
  return this.page.locator('.btn-primary')
}
```

### Auto-Generated Test IDs

Form components auto-generate test-ids from their `name` prop:

| Component                         | Name Prop   | Generated Test ID                    |
| --------------------------------- | ----------- | ------------------------------------ |
| `<Input name="username" />`       | username    | `data-testid="input-username"`       |
| `<Textarea name="description" />` | description | `data-testid="textarea-description"` |
| `<Select name="role" />`          | role        | `data-testid="select-role"`          |

### Getter vs Method

Use **getters** for simple locators:

```typescript
get submitButton(): Locator {
  return this.page.getByTestId('submit-button')
}
```

Use **methods** when you need parameters:

```typescript
item(index: number): Locator {
  return this.items.nth(index)
}
```

## BasePage Methods

All POMs inherit from `BasePage`:

```typescript
// Navigation
await this.page.goto(path) // Navigate to path
await this.goHome() // Go to homepage
await this.reload() // Reload page

// Info
await this.getPageTitle() // Get page title
this.getCurrentUrl() // Get current URL
await this.isLoggedIn() // Check if logged in

// Common selectors
this.header // Header element
this.footer // Footer element
this.nav // Navigation menu
this.loginLink // Login link
this.userMenu // User menu (when logged in)
```

## Existing POMs

Reference these for patterns:

| POM                  | Route                     | Purpose              |
| -------------------- | ------------------------- | -------------------- |
| `HomePage`           | `/`                       | Homepage, search     |
| `ContentListPage`    | `/recipe`, `/video`, etc. | Browse content       |
| `ContentDetailPage`  | `/[type]/[slug]`          | View content details |
| `LoginPage`          | `/login`                  | Authentication       |
| `SubmitPage`         | `/submit/*`               | Content submission   |
| `AdminDashboardPage` | `/admin`                  | Admin dashboard      |
| `ContentEditPage`    | `/admin/content/[id]`     | Edit content         |
| `UserManagementPage` | `/admin/users`            | Manage users         |
| `ShortcutsPage`      | `/admin/shortcuts`        | Sidebar shortcuts    |
