# sveltesociety.dev

This branch contains the upcoming Svelte Society website featuring a new design and data that lives in a database. Currently being deployed to https://beta.sveltesociety.dev

## Developing

Steps to get running:

- Run `bun i`
- Run `bun run --bun dev`

### Environment Variables

Add all the relevant .env variables:

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_AUTHORIZATION_CALLBACK_URL=http://localhost:5173/auth/callback
DB_PATH=local.db
EVENT_DB_PATH=local_event.db
NIXPACKS_NODE_VERSION=20

DB_PATH=local.db
```

## Testing

This project uses Playwright for end-to-end testing with comprehensive test coverage.

### Running Tests

```bash
# Run all E2E tests
bun run test:integration

# Run tests in UI mode (interactive)
bun run test:integration:ui

# Run tests in headed mode (see browser)
bun run test:integration:headed
```

### Test Coverage

- **65 tests** across 14 test files
- **100% passing** with 0% flaky rate
- **~15-20 seconds** execution time
- **Full isolation** - each test file uses its own database

### Key Features

- ✅ **Database isolation** - Each test file gets its own isolated database
- ✅ **Parallel execution** - Tests run 4 at a time for speed
- ✅ **Page Object Model** - Maintainable and reusable test code
- ✅ **CI/CD integrated** - Automatically runs on every PR
- ✅ **Browser caching** - CI runs optimized for speed

### Documentation

- **Quick Start:** [`tests/README.md`](tests/README.md)
- **Best Practices:** [`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md)
- **PRD:** [`docs/PRD_PLAYWRIGHT_E2E_TESTING.md`](docs/PRD_PLAYWRIGHT_E2E_TESTING.md)

### Writing Tests

All tests follow the Page Object Model pattern:

```typescript
import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../pages'
import { setupDatabaseIsolation } from '../helpers/database-isolation'

test.describe('Feature', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can do something', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		// ... test implementation
	})
})
```

For more details, see the [Testing Guide](docs/TESTING_GUIDE.md).
