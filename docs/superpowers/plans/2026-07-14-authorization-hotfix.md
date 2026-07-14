# Authorization Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every admin Remote Function authorize the authenticated user and active role directly at the server boundary, independent of request-path headers.

**Architecture:** A pure role assertion owns 401/403 semantics and a server-only request adapter reads `getRequestEvent()`. Every admin query and form calls the adapter before accessing a service, while route hooks remain navigation UX and defense in depth.

**Tech Stack:** SvelteKit 2 Remote Functions, Svelte 5, TypeScript, Bun test, Playwright

## Global Constraints

- Deliver authorization before the XSS hotfix so it remains independently deployable.
- Preserve the approved role matrix exactly: admin-only for users, sponsors, and newsletter; admin/moderator for tags, announcements, feed builder, shortcuts, external content, and bulk import; admin/moderator/editor for content.
- Return HTTP 401 for no authenticated user and HTTP 403 for a missing, inactive, or disallowed role.
- Do not rely on `event.url`, `event.route`, `event.params`, or `x-sveltekit-pathname` for Remote Function authorization.
- The authorization call must be the first statement inside every protected Remote Function callback.
- Do not perform a production mutation during verification.
- Do not include broad dependency upgrades, unrelated refactors, or type-backlog cleanup.

---

## File Structure

- `src/routes/(admin)/admin/authorization.ts`: pure role constants and 401/403 assertion, with no request-global dependency.
- `src/routes/(admin)/admin/authorization.server.ts`: synchronous `getRequestEvent()` adapter used by Remote Functions.
- `src/routes/(admin)/admin/authorization.test.ts`: fast role-matrix and error-semantics tests.
- `src/routes/(admin)/admin/**/**.remote.ts`: protected admin reads and mutations, migrated to `requireRoles`.
- `src/hooks/protect_routes.ts`: navigation policy aligned to the same role matrix.
- `tests/e2e/auth/remote-authorization.spec.ts`: generated HTTP endpoint regressions for unauthenticated read and mutation attempts.

### Task 1: Add the synchronous authorization boundary

**Files:**

- Create: `src/routes/(admin)/admin/authorization.ts`
- Create: `src/routes/(admin)/admin/authorization.server.ts`
- Create: `src/routes/(admin)/admin/authorization.test.ts`
- Delete: `src/routes/(admin)/admin/authorization.remote.ts`

**Interfaces:**

- Consumes: `App.Locals.user`, `App.Locals.roleService.getRoleById(number)`, and SvelteKit `error(status, message)`.
- Produces: `AdminRole`, `ADMIN_ONLY`, `ADMIN_AND_MODERATOR`, `CONTENT_MANAGERS`, `assertRoles(user, role, allowedRoles): void`, and `requireRoles(allowedRoles): void`.

- [ ] **Step 1: Write the failing pure authorization tests**

```ts
import { describe, expect, test } from 'bun:test'
import { ADMIN_AND_MODERATOR, ADMIN_ONLY, CONTENT_MANAGERS, assertRoles } from './authorization'

const user = { role: 1 }
const role = (value: string, active = true) => ({ value, active })

function expectStatus(run: () => void, status: number) {
	try {
		run()
		throw new Error('Expected authorization to fail')
	} catch (cause) {
		expect(cause).toMatchObject({ status })
	}
}

describe('assertRoles', () => {
	test('returns 401 without an authenticated user', () => {
		expectStatus(() => assertRoles(null, undefined, ADMIN_ONLY), 401)
	})

	test.each([
		[undefined, ADMIN_ONLY],
		[role('admin', false), ADMIN_ONLY],
		[role('member'), CONTENT_MANAGERS],
		[role('moderator'), ADMIN_ONLY],
		[role('editor'), ADMIN_AND_MODERATOR]
	])('returns 403 for a missing, inactive, or disallowed role', (currentRole, allowed) => {
		expectStatus(() => assertRoles(user, currentRole, allowed), 403)
	})

	test.each([
		['admin', ADMIN_ONLY],
		['admin', ADMIN_AND_MODERATOR],
		['moderator', ADMIN_AND_MODERATOR],
		['admin', CONTENT_MANAGERS],
		['moderator', CONTENT_MANAGERS],
		['editor', CONTENT_MANAGERS]
	])('allows %s in its approved permission class', (value, allowed) => {
		expect(() => assertRoles(user, role(value), allowed)).not.toThrow()
	})
})
```

- [ ] **Step 2: Run the test and verify it fails because the module does not exist**

Run:

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test 'src/routes/(admin)/admin/authorization.test.ts'
```

Expected: FAIL with `Cannot find module './authorization'`.

- [ ] **Step 3: Implement the pure assertion and synchronous request adapter**

```ts
// authorization.ts
import { error } from '@sveltejs/kit'
import type { Role } from '$lib/server/services/role'

export type AdminRole = 'admin' | 'moderator' | 'editor'
export const ADMIN_ONLY = ['admin'] as const satisfies readonly AdminRole[]
export const ADMIN_AND_MODERATOR = ['admin', 'moderator'] as const satisfies readonly AdminRole[]
export const CONTENT_MANAGERS = [
	'admin',
	'moderator',
	'editor'
] as const satisfies readonly AdminRole[]

type AuthenticatedUser = { role: number }
type AuthorizationRole = Pick<Role, 'active' | 'value'>

export function assertRoles(
	user: AuthenticatedUser | null,
	role: AuthorizationRole | undefined,
	allowedRoles: readonly AdminRole[]
): void {
	if (!user) error(401, 'Authentication required')
	if (!role?.active || !allowedRoles.includes(role.value as AdminRole)) {
		error(403, 'Insufficient permissions')
	}
}
```

```ts
// authorization.server.ts
import { getRequestEvent } from '$app/server'
import {
	ADMIN_AND_MODERATOR,
	ADMIN_ONLY,
	CONTENT_MANAGERS,
	assertRoles,
	type AdminRole
} from './authorization'

export { ADMIN_AND_MODERATOR, ADMIN_ONLY, CONTENT_MANAGERS }

export function requireRoles(allowedRoles: readonly AdminRole[]): void {
	const { locals } = getRequestEvent()
	const role = locals.user ? locals.roleService.getRoleById(locals.user.role) : undefined
	assertRoles(locals.user, role, allowedRoles)
}
```

Delete `authorization.remote.ts`; no authorization helper may be a `query()` or `form()`.

- [ ] **Step 4: Run the pure tests and verify they pass**

Run the command from Step 2. Expected: all `assertRoles` tests PASS.

- [ ] **Step 5: Commit the authorization primitive**

```bash
rtk git add 'src/routes/(admin)/admin/authorization.ts' 'src/routes/(admin)/admin/authorization.server.ts' 'src/routes/(admin)/admin/authorization.test.ts' 'src/routes/(admin)/admin/authorization.remote.ts'
rtk git commit -m 'fix: add synchronous admin authorization guard'
```

### Task 2: Protect every admin Remote Function with its approved role class

**Files:**

- Create: `src/routes/(admin)/admin/authorization-coverage.test.ts`
- Modify: `src/routes/(admin)/admin/users/users.remote.ts`
- Modify: `src/routes/(admin)/admin/sponsors/data.remote.ts`
- Modify: `src/routes/(admin)/admin/newsletter/data.remote.ts`
- Modify: `src/routes/(admin)/admin/newsletter/[id]/data.remote.ts`
- Modify: `src/routes/(admin)/admin/tags/tags.remote.ts`
- Modify: `src/routes/(admin)/admin/announcements/announcements.remote.ts`
- Modify: `src/routes/(admin)/admin/feed-builder/data.remote.ts`
- Modify: `src/routes/(admin)/admin/shortcuts/shortcuts.remote.ts`
- Modify: `src/routes/(admin)/admin/external-content/external-content.remote.ts`
- Modify: `src/routes/(admin)/admin/bulk-import/bulk-import.remote.ts`
- Modify: `src/routes/(admin)/admin/content/data.remote.ts`
- Modify: `src/routes/(admin)/admin/content/content.remote.ts`

**Interfaces:**

- Consumes: `requireRoles(allowedRoles): void` and the three permission constants from Task 1.
- Produces: 65 protected Remote Functions whose callbacks reject before service/database access.

- [ ] **Step 1: Write a failing source-level security invariant test**

```ts
import { describe, expect, test } from 'bun:test'

const modules = [
	['users/users.remote.ts', 'ADMIN_ONLY'],
	['sponsors/data.remote.ts', 'ADMIN_ONLY'],
	['newsletter/data.remote.ts', 'ADMIN_ONLY'],
	['newsletter/[id]/data.remote.ts', 'ADMIN_ONLY'],
	['tags/tags.remote.ts', 'ADMIN_AND_MODERATOR'],
	['announcements/announcements.remote.ts', 'ADMIN_AND_MODERATOR'],
	['feed-builder/data.remote.ts', 'ADMIN_AND_MODERATOR'],
	['shortcuts/shortcuts.remote.ts', 'ADMIN_AND_MODERATOR'],
	['external-content/external-content.remote.ts', 'ADMIN_AND_MODERATOR'],
	['bulk-import/bulk-import.remote.ts', 'ADMIN_AND_MODERATOR'],
	['content/data.remote.ts', 'CONTENT_MANAGERS'],
	['content/content.remote.ts', 'CONTENT_MANAGERS']
] as const

describe('admin Remote Function authorization coverage', () => {
	for (const [relativePath, permission] of modules) {
		test(`${relativePath} guards every export with ${permission}`, async () => {
			const source = await Bun.file(new URL(relativePath, import.meta.url)).text()
			expect(source).not.toContain('checkAdminAuth')
			expect(source).not.toContain('authorization.remote')

			const exports = [...source.matchAll(/^export const \w+\s*=\s*(?:query|form)\(/gm)]
			expect(exports.length).toBeGreaterThan(0)

			for (const [index, exported] of exports.entries()) {
				const start = exported.index ?? 0
				const end = exports[index + 1]?.index ?? source.length
				const callback = source.slice(start, end)
				const bodyStart = callback.indexOf('=> {')
				expect(bodyStart).toBeGreaterThan(-1)
				expect(
					callback
						.slice(bodyStart + 4)
						.trimStart()
						.startsWith(`requireRoles(${permission})`)
				).toBe(true)
			}
		})
	}
})
```

- [ ] **Step 2: Run the invariant test and verify it fails on the vulnerable call sites**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test 'src/routes/(admin)/admin/authorization-coverage.test.ts'
```

Expected: FAIL because the modules still use `checkAdminAuth`; `content/data.remote.ts` also exposes an unguarded callback.

- [ ] **Step 3: Replace every old guard import and call using this exact module matrix**

| Modules                                                                                                                                                                                                            | Import and first callback statement                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `users/users.remote.ts`, `sponsors/data.remote.ts`, `newsletter/data.remote.ts`, `newsletter/[id]/data.remote.ts`                                                                                                  | `import { ADMIN_ONLY, requireRoles } from '../authorization.server'` (adjust `../` depth for nested newsletter); `requireRoles(ADMIN_ONLY)` |
| `tags/tags.remote.ts`, `announcements/announcements.remote.ts`, `feed-builder/data.remote.ts`, `shortcuts/shortcuts.remote.ts`, `external-content/external-content.remote.ts`, `bulk-import/bulk-import.remote.ts` | `import { ADMIN_AND_MODERATOR, requireRoles } from '../authorization.server'`; `requireRoles(ADMIN_AND_MODERATOR)`                          |
| `content/data.remote.ts`, `content/content.remote.ts`                                                                                                                                                              | `import { CONTENT_MANAGERS, requireRoles } from '../authorization.server'`; `requireRoles(CONTENT_MANAGERS)`                                |

Every callback must begin in this form, including `getFilteredContent`, which currently has no guard:

```ts
export const protectedRead = query(schema, (input) => {
	requireRoles(ALLOWED_ROLES)
	const { locals } = getRequestEvent()
	// existing implementation remains unchanged
})

export const protectedMutation = form(schema, async (data) => {
	requireRoles(ALLOWED_ROLES)
	const { locals } = getRequestEvent()
	// existing implementation remains unchanged
})
```

Nested `newsletter/[id]/data.remote.ts` imports from `../../authorization.server`; all other area modules import from `../authorization.server`.

- [ ] **Step 4: Prove the vulnerable helper and unguarded callbacks are gone**

Run:

```bash
rtk proxy rg -n 'checkAdminAuth|authorization\.remote' 'src/routes/(admin)/admin'
rtk proxy rg -L 'requireRoles\(' 'src/routes/(admin)/admin' -g '*.remote.ts'
```

Expected: both commands produce no file matches. Run the invariant test from Step 2 again; all 12 module cases must PASS, proving every exported `query` and `form` starts with the correct `requireRoles(...)` call.

- [ ] **Step 5: Run the authorization tests and repository unit suite**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test 'src/routes/(admin)/admin/authorization.test.ts'
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test src/ tests/unit/
```

Expected: authorization tests PASS and the existing unit suite has zero failures.

- [ ] **Step 6: Commit the Remote Function migration**

```bash
rtk git add 'src/routes/(admin)/admin'
rtk git commit -m 'fix: enforce roles in admin remote functions'
```

### Task 3: Align navigation policy and add HTTP regression coverage

**Files:**

- Modify: `src/hooks/protect_routes.ts`
- Modify: `scripts/test-db-seed.ts`
- Modify: `tests/fixtures/test-data.ts`
- Modify: `tests/pages/UserManagementPage.ts`
- Create: `tests/e2e/auth/remote-authorization.spec.ts`
- Modify: `tests/e2e/auth/protected-routes.spec.ts`
- Modify: `tests/helpers/auth.ts`

**Interfaces:**

- Consumes: generated Remote Function actions discovered through `UserManagementPage`, `loginAs`, and the isolated test database cookie.
- Produces: representative admin/moderator/editor navigation coverage plus HTTP regressions showing omitted/spoofed path headers cannot expose a read or execute a mutation.

- [ ] **Step 1: Add editor test support and expose the role form action through the existing POM**

Add an `editor` entry to `TEST_USERS` with ID `test_editor_001`, session token `test_session_editor_token`, and `roleValue: 'editor'`. Add the editor role lookup to the seed script:

```ts
const roles = {
	admin: db.prepare('SELECT id FROM roles WHERE value = ?').get('admin') as { id: number },
	moderator: db.prepare('SELECT id FROM roles WHERE value = ?').get('moderator') as { id: number },
	editor: db.prepare('SELECT id FROM roles WHERE value = ?').get('editor') as { id: number },
	member: db.prepare('SELECT id FROM roles WHERE value = ?').get('member') as { id: number }
}
```

Make `loginAs` accept every declared fixture key without duplicating the union:

```ts
export async function loginAs(page: Page, role: keyof typeof TEST_USERS): Promise<void> {
	// existing implementation
}
```

Add this interaction to `UserManagementPage` so the spec does not reach through page markup directly:

```ts
get roleForm(): Locator {
	return this.page.locator('form').filter({ has: this.roleSelect })
}

async getRoleFormAction(): Promise<string> {
	await expect(this.roleForm).toHaveCount(1)
	const action = await this.roleForm.getAttribute('action')
	if (!action) throw new Error('Role form is missing its Remote Function action')
	return action
}
```

- [ ] **Step 2: Write representative role-navigation regressions and verify the current hook fails**

Extend `protected-routes.spec.ts` with separate tests proving:

```ts
test('moderator can access an admin/moderator route', async ({ page }) => {
	await loginAs(page, 'contributor')
	const response = await page.goto('/admin/tags')
	expect(response?.status()).toBe(200)
	await expect(page).toHaveURL('/admin/tags')
})

test('editor can access a content-manager route', async ({ page }) => {
	await loginAs(page, 'editor')
	const response = await page.goto('/admin/content')
	expect(response?.status()).toBe(200)
	await expect(page).toHaveURL('/admin/content')
})

for (const path of ['/admin/sponsors', '/admin/newsletter']) {
	test(`moderator cannot access admin-only ${path}`, async ({ page }) => {
		await loginAs(page, 'contributor')
		await page.goto(path)
		await expect(page).toHaveURL('/')
	})
}

test('editor cannot access an admin/moderator route', async ({ page }) => {
	await loginAs(page, 'editor')
	await page.goto('/admin/tags')
	await expect(page).toHaveURL('/')
})
```

Also correct the existing test named `moderator role can access /admin dashboard` to call `loginAs(page, 'contributor')`; it currently authenticates as admin and does not exercise its stated role.

Run the protected-route spec serially. Expected RED: at least the sponsor/newsletter denial tests fail because those paths currently fall through to the `/admin` catch-all.

- [ ] **Step 3: Align explicit hook entries with the approved role matrix**

Keep the existing redirect behavior, but ensure explicit prefixes use these exact values:

```ts
const routePermissions = [
	{ path: '/admin/users', allowedRoles: ['admin'] },
	{ path: '/admin/sponsors', allowedRoles: ['admin'] },
	{ path: '/admin/newsletter', allowedRoles: ['admin'] },
	{ path: '/admin/tags', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/announcements', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/feed-builder', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/shortcuts', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/external-content', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/bulk-import', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/content', allowedRoles: ['admin', 'moderator', 'editor'] }
]
```

Preserve any unrelated explicit routes and keep the `/admin` catch-all.

- [ ] **Step 4: Write the HTTP boundary tests before relying on the implementation**

The Playwright spec must:

```ts
test('an unauthenticated read is rejected with omitted and spoofed path headers', async ({
	page,
	request
}) => {
	await loginAs(page, 'admin')
	await page.goto('/admin/users/test_viewer_001')
	const userPage = new UserManagementPage(page)
	const endpoints = await discoverUserRemotes(page, await userPage.getRoleFormAction())
	const isolatedDatabase = (await page.context().cookies()).find(
		(cookie) => cookie.name === 'test_db'
	)
	expect(isolatedDatabase).toBeTruthy()

	for (const headers of [{}, { 'x-sveltekit-pathname': '/' }]) {
		const url = new URL(endpoints.getUsers)
		url.searchParams.set('payload', encodeRemoteArgument({ page: 1, perPage: 1 }))
		const response = await request.get(url.href, {
			headers: {
				'content-type': 'application/json',
				cookie: `test_db=${isolatedDatabase!.value}`,
				...headers
			}
		})
		const body = await response.text()
		expect(response.status()).toBe(200)
		expect(JSON.parse(body)).toMatchObject({
			type: 'error',
			status: 401,
			error: { message: 'Authentication required' }
		})
		expect(body).not.toContain('newsletter_preference')
	}
})
```

```ts
test('an unauthenticated role mutation is rejected without changing the user', async ({
	page,
	request
}) => {
	await loginAs(page, 'admin')
	await page.goto('/admin/users/test_viewer_001')
	const before = await page.getByTestId('select-role').inputValue()
	const userPage = new UserManagementPage(page)
	const endpoints = await discoverUserRemotes(page, await userPage.getRoleFormAction())
	const isolatedDatabase = (await page.context().cookies()).find(
		(cookie) => cookie.name === 'test_db'
	)
	expect(isolatedDatabase).toBeTruthy()

	const response = await request.post(endpoints.updateUserRole.href, {
		form: { id: 'test_viewer_001', 'n:role': before === '1' ? '2' : '1' },
		headers: {
			origin: endpoints.updateUserRole.origin,
			cookie: `test_db=${isolatedDatabase!.value}`,
			'x-sveltekit-pathname': '/'
		}
	})
	expect(response.status()).toBe(200)
	expect(await response.json()).toMatchObject({
		type: 'error',
		status: 401,
		error: { message: 'Authentication required' }
	})

	await page.reload()
	await expect(page.getByTestId('select-role')).toHaveValue(before)
})
```

Implement `discoverUserRemotes` by parsing the POM-provided `?/remote=<module-id>/updateUserRole/...` action and constructing direct `/_app/remote/<module-id>/getUsers` and `updateUserRole` URLs. Encode query arguments with `Buffer.from(devalue.stringify(value), 'utf8').toString('base64url')`. The SvelteKit Remote Function transport intentionally returns outer HTTP 200 with an inner `{ type: 'error', status: 401 }` envelope; assert both layers. Use the standalone Playwright `request` fixture so the authenticated session cookie is not shared, but explicitly copy only the `test_db` cookie so the rejected mutation targets the same isolated database that is checked afterward. If protocol discovery fails, fail the test rather than skipping it. Do not post to the page-relative native action, because the route hook could create a false positive before the Remote Function guard executes.

- [ ] **Step 5: Run the focused tests serially**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin NODE_ENV=test /Users/kevin/.bun/bin/bun run db:test:init
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin NODE_ENV=test /Users/kevin/.bun/bin/bun run db:test:seed
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin node node_modules/@playwright/test/cli.js test tests/e2e/auth/remote-authorization.spec.ts tests/e2e/auth/protected-routes.spec.ts --workers=1
```

Expected: all security and existing protected-route tests PASS; no test is skipped.

- [ ] **Step 6: Run build and final static guard scan**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun run build
rtk proxy rg -n 'checkAdminAuth|authorization\.remote' src tests
```

Expected: build exits 0 and the scan has no matches.

- [ ] **Step 7: Commit the navigation and HTTP regressions**

```bash
rtk git add src/hooks/protect_routes.ts scripts/test-db-seed.ts tests/fixtures/test-data.ts tests/pages/UserManagementPage.ts tests/e2e/auth/remote-authorization.spec.ts tests/e2e/auth/protected-routes.spec.ts tests/helpers/auth.ts
rtk git commit -m 'test: cover admin remote authorization boundary'
```
