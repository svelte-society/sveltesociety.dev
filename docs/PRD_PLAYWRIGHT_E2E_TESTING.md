# PRD: Playwright E2E Testing Implementation

**Author:** Engineering Team
**Date:** 2025-10-21
**Status:** In Progress
**Version:** 1.1
**Last Updated:** 2025-10-22

---

## Progress Summary

### ✅ Completed Phases (Foundation - Phase 2c)
- **Phase 1a-1d:** Database foundation, seeding, Playwright configuration, and first passing tests
- **Phase 2a-2c:** Test helpers, utilities, authentication fixtures, and Page Object Models

### 🎯 Current Phase
- **Phase 3a:** Ready to implement Public Content Browsing Tests

### 📊 Test Statistics
- **Total Tests:** 9 passing
  - 1 homepage test using POM pattern (test.spec.ts)
  - 3 basic authentication tests (simple-auth.spec.ts)
  - 3 admin authentication tests (admin-login.spec.ts)
  - 3 viewer authentication tests (viewer.spec.ts)
- **Test Infrastructure:** ✅ Complete
- **Authentication:** ✅ Working
- **Database:** ✅ Isolated test environment
- **Page Object Models:** ✅ Foundation established (BasePage, HomePage)

### 🐛 Bug Fixes
- Fixed critical TypeIcon component error (`TypeError: Icon is not a function`)
- Cleaned up test data to only include valid content types

---

## Executive Summary

This document outlines the requirements and implementation strategy for introducing comprehensive end-to-end (E2E) testing using Playwright in the Svelte Society content management platform. While Playwright is already installed and a basic test exists, we need a robust, scalable E2E testing framework that covers critical user journeys, authentication flows, and content management workflows.

---

## Current State Analysis

### Existing Infrastructure

**✅ What We Have:**
- Playwright installed (`@playwright/test@^1.56.0`)
- Working configuration in `playwright.config.ts` with test environment
- Database initialization script (`scripts/test-db-init.ts`)
- Database seeding script (`scripts/test-db-seed.ts`)
- Test data fixtures in `tests/fixtures/test-data.ts`
- Authentication helpers (`tests/helpers/auth.ts`)
- Authentication fixtures (`tests/fixtures/auth.fixture.ts`)
- Basic E2E tests for public routes and authentication
- Test helpers for database operations (`tests/helpers/db.ts`)
- Comprehensive unit test coverage for services (15 service test files)
- Vitest for unit testing with in-memory database mocking
- Service layer architecture with clear separation of concerns
- Fixed TypeIcon component bug that was blocking E2E tests

**❌ Current Gaps:**
- No Page Object Models (POMs)
- Limited coverage of critical user flows (only basic smoke tests)
- No CI/CD integration for E2E tests
- No test isolation strategy for parallel execution
- No content submission tests
- No admin workflow tests

### Application Architecture Context

**Route Structure:**
- Public routes: Home, Events, Content browsing (`[...type]`, `[type]/[slug]`), User profiles, Submit, Saved
- Authentication: Login, OAuth callback
- Admin routes: Content management, Moderation queue, User/Role management, Tags, Bulk import, Announcements

**Key Features to Test:**
- **Content Types:** `recipe`, `video`, `library`, `announcement`, `collection` (only valid types in schema)
- **Content Status Workflow:** `draft` → `pending_review` → `published` → `archived`
- **Authentication:** GitHub OAuth, session management, role-based permissions
- **Search:** Orama-powered full-text search
- **External Content:** YouTube video imports, GitHub repository imports
- **Interactions:** Saves/bookmarks, content filtering, pagination
- **Admin Features:** Content moderation, role management, bulk operations

---

## Goals & Success Metrics

### Primary Goals

1. **Confidence in Deployments:** Catch regressions before production
2. **Critical Path Coverage:** Test all user-critical workflows end-to-end
3. **Authentication Testing:** Verify auth flows and role-based access
4. **Cross-browser Validation:** Ensure consistent behavior across browsers
5. **CI/CD Integration:** Automated test execution on every PR

### Success Metrics

- ✅ 80%+ coverage of critical user journeys within 3 months
- ✅ E2E tests run in <10 minutes in CI
- ✅ <5% flaky test rate
- ✅ Zero production incidents related to untested flows after 6 months
- ✅ All new features ship with corresponding E2E tests

---

## Requirements

### Functional Requirements

#### 1. Test Database Management

**FR-1.1: Test Database Initialization**
- Create isolated SQLite database for tests (`test.db`)
- Initialize schema from migrations on test startup
- Support both development and CI environments
- Clean database state between test runs

**FR-1.2: Test Data Seeding**
- Seed minimal user data (test users with different roles: admin, contributor, viewer)
- Seed sample content across all types
- Seed tags, collections, and external content
- Provide fixtures for common test scenarios

**FR-1.3: Database Isolation**
- Each test file or suite should have isolated data
- Support parallel test execution where possible
- Cleanup after test completion

#### 2. Authentication & Authorization Testing

**FR-2.1: Authentication Fixtures**
- Pre-authenticated browser contexts for different user roles
- Storage state management for session persistence
- Helper functions to login/logout programmatically
- Mock GitHub OAuth flow for testing

**FR-2.2: Role-Based Testing**
- Admin user fixture (full permissions)
- Contributor user fixture (can submit, limited admin)
- Viewer user fixture (read-only)
- Unauthenticated user fixture

**FR-2.3: Protected Route Testing**
- Verify admin routes redirect unauthenticated users
- Test permission-based access controls
- Validate session expiration handling

#### 3. Core User Journey Testing

**FR-3.1: Public User Flows**
- Browse content by type (recipes, videos, libraries, etc.)
- Search for content
- View individual content pages
- Filter and paginate content
- Save/bookmark content (authenticated)
- View user profiles

**FR-3.2: Content Submission Flow**
- Submit new content (all types)
- Upload metadata for libraries
- Import YouTube videos
- Import GitHub repositories
- Validate form errors and validation
- Confirm submission success

**FR-3.3: Admin Workflows**
- Content moderation (approve/reject/archive)
- Content editing and publishing
- User management (roles, permissions)
- Tag management (create, edit, delete)
- Bulk import operations
- Announcement management

#### 4. Page Object Models (POMs)

**FR-4.1: Structure**
- Create POMs for major page types:
  - `HomePage`
  - `ContentListPage` (generic for all types)
  - `ContentDetailPage`
  - `SubmitPage`
  - `LoginPage`
  - `AdminDashboard`
  - `ModerationQueuePage`
  - `ContentManagementPage`

**FR-4.2: POM Guidelines**
- Encapsulate selectors and page interactions
- Provide semantic methods (e.g., `searchForContent()`, `submitRecipe()`)
- Return other POMs for navigation (e.g., `clickLogin()` returns `LoginPage`)
- Include wait strategies and assertions within POMs

#### 5. Test Organization

**FR-5.1: Directory Structure**
```
tests/
├── fixtures/           # Custom fixtures (auth, db, etc.)
├── pages/              # Page Object Models
├── helpers/            # Utility functions
├── e2e/                # End-to-end test suites
│   ├── public/         # Public user flows
│   ├── auth/           # Authentication flows
│   ├── admin/          # Admin workflows
│   ├── content/        # Content management
│   └── search/         # Search functionality
└── setup/              # Global setup/teardown
```

**FR-5.2: Test Naming**
- Descriptive test names: `should allow admin to publish pending content`
- Group related tests in `describe` blocks
- Tag tests with metadata: `@smoke`, `@critical`, `@slow`

#### 6. Configuration & Environment

**FR-6.1: Environment Configuration**
- Separate config for local development vs CI
- Support for different browsers (Chromium, Firefox, WebKit)
- Configurable timeouts and retry strategies
- Headless mode for CI, headed for local debugging

**FR-6.2: Environment Variables**
- Test-specific `.env.test` file
- Override `DB_PATH` to use `test.db`
- Mock/stub external API calls (YouTube, GitHub)
- Disable analytics and tracking in tests

**FR-6.3: Reporter Configuration**
- HTML reporter for local debugging
- GitHub Actions reporter for CI
- Screenshot/video capture on failure
- Trace files for debugging flaky tests

### Non-Functional Requirements

**NFR-1: Performance**
- Individual tests complete in <30 seconds
- Full suite runs in <10 minutes
- Startup/teardown optimized (shared database context where safe)

**NFR-2: Reliability**
- <5% flaky test rate
- Automatic retries for network-dependent tests (max 2 retries)
- Clear error messages and debugging information

**NFR-3: Maintainability**
- POMs reduce duplication across tests
- Clear separation of concerns (fixtures, helpers, tests)
- Tests are self-documenting and easy to understand

**NFR-4: CI/CD Integration**
- Run on every PR and merge to staging/main
- Fail fast on critical test failures
- Parallel execution where possible (with worker limit)
- Cache dependencies and build artifacts

**NFR-5: Developer Experience**
- Easy to run locally with single command (`bun test:integration`)
- VS Code Playwright extension support
- Clear documentation and examples
- Watch mode for rapid test development

---

## Technical Implementation Plan

### Phase 1a: Database Foundation (Days 1-2) ✅ COMPLETED

**Goal:** Get test database initialization working independently of Playwright

**Tasks:**
1. ✅ Create `scripts/test-db-init.ts`
   - Reads and executes initial schema migration
   - Runs all pending migrations from `src/lib/server/db/migrations/`
   - Creates test database at `test.db`

2. ✅ Add `db:test:init` script to `package.json`
   ```json
   "db:test:init": "NODE_ENV=test bun run scripts/test-db-init.ts"
   ```

3. ✅ Test the script manually
   ```bash
   bun run db:test:init
   ```

**Acceptance Criteria:**
- [x] `bun run db:test:init` creates `test.db` with complete schema
- [x] All tables, views, and triggers are present
- [x] Script is idempotent (can run multiple times safely)
- [x] Script clears existing test.db if present

**Completed:** 2025-10-22

---

### Phase 1b: Test Data Seeding (Days 2-3) ✅ COMPLETED

**Goal:** Seed minimal test data for E2E tests

**Tasks:**
1. ✅ Create `scripts/test-db-seed.ts`
   - Creates 3 test users:
     - Admin user (all permissions)
     - Contributor user (moderator role)
     - Viewer user (member role)
   - Creates test roles and assigns to users
   - Seeds 5 sample content items for valid types (`recipe`, `video`, `library`, `announcement`, `collection`)
   - Seeds 10 common tags
   - Creates sessions for test users with proper expiry

2. ✅ Add `db:test:seed` script to `package.json`
   ```json
   "db:test:seed": "NODE_ENV=test bun run scripts/test-db-seed.ts"
   ```

3. ✅ Document test user credentials
   - Created `tests/README.md` with user credentials and roles
   - Test data fixtures in `tests/fixtures/test-data.ts`

**Acceptance Criteria:**
- [x] `bun run db:test:seed` populates test.db with sample data
- [x] Test users are created with correct roles (admin, moderator, member)
- [x] Sample content exists for all valid content types
- [x] Script can be run multiple times (clears before seeding)
- [x] Test credentials are documented

**Completed:** 2025-10-22

**Notes:**
- Removed invalid content types (`blog`, `link`, `event`) from test data
- Fixed collection children to be stored as JSON in the `children` TEXT column

---

### Phase 1c: Playwright Configuration Update (Day 3) ✅ COMPLETED

**Goal:** Configure Playwright for test environment

**Tasks:**
1. ✅ Update `playwright.config.ts`
   - Set `webServer.env.DB_PATH = 'test.db'`
   - Set `webServer.env.NODE_ENV = 'test'`
   - Configure retry strategy (`retries: process.env.CI ? 2 : 0`)
   - Set workers to 1 (sequential execution for DB safety)
   - Add screenshot/video on failure
   - Configure reporters (HTML + list)

2. ✅ Create `.env.test` file
   ```bash
   NODE_ENV=test
   DB_PATH=test.db
   SEED_DATABASE=none
   GITHUB_CLIENT_ID=test_client
   GITHUB_CLIENT_SECRET=test_secret
   ```

3. ✅ Update `test:integration` script in `package.json`
   ```json
   "test:integration": "bun run db:test:init && bun run db:test:seed && bun --bun --env-file=.env.test run build && playwright test"
   ```

**Acceptance Criteria:**
- [x] Playwright config uses test.db
- [x] Environment variables are properly set
- [x] `bun run test:integration` executes full pipeline
- [x] Test artifacts (screenshots, videos, traces) are saved on failure

**Completed:** 2025-10-22

---

### Phase 1d: First Passing Test (Day 4) ✅ COMPLETED

**Goal:** Get the existing test passing with the new setup

**Tasks:**
1. ✅ Rename `tests/test.ts` to `tests/test.spec.ts` for consistency
   - Run `bun run test:integration`
   - Verify homepage loads
   - Test passes successfully

2. ✅ Fix critical TypeIcon component bug
   - Fixed `TypeError: Icon is not a function` blocking admin pages
   - Corrected IconMap to only use valid content types
   - Added proper TypeScript typing and fallback

3. ✅ Debug and fix issues
   - Fixed database path resolution
   - Added proper test database isolation
   - Fixed TypeIcon component preventing page loads

**Acceptance Criteria:**
- [x] `bun run test:integration` passes all tests
- [x] Test runs in <30 seconds
- [x] No database errors in logs
- [x] Test output is clear and readable
- [x] TypeIcon component fixed

**Completed:** 2025-10-22

**Notes:**
- Fixed critical TypeIcon bug that was causing `/admin/content` to fail
- All pages now load successfully in tests

---

### Phase 2a: Test Helpers & Utilities (Day 5) ✅ COMPLETED

**Goal:** Create reusable test utilities

**Tasks:**
1. ✅ Create `tests/helpers/db.ts`
   - Functions to query test database directly
   - Functions to insert test data on-the-fly
   - Functions to clear specific tables between tests
   - Fully documented with JSDoc comments

2. ✅ Create `tests/helpers/wait.ts`
   - Custom wait strategies for common scenarios

3. ✅ Create test directory structure
   ```
   tests/
   ├── fixtures/
   │   ├── auth.fixture.ts
   │   └── test-data.ts
   ├── helpers/
   │   ├── auth.ts
   │   ├── db.ts
   │   └── wait.ts
   ├── e2e/
   │   └── auth/
   │       ├── admin-login.spec.ts
   │       ├── simple-auth.spec.ts
   │       └── viewer.spec.ts
   └── test.spec.ts
   ```

**Acceptance Criteria:**
- [x] Helper functions work correctly
- [x] Directory structure is created
- [x] Helpers are documented with JSDoc comments

**Completed:** 2025-10-22

---

### Phase 2b: Authentication Fixtures - Cookie-Based (Days 6-7) ✅ COMPLETED

**Goal:** Create pre-authenticated browser contexts

**Tasks:**
1. ✅ Create `tests/helpers/auth.ts`
   - Function to login by setting session cookies directly
   - Bypasses GitHub OAuth for tests
   - Functions: `loginAs()`, `logout()`, `isLoggedIn()`

2. ✅ Create `tests/fixtures/auth.fixture.ts`
   - Export fixtures for each user role
   - Extends base Playwright test with `authenticatedAs` parameter
   - Automatically logs in before tests using the specified role

3. ✅ Create authentication tests
   - `tests/e2e/auth/simple-auth.spec.ts` - Basic unauthenticated tests
   - `tests/e2e/auth/admin-login.spec.ts` - Admin authentication tests
   - `tests/e2e/auth/viewer.spec.ts` - Viewer authentication tests

**Acceptance Criteria:**
- [x] Auth fixtures can be imported and used
- [x] Tests using fixtures are authenticated
- [x] Manual login helper works without OAuth
- [x] Session cookies are properly set

**Completed:** 2025-10-22

**Notes:**
- Used cookie-based authentication instead of storage state for simpler setup
- Session cookies set directly from test database session tokens
- All authentication tests passing

---

### Phase 2c: Base Page Object Model (Day 8) ✅ COMPLETED

**Goal:** Create foundation for POMs

**Tasks:**
1. ✅ Create `tests/pages/BasePage.ts`
   - Constructor accepting `Page` object
   - Common methods: `goto()`, `waitForLoad()`, `getTitle()`, `getCurrentUrl()`
   - Common selectors: header, footer, navigation, loginLink, userMenu
   - Common actions: `isLoggedIn()`, `clickLogin()`, `goHome()`, `reload()`
   - Fully documented with JSDoc comments

2. ✅ Create `tests/pages/HomePage.ts` extending `BasePage`
   - Selectors for home page elements (navigation links, search)
   - Methods: `search()`, `navigateToContentType()`, `navigateToRecipes()`, etc.
   - Assertions: `expectHomeLoaded()`, `hasSearch()`

3. ✅ Update existing test to use HomePage POM
   - Refactored `tests/test.spec.ts` to use `HomePage` class

4. ✅ Create index file for clean imports
   - `tests/pages/index.ts` exports all POMs

**Acceptance Criteria:**
- [x] `BasePage` class is functional
- [x] `HomePage` extends `BasePage`
- [x] Existing test uses HomePage POM
- [x] All 9 tests still pass

**Completed:** 2025-10-22

**Notes:**
- BasePage includes comprehensive common functionality for all pages
- HomePage provides semantic methods for navigation
- Tests are now more readable and maintainable

---

### Phase 3a: Public Content Browsing Tests (Days 9-10)

**Goal:** Test content browsing without authentication

**Tasks:**
1. Create `tests/e2e/public/browse-content.spec.ts`
   - Test browsing recipes, videos, libraries
   - Test filtering by type
   - Test pagination (if >10 items)

2. Create `tests/pages/ContentListPage.ts`
   - Selectors for content cards, filters, pagination
   - Methods: `filterByType()`, `getContentItems()`, `goToPage()`

3. Add 3-5 tests
   - Can view all content types
   - Can filter content
   - Can paginate through results

**Acceptance Criteria:**
- [ ] 3-5 tests for browsing content pass
- [ ] `ContentListPage` POM is reusable
- [ ] Tests run in <1 minute total

**Estimated Time:** 5-6 hours

---

### Phase 3b: Content Detail View Tests (Day 11)

**Goal:** Test individual content pages

**Tasks:**
1. Create `tests/e2e/public/content-detail.spec.ts`
   - Test viewing recipe details
   - Test viewing video details
   - Test viewing library details

2. Create `tests/pages/ContentDetailPage.ts`
   - Selectors for title, description, body, tags
   - Methods: `getTitle()`, `getTags()`, `isSaved()`

3. Add 3-4 tests
   - Content title is displayed
   - Content body is visible
   - Tags are shown
   - Author info is present

**Acceptance Criteria:**
- [ ] 3-4 tests for content detail pages pass
- [ ] `ContentDetailPage` POM works for all content types
- [ ] Tests verify key elements are visible

**Estimated Time:** 4-5 hours

---

### Phase 3c: Search Functionality Tests (Day 12)

**Goal:** Test search feature

**Tasks:**
1. Create `tests/e2e/public/search.spec.ts`
   - Test searching for content by title
   - Test searching by tag
   - Test empty search results

2. Create `tests/pages/SearchPage.ts` (or add to `HomePage`)
   - Selector for search input
   - Method: `search(query)`, `getResults()`

3. Add 3-4 tests
   - Search returns relevant results
   - Search handles no results gracefully
   - Search works with special characters

**Acceptance Criteria:**
- [ ] 3-4 search tests pass
- [ ] Search input and results are properly selected
- [ ] Tests verify search accuracy

**Estimated Time:** 4-5 hours

---

### Phase 4a: Authentication Flow Tests (Days 13-14)

**Goal:** Test login/logout flows

**Tasks:**
1. Create `tests/e2e/auth/login.spec.ts`
   - Test unauthenticated user sees login button
   - Test clicking login redirects to GitHub OAuth
   - Test authenticated user sees profile menu
   - Test logout flow

2. Mock GitHub OAuth callback (optional)
   - Use route interception to mock OAuth response
   - Or rely on manual session creation helper

3. Add 3-4 tests
   - Unauthenticated state is correct
   - Login redirects to OAuth (or use shortcut)
   - Authenticated state shows user info
   - Logout clears session

**Acceptance Criteria:**
- [ ] 3-4 auth flow tests pass
- [ ] Login/logout is tested
- [ ] Tests use auth helper or storage state

**Estimated Time:** 6-7 hours

---

### Phase 4b: Protected Routes Tests (Day 15)

**Goal:** Test role-based access control

**Tasks:**
1. Create `tests/e2e/auth/protected-routes.spec.ts`
   - Test unauthenticated user redirected from admin routes
   - Test contributor can't access admin-only pages
   - Test admin can access all admin routes

2. Use auth fixtures from Phase 2b

3. Add 4-5 tests
   - `/admin` redirects unauthenticated users
   - Contributor role is denied admin access
   - Admin role can access moderation queue
   - Viewer can't submit content

**Acceptance Criteria:**
- [ ] 4-5 protected route tests pass
- [ ] All user roles are tested
- [ ] Redirects are verified

**Estimated Time:** 4-5 hours

---

### Phase 5a: Content Submission Tests - Basic (Days 16-17)

**Goal:** Test basic content submission flow

**Tasks:**
1. Create `tests/e2e/content/submit-recipe.spec.ts`
   - Test submitting a new recipe
   - Test form validation (required fields)
   - Test successful submission message

2. Create `tests/pages/SubmitPage.ts`
   - Selectors for form fields, submit button
   - Methods: `selectContentType()`, `fillRecipeForm()`, `submit()`

3. Add 3-4 tests
   - Can submit valid recipe
   - Required fields are validated
   - Success message is shown
   - Content appears in moderation queue

**Acceptance Criteria:**
- [ ] 3-4 submission tests pass
- [ ] Form validation is tested
- [ ] Submitted content is in database

**Estimated Time:** 6-7 hours

---

### Phase 5b: Content Submission Tests - All Types (Days 18-19)

**Goal:** Extend submission tests to all content types

**Tasks:**
1. Create submission tests for each type
   - `submit-video.spec.ts`
   - `submit-library.spec.ts`
   - `submit-blog.spec.ts`
   - `submit-link.spec.ts`

2. Extend `SubmitPage` POM
   - Methods for each content type form
   - Shared validation logic

3. Add 8-10 tests (2 per type)
   - Basic submission for each type
   - Validation for each type

**Acceptance Criteria:**
- [ ] 8-10 tests cover all content types
- [ ] Each content type can be submitted
- [ ] Form-specific validation works

**Estimated Time:** 8-10 hours

---

### Phase 6a: Admin - Content Moderation Tests (Days 20-21)

**Goal:** Test admin moderation queue

**Tasks:**
1. Create `tests/e2e/admin/moderation.spec.ts`
   - Test viewing moderation queue
   - Test approving pending content
   - Test rejecting content
   - Test publishing content

2. Create `tests/pages/ModerationQueuePage.ts`
   - Selectors for queue items, action buttons
   - Methods: `getQueueItems()`, `approveContent()`, `rejectContent()`

3. Add 4-5 tests
   - Pending content appears in queue
   - Admin can approve content
   - Admin can reject content
   - Approved content is published

**Acceptance Criteria:**
- [ ] 4-5 moderation tests pass
- [ ] All moderation actions work
- [ ] Content status updates correctly

**Estimated Time:** 6-7 hours

---

### Phase 6b: Admin - Content Management Tests (Day 22)

**Goal:** Test editing and archiving content

**Tasks:**
1. Create `tests/e2e/admin/content-management.spec.ts`
   - Test editing published content
   - Test archiving content
   - Test unarchiving content

2. Create `tests/pages/ContentEditPage.ts`
   - Selectors for edit form, status dropdown
   - Methods: `editContent()`, `archiveContent()`

3. Add 3-4 tests
   - Admin can edit content
   - Content can be archived
   - Archived content can be restored
   - Status transitions work correctly

**Acceptance Criteria:**
- [ ] 3-4 content management tests pass
- [ ] Editing, archiving tested
- [ ] Status changes are verified

**Estimated Time:** 5-6 hours

---

### Phase 6c: Admin - User & Role Management Tests (Day 23)

**Goal:** Test user and role management

**Tasks:**
1. Create `tests/e2e/admin/user-management.spec.ts`
   - Test viewing users list
   - Test assigning roles
   - Test changing user permissions

2. Create `tests/pages/UserManagementPage.ts`
   - Selectors for user table, role dropdown
   - Methods: `getUserList()`, `assignRole()`

3. Add 3-4 tests
   - Users are listed correctly
   - Roles can be assigned
   - Permission changes take effect

**Acceptance Criteria:**
- [ ] 3-4 user management tests pass
- [ ] Role assignment works
- [ ] Tests verify permissions update

**Estimated Time:** 5-6 hours

---

### Phase 7a: CI/CD Integration (Day 24)

**Goal:** Get tests running in GitHub Actions

**Tasks:**
1. Create `.github/workflows/playwright.yml`
   - Install dependencies
   - Run `db:test:init` and `db:test:seed`
   - Run `playwright test`
   - Upload test artifacts (screenshots, videos, HTML report)

2. Configure workflow triggers
   - Run on PRs to `main` and `staging`
   - Run on push to `staging`

3. Test workflow
   - Open a test PR
   - Verify tests run successfully
   - Check artifact upload

**Acceptance Criteria:**
- [ ] GitHub Actions workflow is created
- [ ] Tests run on PRs
- [ ] Artifacts are uploaded on failure
- [ ] Workflow completes in <10 minutes

**Estimated Time:** 4-5 hours

---

### Phase 7b: Test Optimization (Days 25-26)

**Goal:** Improve test speed and reliability

**Tasks:**
1. Identify slow tests
   - Run with `--reporter=html` to see timing
   - Optimize database queries in setup/teardown

2. Reduce database reinitialization
   - Only reinit when schema changes
   - Use transactions for test isolation (if possible)

3. Add explicit waits where needed
   - Replace `page.waitForTimeout()` with `waitForSelector()`
   - Use `waitForLoadState('networkidle')` judiciously

4. Add test retries for flaky tests
   - Mark network-dependent tests with retry annotation

**Acceptance Criteria:**
- [ ] Test suite runs in <8 minutes
- [ ] No tests exceed 30 seconds
- [ ] Flaky test rate is <5%

**Estimated Time:** 6-8 hours

---

### Phase 7c: Documentation (Day 27)

**Goal:** Document the E2E testing setup

**Tasks:**
1. Update `tests/README.md`
   - Document test structure
   - Explain how to run tests locally
   - List test user credentials
   - Provide troubleshooting guide

2. Add JSDoc comments to all POMs and helpers

3. Create `docs/TESTING_GUIDE.md`
   - Best practices for writing E2E tests
   - POM pattern explanation
   - How to add new test suites
   - CI/CD integration guide

4. Update main `README.md`
   - Add testing section
   - Link to testing guide

**Acceptance Criteria:**
- [ ] `tests/README.md` is comprehensive
- [ ] All POMs have JSDoc comments
- [ ] `TESTING_GUIDE.md` exists and is helpful
- [ ] Main README references testing

**Estimated Time:** 4-5 hours

---

### Phase 8: Expanded Coverage (Days 28-30+)

**Goal:** Reach 80%+ journey coverage

**Tasks:**
1. Add tests for remaining journeys
   - External content imports (YouTube, GitHub)
   - Tag management
   - Collection management
   - Event management
   - User profiles and saved content
   - Bulk import

2. Add cross-browser testing
   - Enable Firefox and WebKit projects in config
   - Fix browser-specific issues

3. Add mobile viewport testing
   - Test responsive behavior on key pages

4. Continuous refinement
   - Add tests for new features as they're developed
   - Refactor POMs as needed
   - Address flaky tests
   - Improve test data management

**Acceptance Criteria:**
- [ ] 60+ total tests covering all critical journeys
- [ ] Tests pass on Chromium, Firefox, WebKit
- [ ] Mobile viewport tests exist for key pages
- [ ] Coverage map is updated

**Estimated Time:** Ongoing

---

## Test Coverage Map

### Priority 1: Critical Paths (Must Have)

| Journey | Tests | Priority | Complexity |
|---------|-------|----------|------------|
| User can browse published content | 5 | P0 | Low |
| User can search for content | 3 | P0 | Medium |
| User can view content details | 5 | P0 | Low |
| User can submit new content (all types) | 8 | P0 | High |
| Admin can moderate content | 6 | P0 | Medium |
| Admin can publish/archive content | 4 | P0 | Medium |
| User can login via GitHub OAuth | 2 | P0 | High |
| User can save/bookmark content | 3 | P0 | Low |

### Priority 2: Important Flows (Should Have)

| Journey | Tests | Priority | Complexity |
|---------|-------|----------|------------|
| Admin can manage users and roles | 5 | P1 | Medium |
| User can filter content by tags | 3 | P1 | Low |
| Admin can manage tags | 4 | P1 | Low |
| User can view profiles | 2 | P1 | Low |
| Admin can bulk import content | 3 | P1 | Medium |
| External content imports (YouTube/GitHub) | 4 | P1 | High |
| Content pagination works correctly | 2 | P1 | Low |

### Priority 3: Edge Cases (Nice to Have)

| Journey | Tests | Priority | Complexity |
|---------|-------|----------|------------|
| Session expiration handling | 2 | P2 | Medium |
| Concurrent content editing | 2 | P2 | High |
| Large dataset performance | 2 | P2 | Medium |
| Mobile responsive behavior | 3 | P2 | Low |
| Browser compatibility edge cases | 3 | P2 | Low |

---

## Configuration Details

### playwright.config.ts (Proposed)

```typescript
import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test suite timeout
  globalTimeout: 10 * 60 * 1000, // 10 minutes

  expect: {
    timeout: 5000
  },

  // Run tests in files in parallel
  fullyParallel: false, // Database concerns

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers to prevent database conflicts
  workers: process.env.CI ? 1 : 1, // Sequential for DB safety

  // Reporter configuration
  reporter: process.env.CI
    ? [['html'], ['github'], ['list']]
    : [['html'], ['list']],

  use: {
    // Base URL
    baseURL: 'http://localhost:4173',

    // Collect trace when retrying the failed test
    trace: 'retain-on-failure',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Storage state for authenticated tests
        storageState: undefined // Override in fixtures
      },
    },

    // Uncomment for multi-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run local server before starting tests
  webServer: {
    command: 'NODE_ENV=test bun run build && bun run preview',
    port: 4173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    env: {
      DB_PATH: 'test.db',
      NODE_ENV: 'test',
    }
  },

  // Global setup
  globalSetup: './tests/setup/global-setup.ts',
  globalTeardown: './tests/setup/global-teardown.ts',
}

export default config
```

### Environment Variables (.env.test)

```bash
# Test environment configuration
NODE_ENV=test
DB_PATH=test.db

# Mock OAuth (or test credentials)
GITHUB_CLIENT_ID=test_client_id
GITHUB_CLIENT_SECRET=test_client_secret
GITHUB_AUTHORIZATION_CALLBACK_URL=http://localhost:4173/auth/callback

# Disable external services
YOUTUBE_API_KEY=mock_youtube_key
GITHUB_TOKEN=mock_github_token

# Disable seeding (controlled by tests)
SEED_DATABASE=none

# Disable analytics
PUBLIC_PLAUSIBLE_SHARED_LINK_AUTH=
```

### Package.json Scripts (Updated)

```json
{
  "scripts": {
    "db:test:init": "NODE_ENV=test bun run scripts/test-db-init.ts",
    "db:test:seed": "NODE_ENV=test bun run scripts/test-db-seed.ts",
    "test:integration": "bun run db:test:init && bun run db:test:seed && bun run build && playwright test",
    "test:integration:ui": "bun run db:test:init && bun run db:test:seed && bun run build && playwright test --ui",
    "test:integration:headed": "bun run db:test:init && bun run db:test:seed && bun run build && playwright test --headed",
    "test:integration:debug": "bun run db:test:init && bun run db:test:seed && bun run build && playwright test --debug"
  }
}
```

---

## Risk Assessment

### High Risks

**R1: Database State Management**
- **Risk:** Tests interfere with each other, causing flakiness
- **Mitigation:**
  - Run tests sequentially (workers: 1)
  - Clear database between test files
  - Use transactions where possible for isolation

**R2: External API Dependencies**
- **Risk:** YouTube/GitHub API calls make tests slow and unreliable
- **Mitigation:**
  - Mock external APIs using Playwright's route interception
  - Use fixtures with pre-recorded responses
  - Test external integrations separately with dedicated mocks

**R3: OAuth Flow Complexity**
- **Risk:** Difficult to test GitHub OAuth without real credentials
- **Mitigation:**
  - Create API-based authentication shortcut for tests
  - Use storage state to bypass OAuth in most tests
  - Mock OAuth provider responses

### Medium Risks

**R4: Test Maintenance Burden**
- **Risk:** Tests become outdated as features evolve
- **Mitigation:**
  - Use POMs to centralize page interactions
  - Write tests alongside feature development
  - Regular test review and refactoring

**R5: CI/CD Performance**
- **Risk:** Tests take too long, slowing down development
- **Mitigation:**
  - Optimize test suite structure
  - Run smoke tests first (fail fast)
  - Parallelize where safe
  - Cache build artifacts

### Low Risks

**R6: Browser Compatibility**
- **Risk:** Tests pass on Chromium but fail on Firefox/WebKit
- **Mitigation:**
  - Start with Chromium only
  - Add Firefox/WebKit in Phase 4
  - Use Playwright's cross-browser abstractions

---

## Success Criteria & Acceptance

### Phase 1 Acceptance (Foundation)
- [ ] Test database initializes correctly
- [ ] Authentication fixtures create users and sessions
- [ ] Playwright config supports local and CI environments
- [ ] 5+ smoke tests pass consistently
- [ ] Tests run in CI pipeline

### Phase 2 Acceptance (Core Journeys)
- [ ] All public user flows tested (browse, search, view)
- [ ] Content submission tested for all types
- [ ] 20+ tests passing with <5% flakiness
- [ ] POMs established for major pages

### Phase 3 Acceptance (Admin Workflows)
- [ ] Admin authentication and authorization tested
- [ ] Content moderation fully covered
- [ ] User/role management tested
- [ ] 40+ total tests passing

### Phase 4 Acceptance (Production Ready)
- [ ] Full suite runs in <10 minutes
- [ ] <5% flaky test rate
- [ ] Documentation complete
- [ ] 80%+ coverage of critical journeys
- [ ] Team trained and comfortable writing tests

---

## Open Questions

1. **Q:** Should we run E2E tests on every commit or only on PRs?
   - **A:** Start with PR-only to optimize CI time, then evaluate after Phase 4

2. **Q:** How do we handle visual regression testing?
   - **A:** Out of scope for initial implementation; consider Percy or Playwright screenshots in future

3. **Q:** Should we test mobile responsive behavior?
   - **A:** Priority 3 (P2); add viewport configurations in Phase 4 if time permits

4. **Q:** How do we test email notifications or background jobs?
   - **A:** Out of scope for E2E; consider separate integration tests or manual verification

5. **Q:** What's our strategy for testing in production-like environments?
   - **A:** Phase 4 should include staging environment testing with real data (read-only)

---

## Appendix

### Example Test Structure

```typescript
// tests/e2e/content/submit-recipe.spec.ts
import { test, expect } from '@playwright/test'
import { SubmitPage } from '../../pages/SubmitPage'
import { authenticatedUser } from '../../fixtures/auth.fixture'

test.describe('Submit Recipe Flow', () => {
  test.use(authenticatedUser)

  test('should successfully submit a new recipe', async ({ page }) => {
    const submitPage = new SubmitPage(page)
    await submitPage.goto()

    await submitPage.selectContentType('recipe')
    await submitPage.fillRecipeForm({
      title: 'Test Recipe',
      description: 'A test recipe description',
      body: 'Recipe content here...',
      tags: ['svelte', 'testing']
    })

    await submitPage.submit()
    await expect(page).toHaveURL(/\/submit\/thankyou/)
    await expect(page.locator('h1')).toContainText('Thank you')
  })

  test('should validate required fields', async ({ page }) => {
    const submitPage = new SubmitPage(page)
    await submitPage.goto()

    await submitPage.selectContentType('recipe')
    await submitPage.submit()

    await expect(submitPage.titleError).toBeVisible()
    await expect(submitPage.descriptionError).toBeVisible()
  })
})
```

### Recommended VS Code Extensions

- **Playwright Test for VSCode** - Run and debug tests directly in editor
- **Test Explorer UI** - Visualize test structure

### Further Reading

- [Playwright Documentation](https://playwright.dev/)
- [SvelteKit Testing Guide](https://kit.svelte.dev/docs/testing)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

**Document History:**
- v1.0 (2025-10-21): Initial PRD draft
