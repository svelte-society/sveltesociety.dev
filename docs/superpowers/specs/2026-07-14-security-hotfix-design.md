# Security Hotfix Design

**Date:** 2026-07-14

**Status:** Approved for written-spec review

## Goal

Close the confirmed production authorization bypass first, then close the confirmed stored and reflected XSS paths in a second independently verifiable change. Preserve intended role access and existing user-facing behavior. Avoid unrelated dependency upgrades, refactors, and type cleanup.

## Confirmed Findings

### Admin Remote Function authorization bypass

The production `getUsers` Remote Function returned a user record to an unauthenticated request with no cookies and no `x-sveltekit-pathname` header. The response exposed fields including email, newsletter preference, Plunk contact ID, and role.

Two controls currently fail as a security boundary:

1. `src/hooks/protect_routes.ts` selects permissions from `event.url.pathname`. For Remote Function requests, SvelteKit reconstructs this URL from request headers that the caller can omit or manipulate. The hook remains useful for navigation UX but cannot authorize a Remote Function.
2. `src/routes/(admin)/admin/authorization.remote.ts` exports `checkAdminAuth` as a `query()`. Its callers invoke it without awaiting the returned query promise. SvelteKit defers that query callback, so the enclosing read or mutation continues before the guard can reject it.

The pattern affects 65 exported admin Remote Functions across 12 modules. Sixty-four invoke the ineffective guard; `getFilteredContent` in `src/routes/(admin)/admin/content/data.remote.ts` has no guard.

### Stored Markdown XSS

User-controlled Markdown is converted with `marked()` and stored as `rendered_body` without server-side sanitization. Public components render this value with `{@html}`. Existing stored rows must be protected as well as new writes.

### OmniSearch XSS

OmniSearch interpolates a user-controlled suggestion label into an HTML string and renders it with `{@html}`. Author display names can reach this path.

## Delivery Sequence

1. Authorization hotfix: independently testable and deployable.
2. XSS hotfix: independently testable and deployable after authorization is secure.

No production mutation will be used to verify either change.

## Authorization Hotfix

### Server-only guard

Replace `authorization.remote.ts` with `authorization.server.ts`. The replacement is a normal synchronous server-only helper, not a Remote Function.

The module will export:

```ts
export type AdminRole = 'admin' | 'moderator' | 'editor'

export const ADMIN_ONLY = ['admin'] as const
export const ADMIN_AND_MODERATOR = ['admin', 'moderator'] as const
export const CONTENT_MANAGERS = ['admin', 'moderator', 'editor'] as const

export function requireRoles(allowedRoles: readonly AdminRole[]): void
```

`requireRoles` will read the current request through `getRequestEvent()` and:

- throw HTTP 401 when no authenticated user exists;
- throw HTTP 403 when the role is missing, inactive, or not included in `allowedRoles`;
- return normally only after authorization succeeds.

Every admin Remote Function callback will call `requireRoles(...)` as its first statement. The guard cannot be skipped through request-path headers, and no protected service or database work can run before it.

### Role matrix

The server boundary will match the existing admin navigation policy:

| Area | Allowed roles |
| --- | --- |
| Users, user roles, user sessions | admin |
| Sponsors | admin |
| Newsletter | admin |
| Tags | admin, moderator |
| Announcements | admin, moderator |
| Feed Builder | admin, moderator |
| Shortcuts | admin, moderator |
| External Content | admin, moderator |
| Bulk Import | admin, moderator |
| Content | admin, moderator, editor |

`protect_routes.ts` will retain page redirects for normal navigation. Explicit route entries will be aligned with this matrix so hidden admin pages cannot be opened by a role that is denied by their Remote Functions. This hook remains defense in depth and UX control, not the Remote Function authorization boundary.

### Authorization tests

Tests will cover both the helper and the generated HTTP boundary:

- unauthenticated requests receive 401;
- inactive, member, and disallowed admin roles receive 403;
- admin, moderator, and editor access matches the matrix;
- omitting or spoofing `x-sveltekit-pathname` does not change the decision;
- one admin read endpoint returns no protected data when unauthorized;
- one admin mutation endpoint performs no database change when unauthorized;
- authorized representative endpoints still work for each permission class.

The HTTP tests will discover generated Remote Function URLs from the running application instead of hard-coding build hashes.

## XSS Hotfix

### Markdown sanitization

Add a server-side `sanitizeHtml` function next to `renderMarkdown` in `src/lib/server/markdown.ts`. Sanitization will preserve the HTML needed by Markdown and Shiki while rejecting executable tags, event-handler attributes, unsafe URL schemes, embedded documents, forms, and active content.

`renderMarkdown` will sanitize generated HTML before it is stored. `ContentService.getContentById` will also sanitize any existing `rendered_body` value, including collection children, before returning it. Since `getContentBySlug`, filtered listings, saved content, and job detail data flow through `getContentById`, this protects existing database rows without a destructive data migration.

The sanitizer dependency must itself contain security fixes. A narrowly scoped `isomorphic-dompurify` security update is allowed if the installed release resolves to a vulnerable DOMPurify version. No other package modernization belongs in this hotfix.

Tests will prove that scripts, event handlers, dangerous URLs, SVG-based payloads, and malformed markup cannot survive. They will also prove that normal Markdown, links, tables, code blocks, and Shiki output remain usable.

### OmniSearch rendering

Replace the HTML-producing highlight helper with a function that returns escaped text segments: prefix, match, and suffix. Render the matching segment inside a literal `<mark>` element and render all label content through normal Svelte interpolation. Remove the relevant `{@html}` sink.

Tests will use a malicious author label and assert that it appears as text without creating elements, event handlers, or scripts. Keyboard and selection behavior must remain unchanged.

## Error Handling

- Remote authorization failures use 401/403 response semantics; page navigation continues using redirects.
- Sanitization is deterministic and does not silently fall back to unsanitized input.
- Invalid or empty rendered HTML remains empty rather than exposing the source markup.
- Security tests fail closed if the Remote Function endpoint cannot be discovered or no test executes.

## Verification

Each hotfix will run its focused unit and Playwright tests before the full repository checks.

Authorization release verification:

1. authorization unit tests;
2. direct Remote Function boundary tests;
3. existing role-navigation tests;
4. unit suite;
5. production build with test-safe environment values;
6. Playwright suite through Node, avoiding the known Bun/Playwright loader failure;
7. after deployment, one redacted unauthenticated read request must return an error and no user data.

XSS release verification:

1. sanitizer unit tests;
2. OmniSearch malicious-label test;
3. Svelte autofixer on every changed `.svelte` file;
4. unit suite;
5. production build;
6. relevant and full Playwright suites.

## Out of Scope

- broad package upgrades;
- existing type-check backlog unrelated to these fixes;
- CSP rollout;
- accessibility work;
- Playwright architecture changes beyond security regression coverage;
- general service or component refactoring;
- production mutation testing.
