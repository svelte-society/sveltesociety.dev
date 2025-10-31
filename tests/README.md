# E2E Testing Guide

This directory contains Playwright end-to-end tests for the Svelte Society platform.

## Quick Start

```bash
# Run all E2E tests
bun run test:integration

# Run tests in UI mode (interactive, great for development)
bun run test:integration:ui

# Run tests in headed mode (see browser)
bun run test:integration:headed

# Run tests in debug mode (step through tests)
bun run test:integration:debug

# Run specific test file
bun test:integration tests/e2e/public/search.spec.ts

# Run tests matching a pattern
bun test:integration --grep "search"
```

## Current Test Coverage

**Total E2E Tests:** 83 tests across 15 test files
**Total Unit Tests:** 47 tests across 1 test file
**Execution Time:** ~15-20 seconds E2E (with 4 parallel workers), <100ms unit tests
**Success Rate:** 100% (0% flaky tests)

### E2E Test Categories

- **Public Tests** (13 tests) - Content browsing, search, detail pages
- **Authentication Tests** (13 tests) - Login flows, protected routes, role-based access
- **Content Submission** (9 tests) - Submit recipes, videos, libraries with validation
- **Admin Moderation** (4 tests) - Approve/reject pending content
- **Admin Content Management** (5 tests) - Edit, archive, publish content
- **Admin User Management** (4 tests) - View users, edit profiles, manage roles
- **SEO Endpoints** (29 tests) - robots.txt, sitemap.xml validation and resilience

### Unit Test Categories

- **SEO Utils** (47 tests) - Meta tag generation, OG/Twitter Cards, helper functions

## Test Database & Isolation

### Database Isolation Strategy

Each test file gets its own isolated database copy to ensure complete test independence:

**How it works:**
1. `test.db` is the base database (initialized and seeded once)
2. Each test file gets a unique copy (e.g., `test-public-search.db`)
3. Tests set a cookie to route requests to their isolated database
4. Databases are automatically created in `globalSetup` and cleaned up in `globalTeardown`

**Benefits:**
- ✅ Perfect test isolation - no test can affect another
- ✅ Parallel execution safe - tests never conflict
- ✅ Fast - databases pre-created, not during test execution
- ✅ Clean - automatic cleanup after tests complete

### Database Setup Commands

```bash
# Initialize test database (creates schema, runs migrations)
bun run db:test:init

# Seed test database (adds test users, content, tags)
bun run db:test:seed

# These run automatically as part of test:integration
```

## Test Users

Three test users with different permission levels:

### Admin User
- **Username:** `test_admin`
- **Email:** `admin@test.local`
- **Role:** Admin (full access to all features)
- **Session Token:** `test_session_admin_token`

### Contributor User (Moderator)
- **Username:** `test_contributor`
- **Email:** `contributor@test.local`
- **Role:** Moderator (can submit and moderate content)
- **Session Token:** `test_session_contributor_token`

### Viewer User (Member)
- **Username:** `test_viewer`
- **Email:** `viewer@test.local`
- **Role:** Member (read-only access, can save content)
- **Session Token:** `test_session_viewer_token`

### Authentication in Tests

Use the `loginAs` helper function:

```typescript
import { loginAs } from '../../helpers/auth'

test.beforeEach(async ({ page }) => {
  await setupDatabaseIsolation(page)
  await loginAs(page, 'admin')  // or 'contributor' or 'viewer'
})
```

## Test Data

Seed data includes:

**Content:** 8 items (recipes, videos, libraries, blogs, links, events)
- Mix of published, pending review, and draft content
- Variety of content types for testing different views

**Tags:** 10 tags (svelte, sveltekit, testing, components, etc.)

**Saved Content:** Pre-saved items for testing saved content features

**Moderation Queue:** 1 pending item for testing moderation workflows

See `tests/fixtures/test-data.ts` for complete test data definitions.

## Test Structure

```
tests/
├── e2e/                    # End-to-end test suites
│   ├── public/             # Public user flows (browsing, search, detail pages)
│   ├── auth/               # Authentication flows (login, protected routes, roles)
│   ├── content/            # Content submission (recipes, videos, libraries)
│   └── admin/              # Admin workflows (moderation, content mgmt, users)
├── pages/                  # Page Object Models (POMs)
│   ├── BasePage.ts         # Base class with common functionality
│   ├── HomePage.ts         # Homepage navigation and search
│   ├── ContentListPage.ts  # Content browsing pages
│   ├── ContentDetailPage.ts # Individual content detail pages
│   ├── LoginPage.ts        # Login and authentication
│   ├── SubmitPage.ts       # Content submission forms
│   ├── AdminDashboardPage.ts # Admin dashboard
│   ├── ModerationQueuePage.ts # Content moderation
│   ├── ContentEditPage.ts  # Content editing
│   ├── UserManagementPage.ts # User management
│   └── index.ts            # Exports all POMs
├── helpers/                # Utility functions
│   ├── auth.ts             # Authentication helpers (loginAs, logout)
│   └── database-isolation.ts # Database isolation setup
├── fixtures/               # Test data and fixtures
│   └── test-data.ts        # Centralized test data definitions
└── setup/                  # Global setup/teardown
    ├── global-setup.ts     # Pre-create isolated databases
    └── global-teardown.ts  # Cleanup isolated databases
```

## Writing Tests

### Page Object Model (POM) Pattern

All tests use POMs to encapsulate page interactions:

```typescript
import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await setupDatabaseIsolation(page)
  })

  test('can search for content', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.search('Counter')

    const contentList = new ContentListPage(page)
    await contentList.expectContentDisplayed()

    const titles = await contentList.getContentTitles()
    expect(titles.some(title => title.includes('Counter'))).toBeTruthy()
  })
})
```

**Why POMs?**
- ✅ Maintainable - changes to UI only affect POM, not all tests
- ✅ Reusable - same page interactions used across multiple tests
- ✅ Readable - tests read like plain English
- ✅ Type-safe - TypeScript ensures correct usage

### Test-ID Selectors

**Always use `data-testid` attributes** for element selection:

```svelte
<!-- Component.svelte -->
<button data-testid="submit-button">Submit</button>
<input data-testid="search-input" type="search" />
<article data-testid="content-card">...</article>
```

```typescript
// POM
get submitButton(): Locator {
  return this.page.getByTestId('submit-button')
}
```

**Auto-generated test-ids:**
Form components automatically generate test-ids from their `name` prop:
- `<Input name="username" />` → `data-testid="input-username"`
- `<Textarea name="description" />` → `data-testid="textarea-description"`
- `<Select name="role" />` → `data-testid="select-role"`

**Why test-ids?**
- ✅ Stable - don't break when CSS/styling changes
- ✅ Explicit - clear intent for testing
- ✅ Fast - direct element lookup
- ❌ Avoid CSS selectors (`.class`, `#id`)
- ❌ Avoid text selectors (`text=Submit`)

### Best Practices

**✅ Do:**
- Use POMs for all page interactions
- Add test-ids to new components
- Use `setupDatabaseIsolation()` in `beforeEach`
- Write focused tests (test one thing per test)
- Keep tests independent (no shared state)
- Use descriptive test names
- Rely on Playwright's auto-waiting
- Use helper functions (`loginAs`, etc.)

**❌ Don't:**
- Use CSS selectors or XPath
- Add unnecessary waits (use `waitForLoadState` only when needed)
- Test implementation details
- Make tests depend on execution order
- Leave `test.only()` or `test.skip()` in committed code
- Hardcode test data (use `test-data.ts`)

### Database Isolation Setup

**Every test file must call `setupDatabaseIsolation()`:**

```typescript
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.beforeEach(async ({ page }) => {
  await setupDatabaseIsolation(page)  // Auto-detects test file name
})
```

This automatically:
1. Detects your test file name from the stack trace
2. Sets a cookie to route requests to your isolated database
3. Ensures complete test independence

## Performance & Parallelization

**Current Performance:**
- **Local:** ~14 seconds for 65 tests (with 4 workers)
- **CI:** ~15-20 seconds for test execution
- **Total CI time:** ~3-4 minutes (including build, dependencies, database setup)

**Parallel Execution:**
- ✅ Enabled by default (`fullyParallel: true`)
- ✅ 4 workers run tests concurrently
- ✅ Database isolation ensures safety

**Why it's fast:**
- Pre-created isolated databases (no runtime overhead)
- Parallel execution (4 tests at once)
- Efficient POMs (no redundant waits)
- Optimized CI (browser caching saves ~1.5 minutes)

## Troubleshooting

### Tests fail with "database locked"
- Check that no other process is accessing test databases
- Ensure tests are using `setupDatabaseIsolation()`
- Try running with `--workers=1` to isolate the issue

### Tests fail with "session not found" / "Unauthorized"
- Ensure you're using `loginAs()` helper for authenticated tests
- Check that database was seeded: `bun run db:test:seed`
- Verify session tokens in `tests/fixtures/test-data.ts`

### Tests timeout
- Check for missing `await` keywords
- Ensure elements have `data-testid` attributes
- Look for slow network requests in the test output
- Try running in headed mode to see what's happening: `bun run test:integration:headed`

### Flaky tests
- Avoid `waitForTimeout()` - use `waitForLoadState('networkidle')` if needed
- Ensure proper waiting with `expectContentDisplayed()` or similar
- Check for race conditions in asynchronous operations
- Use `test.fail()` to mark known flaky tests

### Build or environment issues
- Check that `.env.development` exists with required variables
- Ensure `bun install` completed successfully
- Try cleaning: `rm -rf node_modules && bun install`
- Clear test databases: `rm -f test*.db*`

## CI/CD Integration

Tests run automatically on GitHub Actions for every PR to `staging`:

**Workflow:** `.github/workflows/playwright.yml`

**Steps:**
1. Install dependencies
2. Cache Playwright browsers (~1.5 min savings)
3. Initialize and seed test database
4. Build application
5. Run Playwright tests
6. Post results as PR comment
7. Upload artifacts (HTML report, screenshots, videos)

**Performance:**
- First run: ~5-6 minutes (downloads browsers)
- Subsequent runs: ~3-4 minutes (uses cached browsers)

**Artifacts:**
- HTML report (always uploaded, 30 day retention)
- Test results with screenshots/videos (uploaded on failure, 30 day retention)

## Additional Resources

- **Playwright Documentation:** https://playwright.dev
- **PRD:** `docs/PRD_PLAYWRIGHT_E2E_TESTING.md`
- **Testing Guide:** `docs/TESTING_GUIDE.md` (coming soon)
- **Test Data:** `tests/fixtures/test-data.ts`

## Getting Help

If you encounter issues:
1. Check this README's troubleshooting section
2. Review test output and error messages
3. Run in headed mode to see browser: `bun run test:integration:headed`
4. Check CI logs for similar failures
5. Ask in team chat or create an issue
