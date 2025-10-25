# E2E Testing Guide

This directory contains Playwright end-to-end tests for the Svelte Society platform.

## Running Tests

```bash
# Run all E2E tests
bun run test:integration

# Run tests in UI mode (interactive)
bun run test:integration:ui

# Run tests in headed mode (see browser)
bun run test:integration:headed

# Run tests in debug mode
bun run test:integration:debug
```

## Test Database

Tests use a separate `test.db` database that is automatically initialized and seeded before each test run.

### Database Setup

The test database is managed by two scripts:

1. **`bun run db:test:init`** - Creates and initializes the test database with schema and migrations
2. **`bun run db:test:seed`** - Seeds the database with test data (users, content, tags, etc.)

These scripts run automatically as part of `test:integration`.

## Test User Credentials

Three test users are created with different permission levels:

### Admin User
- **Username:** `test_admin`
- **Email:** `admin@test.local`
- **Role:** Admin (full access)
- **Session Token:** `test_session_admin_token`

### Contributor User
- **Username:** `test_contributor`
- **Email:** `contributor@test.local`
- **Role:** Moderator (can submit and moderate content)
- **Session Token:** `test_session_contributor_token`

### Viewer User
- **Username:** `test_viewer`
- **Email:** `viewer@test.local`
- **Role:** Member (read-only access)
- **Session Token:** `test_session_viewer_token`

## Test Data

The seed script creates the following test data:

### Content (8 items)
- **Published Recipe:** "Test Recipe: Building a Counter Component"
- **Published Video:** "Test Video: Svelte 5 Introduction"
- **Published Library:** "Test Library: Svelte Testing Library"
- **Published Blog:** "Test Blog: Getting Started with Svelte 5"
- **Published Link:** "Test Link: Official Svelte Documentation"
- **Pending Review:** "Test Pending: New Animation Tutorial"
- **Draft:** "Test Draft: Work in Progress Article"
- **Event:** "Test Event: Svelte Summit 2025"

### Tags (10 items)
- svelte
- sveltekit
- testing
- components
- animation
- forms
- routing
- state-management
- tutorial
- advanced

### Saved Content
- Viewer has saved the recipe and video
- Contributor has saved the library

### Moderation Queue
- 1 pending item submitted by the contributor

## Authentication in Tests

### Using Session Tokens

Tests can authenticate by setting cookies with the session token:

```typescript
// Example (will be implemented in Phase 2b)
await page.goto('/')
await page.context().addCookies([{
  name: 'session_token',
  value: 'test_session_admin_token',
  domain: 'localhost',
  path: '/'
}])
```

### Authentication Fixtures

Authentication fixtures will be created in Phase 2b to provide pre-authenticated browser contexts for different user roles.

## Test Structure

```
tests/
├── fixtures/           # Custom fixtures (auth, db, etc.)
├── pages/              # Page Object Models
├── helpers/            # Utility functions
├── e2e/                # End-to-end test suites
│   ├── public/         # Public user flows
│   ├── auth/           # Authentication flows
│   └── admin/          # Admin workflows
└── setup/              # Global setup/teardown
```

## Writing Tests

### Page Object Model Pattern

Tests use the Page Object Model (POM) pattern to encapsulate page interactions:

```typescript
import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../pages'

test('can navigate to recipes', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.navigateToRecipes()

  const contentList = new ContentListPage(page)
  await contentList.expectContentDisplayed()
})
```

**Available POMs:**
- `BasePage` - Base class with common functionality
- `HomePage` - Homepage navigation and search
- `ContentListPage` - Content browsing pages (recipes, videos, etc.)
- `ContentDetailPage` - Individual content detail pages

### Using Test-ID Selectors

**Always use `data-testid` attributes** for element selection:

```svelte
<!-- Component.svelte - Add test-ids -->
<button data-testid="submit-button">Submit</button>
<input data-testid="search-input" type="search" />
<article data-testid="content-card">...</article>
```

```typescript
// POM - Use getByTestId()
get submitButton(): Locator {
  return this.page.getByTestId('submit-button')
}

get searchInput(): Locator {
  return this.page.getByTestId('search-input')
}
```

**Why test-ids?**
- ✅ Stable - don't break when CSS changes
- ✅ Explicit - clear intent for testing
- ✅ Fast - direct element lookup
- ❌ Don't use CSS selectors (`.class`, `#id`)
- ❌ Don't use text selectors (`text=Submit`)

### Best Practices

**✅ Do:**
- Use POMs for all page interactions
- Add test-ids to new components
- Write focused tests (one assertion per test)
- Keep tests independent
- Use descriptive test names
- Rely on Playwright auto-waiting

**❌ Don't:**
- Use CSS selectors or XPath
- Add manual waits (`waitForTimeout`, `waitForLoadState`)
- Modify database during tests
- Make tests depend on execution order
- Leave `test.only()` or `test.skip()` in code

### Test Isolation

- Each test file should be independent
- Tests run in **parallel** (4 workers) for faster execution
- Database is read-only during test execution (no writes)
- Database is cleared and reseeded before test runs

### Parallel Execution

All current tests are **read-only** and safe to run in parallel:

```typescript
// playwright.config.ts
{
  fullyParallel: true,
  workers: 4  // Run 4 tests in parallel
}
```

**Performance:**
- Total test time: ~9.5 seconds
  - DB init: ~0.03s
  - DB seed: ~0.02s
  - Tests (4 workers): ~9.2s
- Build only happens once (via webServer), then reused
- First run includes build (~6s), subsequent runs skip build

**Why it's safe:**
- All tests only read from pre-seeded database
- No tests modify database during execution
- SQLite WAL mode supports concurrent reads
- Each worker has isolated browser context

**When to use serial execution:**

If you write tests that modify the database, mark them as serial:

```typescript
test.describe.serial('Content Submission', () => {
  test('can submit new content', async ({ page }) => {
    // This modifies the database
  })
})
```

Or run with sequential execution for debugging:
```bash
bun playwright test --workers=1
```

## Troubleshooting

### Tests fail with "database locked"
The test database uses WAL mode, but tests run sequentially to prevent conflicts. If you see this error, check that no other process is accessing `test.db`.

### Tests fail with "session not found"
Ensure the database has been seeded by running `bun run db:test:seed` or the full `test:integration` command.

### Build fails
Check that `.env.test` exists and contains all required environment variables.

## CI/CD

Tests will run automatically on GitHub Actions for every PR (Phase 7a).

## Next Steps

See `docs/PRD_PLAYWRIGHT_E2E_TESTING.md` for the full implementation plan.
