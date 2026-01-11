# E2E Testing Implementation - Production Ready

## Critical: New Features MUST Include Playwright Tests

**ALL NEW FEATURES REQUIRE E2E TESTS**

When adding a new feature:

1. Write Playwright tests using Page Object Model pattern
2. Add `data-testid` attributes to all new UI components
3. Use `setupDatabaseIsolation(page)` in test `beforeEach`
4. Update POMs if adding new pages or significant UI changes
5. **Update `tests/README.md`** if test categories/coverage changes
6. Verify tests pass in CI before merging

## Current Test Coverage

**65 tests** across 14 test files (100% passing, 0% flaky)

- Public Tests (13) - Content browsing, search, detail pages
- Authentication Tests (13) - Login flows, protected routes, roles
- Content Submission (9) - Submit recipes, videos, libraries
- Admin Moderation (4) - Approve/reject pending content
- Admin Content Management (5) - Edit, archive, publish
- Admin User Management (4) - View users, edit profiles, roles

## Test Infrastructure

### Database Isolation

- **Cookie-based routing** - Each test file gets isolated database copy
- **Auto-detection** - Test names from stack trace
- **Pre-creation** - `globalSetup` creates, `globalTeardown` cleans
- Files: `test-public-search.db`, `test-admin-moderation.db`, etc.

### Page Object Models (`tests/pages/`)

- BasePage - Common functionality
- HomePage - Navigation and search
- ContentListPage - Browse content
- ContentDetailPage - View details
- LoginPage - Authentication
- SubmitPage - Content submission
- AdminDashboardPage - Admin dashboard
- ModerationQueuePage - Content moderation
- ContentEditPage - Edit content
- UserManagementPage - User management

### Helpers & Fixtures

- `tests/helpers/database-isolation.ts` - Cookie routing
- `tests/helpers/auth.ts` - `loginAs('admin'|'contributor'|'viewer')`
- `tests/fixtures/test-data.ts` - Centralized test data

### Test Users

- `test_admin` - Admin role (full access)
- `test_contributor` - Moderator role (moderate content)
- `test_viewer` - Member role (read-only)

## Commands

```bash
bun run test:integration              # Run all tests (~15-20s)
bun run test:integration:ui           # Interactive UI mode
bun run test:integration:headed       # See browser
bun test:integration tests/e2e/path   # Run specific file
```

## CI/CD Integration

- **Workflow:** `.github/workflows/playwright.yml`
- **Triggers:** All PRs to `staging` branch
- **Performance:** ~3-4 minutes (browser caching saves ~1.5 min)
- **Features:** PR comments, HTML reports, screenshots, videos

## Test File Template

```typescript
import { test, expect } from '@playwright/test'
import { NewPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('New Feature', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin') // if auth needed
	})

	test('can do something', async ({ page }) => {
		const newPage = new NewPage(page)
		await newPage.goto()
		await newPage.doSomething()
		await newPage.expectSuccess()
	})
})
```

## Auto-Generated Test IDs

Form components auto-generate test-ids from `name` prop:

- `<Input name="username" />` → `data-testid="input-username"`
- `<Textarea name="description" />` → `data-testid="textarea-description"`
- `<Select name="role" />` → `data-testid="select-role"`

## Best Practices

### ✅ Do:

- Use POMs for all page interactions
- Add test-ids to new components
- Use `setupDatabaseIsolation()` in every test
- Write focused tests (one behavior per test)
- Keep tests independent (no shared state)
- Use `loginAs()` helper
- Rely on Playwright auto-waiting

### ❌ Don't:

- Use CSS selectors or XPath
- Add manual waits (`waitForTimeout`)
- Hardcode test data (use `test-data.ts`)
- Make tests depend on execution order
- Leave `test.only()` in committed code

## Documentation

- **Quick Start:** `tests/README.md` (344 lines)
- **Best Practices:** `docs/TESTING_GUIDE.md` (602 lines)
- **PRD:** `docs/PRD_PLAYWRIGHT_E2E_TESTING.md`
- **Main README:** Testing section with links

## Status: Production Ready ✅

All E2E testing infrastructure complete, documented, and integrated with CI/CD. New features must follow these patterns and include tests that are verified in CI before merging.
