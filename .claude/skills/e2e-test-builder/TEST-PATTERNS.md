# Test Patterns

## Test Structure

### Basic Test File

```typescript
import { test, expect } from '@playwright/test'
import { FeaturePage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Feature Name', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page) // REQUIRED
		// await loginAs(page, 'admin')      // If auth needed
	})

	test('can do something', async ({ page }) => {
		const featurePage = new FeaturePage(page)
		await featurePage.goto()

		// Actions
		await featurePage.doSomething()

		// Assertions
		await expect(featurePage.result).toBeVisible()
	})
})
```

### Test File Location

Place tests in the appropriate category:

```
tests/e2e/
├── public/     # Unauthenticated user flows
├── auth/       # Login, protected routes, roles
├── content/    # Content submission
└── admin/      # Admin-only features
```

## Database Isolation

**Every test file MUST call `setupDatabaseIsolation()`:**

```typescript
test.beforeEach(async ({ page }) => {
	await setupDatabaseIsolation(page)
})
```

This:

1. Auto-detects your test file name
2. Sets a cookie to route to isolated database
3. Ensures complete test independence

## Authentication

### Using loginAs Helper

```typescript
import { loginAs } from '../../helpers/auth'

test.beforeEach(async ({ page }) => {
	await setupDatabaseIsolation(page)
	await loginAs(page, 'admin') // 'admin' | 'viewer'
})
```

### Test Users

| Role     | Username      | Use For                           |
| -------- | ------------- | --------------------------------- |
| `admin`  | `test_admin`  | Admin features, full access       |
| `viewer` | `test_viewer` | Read-only access, member features |

### Checking Auth State

```typescript
// In tests
const isLoggedIn = await homePage.isLoggedIn()
expect(isLoggedIn).toBeTruthy()

// Using helper
import { isLoggedIn } from '../../helpers/auth'
expect(await isLoggedIn(page)).toBeTruthy()
```

## Assertions

### Playwright Assertions

```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()
await expect(element).not.toBeVisible()

// Text content
await expect(element).toHaveText('Expected text')
await expect(element).toContainText('partial')

// Attributes
await expect(element).toHaveAttribute('href', '/path')
await expect(element).toHaveClass(/active/)

// Count
await expect(elements).toHaveCount(5)

// URL
await expect(page).toHaveURL('/expected-path')
await expect(page).toHaveURL(/pattern/)

// Title
await expect(page).toHaveTitle('Expected Title')
```

### POM Assertions

POMs provide custom assertions:

```typescript
// Content list assertions
await contentListPage.expectContentDisplayed()
await contentListPage.expectContentWithTitle('Counter')

// Generic pattern
await featurePage.expectItemsDisplayed()
await featurePage.expectSuccess()
```

## Common Patterns

### Navigation Test

```typescript
test('navigates to detail page', async ({ page }) => {
	const listPage = new ContentListPage(page)
	await listPage.goto('recipe')

	await listPage.clickContentCard(0)

	await expect(page).toHaveURL(/\/recipe\//)
	const detailPage = new ContentDetailPage(page)
	await expect(detailPage.title).toBeVisible()
})
```

### Form Submission Test

```typescript
test('submits form successfully', async ({ page }) => {
	const submitPage = new SubmitPage(page)
	await submitPage.goto()

	await submitPage.fillTitle('My Content')
	await submitPage.fillDescription('Description here')
	await submitPage.selectType('recipe')
	await submitPage.submit()

	await expect(page).toHaveURL(/success/)
})
```

### List with Filtering Test

```typescript
test('filters content by tag', async ({ page }) => {
	const listPage = new ContentListPage(page)
	await listPage.goto('recipe')

	await listPage.filterByCategory('svelte')

	const titles = await listPage.getContentTitles()
	expect(titles.length).toBeGreaterThan(0)
})
```

### Admin Action Test

```typescript
test('admin can edit content', async ({ page }) => {
	await loginAs(page, 'admin')

	const editPage = new ContentEditPage(page)
	await editPage.goto('content_recipe_001')

	await editPage.updateTitle('Updated Title')
	await editPage.save()

	await expect(editPage.successMessage).toBeVisible()
})
```

## Best Practices

### Do

- Use POMs for all page interactions
- Add `data-testid` to new components
- Use `setupDatabaseIsolation()` in every test
- Write focused tests (one behavior per test)
- Keep tests independent
- Rely on Playwright auto-waiting
- Use descriptive test names

### Don't

- Use CSS selectors or XPath
- Add manual waits (`waitForTimeout`)
- Test implementation details
- Make tests depend on execution order
- Leave `test.only()` in committed code
- Hardcode test data

## Debugging

```bash
# Run in headed mode
bun run test:integration:headed

# Run in debug mode
bun run test:integration:debug

# Run in UI mode (interactive)
bun run test:integration:ui

# Run single test
bun test:integration tests/e2e/public/search.spec.ts
```

## Test Data

Reference `tests/fixtures/test-data.ts` for available:

- `TEST_USERS` - User credentials and session tokens
- `TEST_TAGS` - Available tags
- `TEST_CONTENT` - Seeded content items
- `TEST_JOBS` - Job listings
- `TEST_PENDING_CONTENT` - Pending review items
