# E2E Testing Guide - Best Practices & Patterns

This guide provides best practices, patterns, and guidelines for writing and maintaining E2E tests for the Svelte Society platform.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Page Object Model Pattern](#page-object-model-pattern)
- [Writing Tests](#writing-tests)
- [Database Isolation](#database-isolation)
- [Test Data Management](#test-data-management)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

---

## Testing Philosophy

### What to Test

**✅ Test user flows and behaviors:**
- Can a user complete their task?
- Do features work as expected from a user's perspective?
- Are critical paths protected and functional?

**✅ Test integration points:**
- Forms submit correctly
- Navigation works
- Data displays correctly
- Auth and permissions work

**❌ Don't test implementation details:**
- Internal state management
- Component props or events
- CSS class names
- Internal functions

### Test Quality Metrics

Our testing standards:
- **0% flaky tests** - Tests must be reliable
- **Fast execution** - <20 seconds for full suite
- **100% passing** - No known failing tests in main branch
- **Good coverage** - All critical user flows tested

---

## Page Object Model (POM) Pattern

### What is a POM?

A Page Object Model encapsulates page structure and interactions into a reusable class:

```typescript
// Bad: Directly using Playwright API in tests
test('can search', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('search-input').fill('Counter')
  await page.getByTestId('search-input').press('Enter')
  await expect(page.getByTestId('content-card')).toBeVisible()
})

// Good: Using a POM
test('can search', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.search('Counter')

  const contentList = new ContentListPage(page)
  await contentList.expectContentDisplayed()
})
```

### Why Use POMs?

1. **Maintainability** - UI changes only require updating the POM, not every test
2. **Reusability** - Same page interactions used across multiple tests
3. **Readability** - Tests read like plain English
4. **Type Safety** - TypeScript catches errors at compile time
5. **Encapsulation** - Implementation details hidden from tests

### POM Structure

```typescript
import { type Page, type Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * MyPage - Brief description
 *
 * Detailed description of what this page represents and what it does.
 *
 * @example
 * const myPage = new MyPage(page)
 * await myPage.doSomething()
 */
export class MyPage extends BasePage {
  // 1. Locators (getters for elements)
  get submitButton(): Locator {
    return this.page.getByTestId('submit-button')
  }

  // 2. Actions (methods that perform interactions)
  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  // 3. Getters (methods that retrieve data)
  async getTitle(): Promise<string> {
    return await this.page.getByTestId('title').textContent() || ''
  }

  // 4. Assertions (methods that verify state)
  async expectFormDisplayed(): Promise<void> {
    await expect(this.page.getByTestId('form')).toBeVisible()
  }
}
```

### Creating a New POM

1. **Extend BasePage:**
```typescript
export class NewPage extends BasePage {
  // Your implementation
}
```

2. **Add to index.ts:**
```typescript
export { NewPage } from './NewPage'
```

3. **Use in tests:**
```typescript
import { NewPage } from '../../pages'
```

---

## Writing Tests

### Test File Structure

```typescript
import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Always set up database isolation
    await setupDatabaseIsolation(page)

    // Login if needed
    await loginAs(page, 'admin')
  })

  test('specific behavior', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page)
    await homePage.goto()

    // Act
    await homePage.search('test')

    // Assert
    const contentList = new ContentListPage(page)
    await contentList.expectContentDisplayed()
  })
})
```

### Test Naming

**Use descriptive names that explain what is being tested:**

```typescript
// ✅ Good
test('can submit a valid recipe with all required fields', ...)
test('shows validation error when title is missing', ...)
test('admin can approve pending content from moderation queue', ...)

// ❌ Bad
test('recipe test', ...)
test('test 1', ...)
test('works', ...)
```

### Test Independence

**Each test should be completely independent:**

```typescript
// ✅ Good - Each test sets up its own state
test('can save content', async ({ page }) => {
  const detailPage = new ContentDetailPage(page)
  await detailPage.goto('recipe', '1')
  await detailPage.save()
  await detailPage.expectSaved()
})

test('can unsave content', async ({ page }) => {
  const detailPage = new ContentDetailPage(page)
  await detailPage.goto('recipe', '1')
  await detailPage.save()  // Set up saved state
  await detailPage.unsave()
  await detailPage.expectNotSaved()
})

// ❌ Bad - Second test depends on first test
test('can save content', async ({ page }) => {
  await detailPage.save()
})

test('can unsave content', async ({ page }) => {
  await detailPage.unsave()  // Assumes previous test ran!
})
```

---

## Database Isolation

### How It Works

Each test file gets its own isolated database copy:

1. Base database (`test.db`) is initialized and seeded once
2. `globalSetup` pre-creates isolated copies (e.g., `test-public-search.db`)
3. Tests set a cookie to route requests to their database
4. `globalTeardown` cleans up all isolated databases

### Setup in Tests

**Every test file must include:**

```typescript
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.beforeEach(async ({ page }) => {
  await setupDatabaseIsolation(page)  // Auto-detects test file name
})
```

This automatically:
- Detects the test file name from the call stack
- Sets a cookie that routes requests to the correct database
- Ensures complete test isolation

### Benefits

- ✅ Perfect isolation - tests never interfere with each other
- ✅ Parallel execution safe - no race conditions
- ✅ Consistent state - every test starts with same data
- ✅ Fast - databases pre-created, not during tests

---

## Test Data Management

### Using Test Data

All test data is defined in `tests/fixtures/test-data.ts`:

```typescript
import { TEST_USERS, TEST_CONTENT } from '../fixtures/test-data'

// Access test users
TEST_USERS.admin.username  // 'test_admin'
TEST_USERS.viewer.email    // 'viewer@test.local'

// Access test content
TEST_CONTENT.publishedRecipe.title  // 'Test Recipe: Building a Counter Component'
```

### Authentication

Use the `loginAs` helper:

```typescript
import { loginAs } from '../../helpers/auth'

// Login as admin
await loginAs(page, 'admin')

// Login as moderator
await loginAs(page, 'contributor')

// Login as member
await loginAs(page, 'viewer')
```

### Don't Hardcode Data

```typescript
// ❌ Bad
test('can view recipe', async ({ page }) => {
  await page.goto('/recipe/1')
  await expect(page.getByText('Test Recipe')).toBeVisible()
})

// ✅ Good
test('can view recipe', async ({ page }) => {
  const detailPage = new ContentDetailPage(page)
  await detailPage.goto('recipe', TEST_CONTENT.publishedRecipe.id)
  const title = await detailPage.getTitle()
  expect(title).toContain('Counter')
})
```

---

## Best Practices

### Use Test-IDs

**Always use `data-testid` for element selection:**

```svelte
<!-- Component.svelte -->
<button data-testid="submit-button">Submit</button>
<input data-testid="search-input" type="search" />
```

```typescript
// POM
get submitButton(): Locator {
  return this.page.getByTestId('submit-button')
}
```

**Auto-generated test-ids:**
Form components automatically generate test-ids:
- `<Input name="username" />` → `data-testid="input-username"`
- `<Select name="role" />` → `data-testid="select-role"`

### Avoid Manual Waits

```typescript
// ❌ Bad - Arbitrary timeout
await page.waitForTimeout(2000)

// ✅ Good - Wait for specific condition
await expect(page.getByTestId('content-card')).toBeVisible()

// ✅ Good - Only when necessary
await page.waitForLoadState('networkidle')
```

### Use Playwright's Auto-Waiting

Playwright automatically waits for elements:

```typescript
// No manual waiting needed!
await page.getByTestId('button').click()  // Waits for visible + enabled
await expect(page.getByTestId('text')).toBeVisible()  // Waits up to 5s
```

### Keep Tests Focused

```typescript
// ✅ Good - Tests one thing
test('shows validation error when title is missing', async ({ page }) => {
  const submitPage = new SubmitPage(page)
  await submitPage.goto('recipe')
  await submitPage.submit()
  await submitPage.expectValidationError('Title is required')
})

// ❌ Bad - Tests multiple things
test('form validation works', async ({ page }) => {
  // Tests title validation
  // Tests description validation
  // Tests URL validation
  // Too much in one test!
})
```

---

## Common Patterns

### Pattern: Navigation

```typescript
test('can navigate to recipes', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.navigateToRecipes()

  await expect(page).toHaveURL('/recipe')
})
```

### Pattern: Form Submission

```typescript
test('can submit valid form', async ({ page }) => {
  const submitPage = new SubmitPage(page)
  await submitPage.goto('recipe')

  await submitPage.fill({
    title: 'My Recipe',
    description: 'Test description',
    body: 'Recipe content'
  })

  await submitPage.submit()
  await expect(page).toHaveURL('/recipe')
})
```

### Pattern: Search and Filter

```typescript
test('can search for content', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.search('Counter')

  const contentList = new ContentListPage(page)
  await contentList.expectContentDisplayed()

  const titles = await contentList.getContentTitles()
  expect(titles.some(t => t.includes('Counter'))).toBeTruthy()
})
```

### Pattern: Authentication Required

```typescript
test('can access admin page', async ({ page }) => {
  await loginAs(page, 'admin')

  const adminPage = new AdminDashboardPage(page)
  await adminPage.goto()
  await adminPage.expectDashboardVisible()
})
```

### Pattern: Permission Checking

```typescript
test('member cannot access admin page', async ({ page }) => {
  await loginAs(page, 'viewer')

  await page.goto('/admin')
  await expect(page).toHaveURL('/login')
})
```

---

## Troubleshooting

### Flaky Tests

**Symptoms:** Test passes sometimes, fails other times

**Common causes:**
1. **Race conditions** - Add proper waits
2. **Network timing** - Use `waitForLoadState` when needed
3. **Animation delays** - Wait for element state changes

**Solutions:**
```typescript
// Add explicit waits
await contentList.expectContentDisplayed()

// Wait for network to settle
await page.waitForLoadState('networkidle')

// Use retry logic for known flaky operations
await test.step('retry flaky operation', async () => {
  await expect(async () => {
    await page.getByTestId('element').click()
  }).toPass({ timeout: 10000 })
})
```

### Debugging Tests

**Run in headed mode to see what's happening:**
```bash
bun run test:integration:headed
```

**Run in debug mode to step through:**
```bash
bun run test:integration:debug
```

**Use Playwright Inspector:**
```bash
PWDEBUG=1 bun test:integration
```

**Add console logs in POMs:**
```typescript
async search(query: string): Promise<void> {
  console.log(`Searching for: ${query}`)
  await this.searchInput.fill(query)
  await this.searchInput.press('Enter')
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on every PR to `staging`:

**Workflow file:** `.github/workflows/playwright.yml`

**What happens:**
1. Install dependencies (with caching)
2. Install Playwright browsers (with caching - saves ~1.5 min)
3. Initialize and seed test database
4. Build application (~30-45 seconds)
5. Run tests (~15-20 seconds)
6. Post results as PR comment
7. Upload artifacts on failure

**Total time:** ~3-4 minutes

### PR Comments

Every test run posts a comment with:
- ✅/❌ Status
- Number of passed/failed tests
- Link to detailed HTML report

### Artifacts

On failure, these are uploaded:
- HTML report with screenshots
- Video recordings of failed tests
- Test logs

**Access:** Go to Actions → Workflow run → Artifacts

---

## Adding New Tests

### Checklist for New Test Files

1. ✅ Import required POMs and helpers
2. ✅ Add `setupDatabaseIsolation()` in `beforeEach`
3. ✅ Use `loginAs()` if authentication needed
4. ✅ Use POMs for all interactions
5. ✅ Add test-ids to any new UI elements
6. ✅ Keep tests focused and independent
7. ✅ Use descriptive test names
8. ✅ Run locally before pushing
9. ✅ Verify tests pass in CI

### Example New Test File

```typescript
import { test, expect } from '@playwright/test'
import { NewPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    await setupDatabaseIsolation(page)
    await loginAs(page, 'admin')
  })

  test('can do something', async ({ page }) => {
    const newPage = new NewPage(page)
    await newPage.goto()
    await newPage.doSomething()
    await newPage.expectSuccess()
  })
})
```

---

## Summary

**Key Takeaways:**

1. **Always use POMs** - Never interact with pages directly in tests
2. **Always use database isolation** - Call `setupDatabaseIsolation()` in every test
3. **Always use test-ids** - Never use CSS selectors or text matching
4. **Keep tests independent** - No shared state between tests
5. **Keep tests focused** - One behavior per test
6. **Use helpers** - `loginAs()`, test data from `test-data.ts`
7. **Write maintainable tests** - Future you will thank you!

**Questions?** Check `tests/README.md` or ask the team!
