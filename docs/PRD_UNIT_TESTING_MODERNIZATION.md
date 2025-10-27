# PRD: Unit Testing Modernization & Infrastructure Upgrade

## Status: Draft
**Created:** 2025-10-27
**Author:** System Analysis
**Priority:** High

---

## Executive Summary

The project has **14 unit test files** (~2,500 lines) covering server-side services that are currently **non-functional** (13 failing, 1 passing). These tests were written between 2021-2025 but have become incompatible with the current Vitest-based test runner due to Bun-specific imports. This PRD outlines the strategy to modernize the unit testing infrastructure, fix all failing tests, and integrate them into CI/CD.

---

## Current State Analysis

### Test Coverage Overview

**Total Test Files:** 14
- **Status:** 13 failing (92.9%), 1 passing (7.1%)
- **Total Lines:** ~2,500 lines of test code
- **Last Updated:** Most recent changes in May 2025, oldest from 2021
- **Test Runner:** Vitest 3.2.4
- **Runtime:** Bun (production), but tests need Node/Vitest compatibility

### Test File Inventory

| File | Service | Status | Primary Issue |
|------|---------|--------|---------------|
| `cache.test.ts` | CacheService | ❌ Failing | `bun:sqlite` import |
| `collections.test.ts` | CollectionService | ❌ Failing | `bun:test` import |
| `content.test.ts` | ContentService | ❌ Failing | `bun:sqlite` import |
| `events.test.ts` | EventsService | ❌ Failing | `bun:sqlite` import |
| `external-content.test.ts` | ExternalContentService | ❌ Failing | `bun:sqlite` import |
| `interactions.test.ts` | InteractionsService | ❌ Failing | `bun:test` import |
| `metadata.test.ts` | MetadataService | ❌ Failing | `bun:test` import |
| `moderation.test.ts` | ModerationService | ❌ Failing | `bun:test` import |
| `role.test.ts` | RoleService | ❌ Failing | `bun:test` import |
| `search.test.ts` | SearchService | ❌ Failing | `bun:test` import |
| `session.test.ts` | SessionService | ❌ Failing | `bun:test` import |
| `tags.test.ts` | TagService | ❌ Failing | `bun:test` import |
| `user.test.ts` | UserService | ❌ Failing | `bun:test` import |
| `index.test.ts` | (Sample) | ✅ Passing | Simple example test |

### Root Cause Analysis

1. **Import Incompatibility:** Tests use Bun-specific imports (`bun:test`, `bun:sqlite`) that don't work with Vitest
2. **Mixed Testing Frameworks:** Some tests import from `bun:test`, others from `vitest` (inconsistent)
3. **No CI Integration:** Unit tests are not run in CI (only E2E Playwright tests)
4. **No Vitest Configuration:** Missing `vitest.config.ts` with proper Bun SQLite support
5. **Outdated Test Patterns:** Tests written 2-4 years ago may not align with current service APIs

### Comparison with E2E Testing

The project has **excellent E2E test coverage** (65 Playwright tests, 100% passing, integrated with CI/CD). Unit tests should complement, not duplicate, this coverage by:
- Testing business logic in isolation
- Testing edge cases and error handling
- Enabling faster feedback loops (seconds vs minutes)
- Testing database operations without full stack

---

## Problem Statement

**Developers cannot run unit tests**, which means:
- No fast feedback on service-level logic changes
- Risk of breaking business logic without detection
- No unit test discipline for new features
- 2,500 lines of test code providing zero value
- Technical debt accumulating since 2021

---

## Goals & Success Metrics

### Primary Goals

1. **Fix all 13 failing unit tests** (100% pass rate)
2. **Integrate unit tests into CI/CD** (run on every PR to `staging`)
3. **Establish testing patterns** for Bun + Vitest + SQLite
4. **Document unit testing practices** for future contributors

### Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Passing unit tests | 1/14 (7%) | 14/14 (100%) | Sprint 1 |
| Test execution time | N/A | < 30 seconds | Sprint 1 |
| CI integration | None | Automated on PR | Sprint 2 |
| Test coverage | Unknown | > 80% for services | Sprint 3 |
| Documentation | None | Complete guide | Sprint 2 |

---

## Proposed Solution

### Phase 1: Infrastructure Setup (Sprint 1, Week 1)

#### 1.1 Create Vitest Configuration

**File:** `vitest.config.ts` (separate from `vite.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'node',
    pool: 'forks', // Required for Bun SQLite
    poolOptions: {
      forks: {
        singleFork: true // Prevent SQLite lock issues
      }
    },
    setupFiles: ['./tests/setup/unit-test-setup.ts']
  }
})
```

#### 1.2 Create Test Setup File

**File:** `tests/setup/unit-test-setup.ts`

- Mock environment variables
- Set up global test utilities
- Configure Bun SQLite for Vitest
- Create test database helper functions

#### 1.3 Fix Import Statements

**Strategy:** Replace all Bun-specific imports

```typescript
// ❌ Before (Bun-specific)
import { describe, test, expect } from 'bun:test'
import { Database } from 'bun:sqlite'

// ✅ After (Vitest-compatible)
import { describe, test, expect } from 'vitest'
import Database from 'bun:sqlite' // Bun SQLite still works in Vitest with proper config
```

---

### Phase 2: Test Fixes & Validation (Sprint 1, Week 2)

#### 2.1 Fix Test Files (Priority Order)

1. **High Priority** (Core services, frequently modified):
   - `content.test.ts` - ContentService (core functionality)
   - `user.test.ts` - UserService (authentication/authorization)
   - `search.test.ts` - SearchService (critical feature)

2. **Medium Priority** (Important but stable):
   - `moderation.test.ts` - ModerationService
   - `session.test.ts` - SessionService
   - `tags.test.ts` - TagService
   - `role.test.ts` - RoleService

3. **Low Priority** (Newer or less critical):
   - `cache.test.ts` - CacheService
   - `collections.test.ts` - CollectionService
   - `events.test.ts` - EventsService
   - `external-content.test.ts` - ExternalContentService
   - `interactions.test.ts` - InteractionsService
   - `metadata.test.ts` - MetadataService

#### 2.2 Test Validation Checklist

For each test file:
- [ ] Replace Bun imports with Vitest imports
- [ ] Verify schema/triggers are loaded correctly
- [ ] Check test data matches current schema
- [ ] Validate assertions against current service APIs
- [ ] Run tests in isolation (`bun run test -- <file>`)
- [ ] Run all tests together (`bun run test`)
- [ ] Fix any race conditions or timing issues

#### 2.3 API Compatibility Audit

Some tests were written in 2021-2023. Verify:
- Service method signatures haven't changed
- Database schema matches test expectations
- Return types align with current TypeScript definitions

---

### Phase 3: CI/CD Integration (Sprint 2, Week 1)

#### 3.1 Create GitHub Actions Workflow

**File:** `.github/workflows/unit-tests.yml`

```yaml
name: Unit Tests

on:
  push:
    branches: [staging]
  pull_request:
    branches: [staging]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run unit tests
        run: bun run test

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          files: ./coverage/coverage-final.json
```

#### 3.2 Add PR Checks

- Unit tests must pass before merging
- Display coverage report in PR comments
- Block merge if coverage drops below threshold

---

### Phase 4: Documentation & Best Practices (Sprint 2, Week 2)

#### 4.1 Create Testing Guide

**File:** `docs/UNIT_TESTING_GUIDE.md`

Topics to cover:
- When to write unit tests vs E2E tests
- Setting up test database fixtures
- Mocking external dependencies
- Running tests locally
- Writing tests for new services
- Test file structure and naming conventions

#### 4.2 Update Main README

Add section:
```markdown
## Testing

### Unit Tests
Fast, isolated tests for service-level logic.

npm run test              # Run all unit tests
npm run test -- <file>    # Run specific test file
npm run test:coverage     # Generate coverage report

### E2E Tests
Full-stack integration tests using Playwright.
[See E2E Testing Guide](./docs/TESTING_GUIDE.md)
```

#### 4.3 Update CLAUDE.md

Add requirement:
```markdown
## Testing Requirements

- **All new services MUST include unit tests**
- **All new features MUST include E2E tests**
- Unit tests should cover business logic, edge cases, and error handling
- E2E tests should cover user flows and UI interactions
```

---

### Phase 5: Coverage Expansion (Sprint 3)

#### 5.1 Measure Current Coverage

```bash
bun run test:coverage
```

Generate coverage report to identify gaps.

#### 5.2 Add Missing Test Cases

For each service, ensure coverage of:
- Happy path scenarios ✅
- Error conditions (invalid input, missing data)
- Edge cases (empty arrays, null values, boundary conditions)
- Concurrent operations (if applicable)
- Transaction rollbacks (for database operations)

#### 5.3 Set Coverage Thresholds

Configure in `vitest.config.ts`:
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  }
}
```

---

## Technical Considerations

### Bun + Vitest Compatibility

**Challenge:** Bun's SQLite module (`bun:sqlite`) is not natively supported by Vitest.

**Solution:**
1. Use Vitest's `pool: 'forks'` option to run tests in Bun runtime
2. Configure `singleFork: true` to avoid SQLite locking issues
3. Ensure database cleanup in `afterEach` hooks

### Test Isolation

**Problem:** Shared database state can cause flaky tests.

**Solution:**
- Use in-memory databases (`:memory:`) for tests
- Clear tables in `beforeEach` hooks
- Avoid test interdependencies
- Use transactions with rollback for complex scenarios

### Mocking Strategy

**When to mock:**
- External API calls (GitHub, YouTube, etc.)
- File system operations
- Time-dependent operations (`Date.now()`)

**When NOT to mock:**
- Database operations (use real SQLite in-memory DB)
- Internal service methods (test real integration)

---

## Migration Strategy

### Option A: Big Bang (Recommended)

**Approach:** Fix all tests in one PR.

**Pros:**
- Single, focused effort
- Complete solution at once
- Easier to test infrastructure changes

**Cons:**
- Large PR (but mostly mechanical changes)
- Higher risk if something breaks

**Timeline:** 3-5 days

### Option B: Incremental

**Approach:** Fix tests in batches (high/medium/low priority).

**Pros:**
- Smaller PRs, easier review
- Lower risk per PR

**Cons:**
- Longer overall timeline
- Partial value until complete
- More overhead (multiple PRs, reviews, deployments)

**Timeline:** 2 weeks

**Recommendation:** **Option A** - The changes are mostly mechanical (import replacements), and having partial test coverage provides limited value. Better to fix everything at once.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tests still fail after fixes | Medium | High | Thorough validation per file; run tests locally before CI |
| Tests are too slow | Low | Medium | Use in-memory DB; optimize fixtures |
| Tests become flaky | Medium | High | Enforce test isolation; use transactions |
| Vitest + Bun incompatibility | Low | High | Use `pool: 'forks'` option; test early |
| Old tests don't match current APIs | Medium | Medium | Audit service signatures before fixing tests |
| CI/CD integration breaks | Low | Medium | Test workflow in separate branch first |

---

## Dependencies & Blockers

### Dependencies
- None (all tooling already installed)

### Potential Blockers
- If Bun SQLite truly incompatible with Vitest, may need alternative (e.g., better-sqlite3)
- If service APIs have drastically changed, may need test rewrites (not just fixes)

### Rollback Plan
- If unit tests cannot be fixed, consider:
  1. Rewriting tests using `bun test` instead of Vitest
  2. Using a different SQLite library (better-sqlite3)
  3. Removing unit tests and relying solely on E2E tests (not recommended)

---

## Success Criteria

**Sprint 1 Complete:**
- [ ] All 14 unit tests passing locally (`bun run test`)
- [ ] Tests run in < 30 seconds
- [ ] Vitest configuration properly set up
- [ ] Test isolation verified (no flaky tests)

**Sprint 2 Complete:**
- [ ] CI/CD workflow created and passing
- [ ] PR checks enforced (unit tests + E2E tests)
- [ ] Documentation completed (UNIT_TESTING_GUIDE.md)
- [ ] CLAUDE.md updated with testing requirements

**Sprint 3 Complete:**
- [ ] Code coverage > 80% for service layer
- [ ] Coverage reports integrated into CI
- [ ] All services have comprehensive test suites

---

## Open Questions

1. **Should we use `bun test` instead of Vitest?**
   - Pros: Native Bun support, simpler setup
   - Cons: Different test runner than E2E (Playwright uses Node), potential ecosystem issues

2. **What coverage threshold is realistic?**
   - Suggest: Start at 70%, increase to 80% over time
   - Focus on critical paths first (auth, content management)

3. **Should unit tests use the same test database as E2E tests?**
   - No - use in-memory DB for unit tests (faster, isolated)
   - E2E tests should use persistent test DB (realistic scenarios)

4. **How do we prevent tests from becoming stale again?**
   - Enforce unit tests for all new services (CLAUDE.md requirement)
   - Run unit tests in CI on every PR
   - Periodic audit (quarterly?) to ensure tests still pass

---

## Appendix A: Example Test Fix

### Before (Failing)
```typescript
import { describe, test, expect } from 'bun:test'
import { Database } from 'bun:sqlite'
import { UserService } from './user'

describe('UserService', () => {
  let db: Database
  let userService: UserService

  beforeAll(async () => {
    db = new Database(':memory:', { strict: true })
    const schema = Bun.file('src/lib/server/db/schema/schema.sql')
    const schemaContent = await schema.text()
    db.exec(schemaContent)
    userService = new UserService(db)
  })

  test('creates a user', () => {
    const user = userService.createUser({ name: 'Test User' })
    expect(user.name).toBe('Test User')
  })
})
```

### After (Passing)
```typescript
import { describe, test, expect, beforeAll } from 'vitest'
import Database from 'bun:sqlite'
import { UserService } from './user'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('UserService', () => {
  let db: Database
  let userService: UserService

  beforeAll(() => {
    db = new Database(':memory:', { strict: true })
    const schemaPath = join(process.cwd(), 'src/lib/server/db/schema/schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    db.exec(schema)
    userService = new UserService(db)
  })

  test('creates a user', () => {
    const user = userService.createUser({ name: 'Test User' })
    expect(user.name).toBe('Test User')
  })
})
```

**Key Changes:**
1. Import `beforeAll` from `vitest` (not `bun:test`)
2. Use `readFileSync` instead of `Bun.file()` for schema loading
3. Keep Bun SQLite (works with Vitest when using `pool: 'forks'`)

---

## Appendix B: Recommended Package Scripts

Update `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:integration": "rm -f test-*.db* && NODE_ENV=test bun run db:test:init && bun run db:test:seed && playwright test"
  }
}
```

**Naming clarification:**
- `test` = unit tests (fast, isolated)
- `test:integration` = E2E tests (full stack)

---

## Appendix C: Related Documentation

- [E2E Testing Guide](./TESTING_GUIDE.md) - Comprehensive Playwright testing guide
- [E2E Testing Memory](./E2E_TESTING_MEMORY.md) - Quick reference for E2E patterns
- [tests/README.md](../tests/README.md) - E2E test documentation

---

## Conclusion

The unit testing infrastructure is salvageable and valuable. With ~5 days of focused effort, we can:
- Fix all 13 failing tests (mostly mechanical import changes)
- Integrate unit tests into CI/CD
- Establish testing patterns for future development
- Complement the excellent E2E test coverage

**Recommended Action:** Proceed with **Option A (Big Bang)** approach in Sprint 1.

---

**Next Steps:**
1. Review and approve this PRD
2. Create implementation ticket
3. Assign developer(s)
4. Begin Sprint 1 work
