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
export const CONTENT_MANAGERS = ['admin', 'moderator', 'editor'] as const satisfies readonly AdminRole[]

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
					callback.slice(bodyStart + 4).trimStart().startsWith(`requireRoles(${permission})`)
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

| Modules | Import and first callback statement |
| --- | --- |
| `users/users.remote.ts`, `sponsors/data.remote.ts`, `newsletter/data.remote.ts`, `newsletter/[id]/data.remote.ts` | `import { ADMIN_ONLY, requireRoles } from '../authorization.server'` (adjust `../` depth for nested newsletter); `requireRoles(ADMIN_ONLY)` |
| `tags/tags.remote.ts`, `announcements/announcements.remote.ts`, `feed-builder/data.remote.ts`, `shortcuts/shortcuts.remote.ts`, `external-content/external-content.remote.ts`, `bulk-import/bulk-import.remote.ts` | `import { ADMIN_AND_MODERATOR, requireRoles } from '../authorization.server'`; `requireRoles(ADMIN_AND_MODERATOR)` |
| `content/data.remote.ts`, `content/content.remote.ts` | `import { CONTENT_MANAGERS, requireRoles } from '../authorization.server'`; `requireRoles(CONTENT_MANAGERS)` |

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
- Create: `tests/e2e/auth/remote-authorization.spec.ts`
- Modify: `tests/helpers/auth.ts`

**Interfaces:**
- Consumes: generated Remote Function actions discovered from authenticated admin pages and existing `loginAs`/test database helpers.
- Produces: HTTP regressions showing omitted/spoofed path headers cannot expose a read or execute a mutation.

- [ ] **Step 1: Align explicit hook entries with the approved role matrix**

Keep the existing redirect behavior, but ensure explicit prefixes use these exact values:

```ts
const routePermissions = [
	{ prefix: '/admin/users', roles: ['admin'] },
	{ prefix: '/admin/sponsors', roles: ['admin'] },
	{ prefix: '/admin/newsletter', roles: ['admin'] },
	{ prefix: '/admin/tags', roles: ['admin', 'moderator'] },
	{ prefix: '/admin/announcements', roles: ['admin', 'moderator'] },
	{ prefix: '/admin/feed-builder', roles: ['admin', 'moderator'] },
	{ prefix: '/admin/shortcuts', roles: ['admin', 'moderator'] },
	{ prefix: '/admin/external-content', roles: ['admin', 'moderator'] },
	{ prefix: '/admin/bulk-import', roles: ['admin', 'moderator'] },
	{ prefix: '/admin/content', roles: ['admin', 'moderator', 'editor'] }
]
```

Preserve any unrelated explicit routes and keep the `/admin` catch-all.

- [ ] **Step 2: Write the HTTP boundary tests before relying on the implementation**

The Playwright spec must:

```ts
test('an unauthenticated read is rejected with omitted and spoofed path headers', async ({
	page,
	request
}) => {
	await loginAs(page, 'admin')
	await page.goto('/admin/users/test_viewer_001')
	const endpoints = await discoverUserRemotes(page)

	for (const headers of [{}, { 'x-sveltekit-pathname': '/' }]) {
		const url = new URL(endpoints.getUsers)
		url.searchParams.set('payload', encodeRemoteArgument({ page: 1, perPage: 1 }))
		const response = await request.get(url.href, {
			headers: { 'content-type': 'application/json', ...headers }
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
	const endpoints = await discoverUserRemotes(page)

	const response = await request.post(endpoints.updateUserRole.href, {
		form: { id: 'test_viewer_001', 'n:role': before === '1' ? '2' : '1' },
		headers: {
			origin: endpoints.updateUserRole.origin,
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

Implement `discoverUserRemotes` by reading the unique form containing `data-testid="select-role"`, parsing its `?/remote=<module-id>/updateUserRole/...` action, and constructing direct `/_app/remote/<module-id>/getUsers` and `updateUserRole` URLs. Encode query arguments with `Buffer.from(devalue.stringify(value), 'utf8').toString('base64url')`. The SvelteKit Remote Function transport intentionally returns outer HTTP 200 with an inner `{ type: 'error', status: 401 }` envelope; assert both layers. Use the standalone Playwright `request` fixture so page cookies are not shared. If protocol discovery fails, fail the test rather than skipping it. Do not post to the page-relative native action, because the route hook could create a false positive before the Remote Function guard executes.

- [ ] **Step 3: Run the focused tests serially**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin NODE_ENV=test /Users/kevin/.bun/bin/bun run db:test:init
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin NODE_ENV=test /Users/kevin/.bun/bin/bun run db:test:seed
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin node node_modules/@playwright/test/cli.js test tests/e2e/auth/remote-authorization.spec.ts tests/e2e/auth/protected-routes.spec.ts --workers=1
```

Expected: all security and existing protected-route tests PASS; no test is skipped.

- [ ] **Step 4: Run build and final static guard scan**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun run build
rtk proxy rg -n 'checkAdminAuth|authorization\.remote' src tests
```

Expected: build exits 0 and the scan has no matches.

- [ ] **Step 5: Commit the navigation and HTTP regressions**

```bash
rtk git add src/hooks/protect_routes.ts tests/e2e/auth/remote-authorization.spec.ts tests/helpers/auth.ts
rtk git commit -m 'test: cover admin remote authorization boundary'
```
