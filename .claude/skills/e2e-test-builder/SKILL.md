---
name: E2E Test Builder
description: Create Playwright E2E tests using Page Object Model pattern with database isolation
---

# E2E Test Builder

Use this skill when creating Playwright end-to-end tests for this project.

## When to Use

- Adding tests for a new feature
- Testing user flows (authentication, content submission, admin actions)
- Validating UI interactions and navigation

## Key Concepts

### Database Isolation
Each test file gets its own isolated database copy:
- Call `setupDatabaseIsolation(page)` in `beforeEach`
- Auto-detects test file name from stack trace
- Ensures complete test independence

### Page Object Model (POM)
All tests use POMs to encapsulate page interactions:
- POMs live in `tests/pages/`
- Extend `BasePage` for common functionality
- Use `data-testid` attributes for element selection

### Test Users
Three users with different permission levels:
- `admin` - Full access (use for admin tests)
- `contributor` - Moderator role (can moderate content)
- `viewer` - Member role (read-only access)

## Quick Start

```typescript
import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await setupDatabaseIsolation(page)
    await loginAs(page, 'admin')  // if auth needed
  })

  test('can do something', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    // ... test logic
  })
})
```

## Reference Files

- [PAGE-OBJECTS.md](./PAGE-OBJECTS.md) - Creating Page Object Model classes
- [TEST-PATTERNS.md](./TEST-PATTERNS.md) - Test structure, assertions, helpers
- [TEMPLATES.md](./TEMPLATES.md) - Copy-paste starter templates

## Commands

```bash
bun run test:integration              # Run all tests
bun run test:integration:ui           # Interactive UI mode
bun run test:integration:headed       # See browser
bun test:integration tests/e2e/path   # Run specific file
```

## Directory Structure

```
tests/
├── e2e/                    # Test suites by category
│   ├── public/             # Public user flows
│   ├── auth/               # Authentication flows
│   ├── content/            # Content submission
│   └── admin/              # Admin workflows
├── pages/                  # Page Object Models
├── helpers/                # Auth, database isolation
├── fixtures/               # Test data definitions
└── setup/                  # Global setup/teardown
```
