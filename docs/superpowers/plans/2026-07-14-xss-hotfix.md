# XSS Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent executable user-controlled markup from reaching public Markdown and OmniSearch HTML sinks while preserving normal Markdown, syntax highlighting, search navigation, and keyboard behavior.

**Architecture:** Sanitize Markdown output on write and again at the central content read boundary for legacy rows. Replace OmniSearch string-built HTML with typed text segments rendered through Svelte interpolation and a literal `<mark>` element.

**Tech Stack:** Svelte 5, SvelteKit 2, TypeScript, marked, Shiki, DOMPurify, Bun test, Playwright

## Global Constraints

- Deliver after the authorization hotfix and keep it independently testable.
- Preserve Markdown links, tables, code blocks, and Shiki-generated HTML/style attributes.
- Reject scripts, event handlers, unsafe URL schemes, SVG/MathML payloads, embedded documents, forms, and active tags.
- Protect existing `rendered_body` rows without a destructive migration, including collection children.
- Do not use `{@html}` for OmniSearch labels.
- A narrow security update of `isomorphic-dompurify` is allowed; no other package modernization belongs in this hotfix.
- Run the Svelte autofixer before finalizing the changed `.svelte` file.

---

## File Structure

- `src/lib/server/markdown.ts`: sanitizer policy plus sanitized Markdown rendering.
- `src/lib/server/markdown.test.ts`: malicious payload and safe-output tests.
- `src/lib/server/services/content.ts`: read-time sanitation for current and legacy rows.
- `src/lib/server/services/content.test.ts`: parent/collection-child legacy-row regressions.
- `src/routes/(app)/_components/omni-search.ts`: pure, typed highlight segmentation.
- `src/routes/(app)/_components/omni-search.test.ts`: escaped text and match-boundary tests.
- `src/routes/(app)/_components/OmniSearch.svelte`: normal interpolation and literal `<mark>` rendering.
- `tests/e2e/public/search.spec.ts`: browser assertion that malicious suggestion labels remain text.

### Task 1: Sanitize rendered Markdown on write

**Files:**
- Modify: `package.json`
- Modify: `bun.lockb`
- Modify: `src/lib/server/markdown.ts`
- Create: `src/lib/server/markdown.test.ts`

**Interfaces:**
- Consumes: `DOMPurify.sanitize(html, config)` and existing async Shiki configuration.
- Produces: `sanitizeHtml(html: string): string` and `renderMarkdown(markdown: string): Promise<string>` that never return unsanitized HTML.

- [ ] **Step 1: Upgrade only the sanitizer dependency**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun add isomorphic-dompurify@^3.18.0
rtk git diff -- package.json bun.lockb
```

Expected: only `isomorphic-dompurify` and its transitive lock entries change; revert any unrelated package changes before continuing.

- [ ] **Step 2: Write failing sanitizer tests**

```ts
import { describe, expect, test } from 'bun:test'
import { renderMarkdown, sanitizeHtml } from './markdown'

describe('sanitizeHtml', () => {
	test.each([
		'<script>alert(1)</script>',
		'<img src=x onerror=alert(1)>',
		'<a href="javascript:alert(1)">click</a>',
		'<svg><a xlink:href="javascript:alert(1)">x</a></svg>',
		'<iframe srcdoc="<script>alert(1)</script>"></iframe>',
		'<form><button formaction="javascript:alert(1)">x</button></form>'
	])('removes executable markup from %s', (payload) => {
		const sanitized = sanitizeHtml(payload)
		expect(sanitized).not.toMatch(/script|onerror|javascript:|<svg|<iframe|<form|formaction/i)
	})

	test('preserves safe Markdown and Shiki structures', async () => {
		const rendered = await renderMarkdown(
			'# Heading\n\n[Safe](https://example.com)\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n```svelte\n<h1>{title}</h1>\n```'
		)
		expect(rendered).toContain('<h1>Heading</h1>')
		expect(rendered).toContain('href="https://example.com"')
		expect(rendered).toContain('<table>')
		expect(rendered).toContain('<pre')
		expect(rendered).toContain('<span')
	})
})
```

- [ ] **Step 3: Run the test and verify the unsafe cases fail**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test src/lib/server/markdown.test.ts
```

Expected: FAIL because `sanitizeHtml` is not exported or malicious attributes remain.

- [ ] **Step 4: Implement the deterministic sanitizer policy**

Add this beside the existing renderer and make sanitization the final return step:

```ts
import DOMPurify from 'isomorphic-dompurify'

const SANITIZE_CONFIG = {
	USE_PROFILES: { html: true },
	FORBID_TAGS: [
		'script',
		'style',
		'iframe',
		'object',
		'embed',
		'form',
		'input',
		'button',
		'textarea',
		'select',
		'option',
		'template',
		'base',
		'link',
		'meta'
	],
	FORBID_ATTR: ['formaction', 'srcdoc'],
	SANITIZE_NAMED_PROPS: true
} as const

export function sanitizeHtml(html: string): string {
	return DOMPurify.sanitize(html, SANITIZE_CONFIG)
}

export async function renderMarkdown(markdown: string): Promise<string> {
	await configureMarked()
	return sanitizeHtml(marked(markdown) as string)
}
```

The HTML profile intentionally excludes SVG and MathML. Do not forbid inline `style`, because Shiki uses it for token colors; DOMPurify still strips event attributes and unsafe schemes.

- [ ] **Step 5: Run the focused test and commit**

Run the command from Step 3. Expected: all sanitizer tests PASS.

```bash
rtk git add package.json bun.lockb src/lib/server/markdown.ts src/lib/server/markdown.test.ts
rtk git commit -m 'fix: sanitize rendered markdown'
```

### Task 2: Sanitize legacy Markdown at the content read boundary

**Files:**
- Modify: `src/lib/server/services/content.ts`
- Modify: `src/lib/server/services/content.test.ts`

**Interfaces:**
- Consumes: `sanitizeHtml(html: string): string` from Task 1.
- Produces: `getContentById(id)` output with sanitized `rendered_body` for the parent and every populated collection child.

- [ ] **Step 1: Add failing service tests with legacy unsafe database values**

Insert a published content row whose `rendered_body` is `<img src=x onerror=alert(1)><p>safe</p>`, call `getContentById`, and assert:

```ts
expect(result?.rendered_body).toBe('<img src="x"><p>safe</p>')
```

Insert a collection whose child has `<a href="javascript:alert(1)">child</a>`, call `getContentById(collectionId)`, and assert:

```ts
const child = result?.children?.[0]
expect(typeof child).toBe('object')
expect((child as ContentWithAuthor).rendered_body).toBe('<a>child</a>')
```

The tests must also query the database directly afterward and assert the original unsafe stored value is unchanged, proving the compatibility layer is non-destructive.

- [ ] **Step 2: Run the service tests and verify both new cases fail**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test src/lib/server/services/content.test.ts
```

Expected: the unsafe event handler and `javascript:` URL remain in returned rows.

- [ ] **Step 3: Sanitize parent and child output immediately after fetching each row**

Update the import and apply this helper before returning rows:

```ts
import { renderMarkdown, sanitizeHtml } from '../markdown'

function sanitizeRenderedBody(content: ContentWithAuthor): void {
	if (typeof content.rendered_body === 'string') {
		content.rendered_body = sanitizeHtml(content.rendered_body)
	}
}
```

Call `sanitizeRenderedBody(content)` after the parent null check. Call `sanitizeRenderedBody(childContent)` inside the collection child branch before pushing it into `childrenContent`. Do not update the database.

- [ ] **Step 4: Run focused tests and commit**

Run the command from Step 2. Expected: the complete content service suite PASS.

```bash
rtk git add src/lib/server/services/content.ts src/lib/server/services/content.test.ts
rtk git commit -m 'fix: sanitize legacy content on read'
```

### Task 3: Remove the OmniSearch HTML sink

**Files:**
- Create: `src/routes/(app)/_components/omni-search.ts`
- Create: `src/routes/(app)/_components/omni-search.test.ts`
- Modify: `src/routes/(app)/_components/OmniSearch.svelte`
- Modify: `tests/e2e/public/search.spec.ts`

**Interfaces:**
- Produces: `HighlightSegment = { text: string; highlighted: boolean }` and `splitHighlight(text: string, search: string): HighlightSegment[]`.
- Consumes: normal Svelte interpolation; no raw HTML rendering.

- [ ] **Step 1: Write the failing segment tests**

```ts
import { describe, expect, test } from 'bun:test'
import { splitHighlight } from './omni-search'

describe('splitHighlight', () => {
	test('preserves malicious markup as plain text segments', () => {
		expect(splitHighlight('<img src=x onerror=alert(1)>Alice', 'ali')).toEqual([
		{ text: '<img src=x onerror=alert(1)>', highlighted: false },
		{ text: 'Ali', highlighted: true },
		{ text: 'ce', highlighted: false }
	])
	})

	test('matches case-insensitively and treats regex characters literally', () => {
		expect(splitHighlight('Svelte [5] and [5]', '[5]')).toEqual([
		{ text: 'Svelte ', highlighted: false },
		{ text: '[5]', highlighted: true },
		{ text: ' and ', highlighted: false },
		{ text: '[5]', highlighted: true }
	])
	})

	test('returns one plain segment for an empty search', () => {
		expect(splitHighlight('Alice', '')).toEqual([{ text: 'Alice', highlighted: false }])
	})
})
```

- [ ] **Step 2: Run the helper test and verify it fails because the module is absent**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test 'src/routes/(app)/_components/omni-search.test.ts'
```

Expected: FAIL with `Cannot find module './omni-search'`.

- [ ] **Step 3: Implement the pure segmenter**

```ts
export type HighlightSegment = {
	text: string
	highlighted: boolean
}

export function splitHighlight(text: string, search: string): HighlightSegment[] {
	if (!search) return [{ text, highlighted: false }]
	const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const matches = [...text.matchAll(new RegExp(escaped, 'gi'))]
	if (matches.length === 0) return [{ text, highlighted: false }]

	const segments: HighlightSegment[] = []
	let offset = 0
	for (const match of matches) {
		const index = match.index ?? 0
		if (index > offset) segments.push({ text: text.slice(offset, index), highlighted: false })
		segments.push({ text: match[0], highlighted: true })
		offset = index + match[0].length
	}
	if (offset < text.length) segments.push({ text: text.slice(offset), highlighted: false })
	return segments
}
```

- [ ] **Step 4: Replace raw HTML rendering with normal Svelte interpolation**

Import `splitHighlight`, delete `highlightMatch`, and replace the sink with:

```svelte
<span>
	{#each splitHighlight(suggestion.label, searchQuery) as segment}
		{#if segment.highlighted}
			<mark class="rounded-sm bg-svelte-100 text-svelte-700">{segment.text}</mark>
		{:else}
			{segment.text}
		{/if}
	{/each}
</span>
```

Normal interpolation must be the only path for `segment.text`. Do not retain a label-related `{@html}`.

- [ ] **Step 5: Add the browser regression and run focused tests**

Seed or update a test user name to `<img data-testid="xss-probe" src=x onerror=alert(1)>Alice`, open OmniSearch, search `Alice`, then assert:

```ts
await expect(page.getByText('<img data-testid="xss-probe" src=x onerror=alert(1)>Alice')).toBeVisible()
await expect(page.getByTestId('xss-probe')).toHaveCount(0)
```

Run:

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test 'src/routes/(app)/_components/omni-search.test.ts'
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin node node_modules/@playwright/test/cli.js test tests/e2e/public/search.spec.ts --workers=1
```

Expected: helper and browser search tests PASS, with no created probe element.

- [ ] **Step 6: Run the required Svelte autofixer and commit**

Run the `svelte-code-writer` analyzer/autofixer on `src/routes/(app)/_components/OmniSearch.svelte`, apply only relevant fixes, then rerun Step 5.

```bash
rtk git add 'src/routes/(app)/_components/omni-search.ts' 'src/routes/(app)/_components/omni-search.test.ts' 'src/routes/(app)/_components/OmniSearch.svelte' tests/e2e/public/search.spec.ts
rtk git commit -m 'fix: render search highlights as escaped text'
```

### Task 4: Verify the complete security hotfix

**Files:**
- Verify only; do not broaden the change set.

**Interfaces:**
- Consumes: all authorization and XSS commits.
- Produces: evidence that security regressions, unit tests, lint, and production build pass.

- [ ] **Step 1: Run all focused security tests**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test 'src/routes/(admin)/admin/authorization.test.ts' src/lib/server/markdown.test.ts src/lib/server/services/content.test.ts 'src/routes/(app)/_components/omni-search.test.ts'
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin node node_modules/@playwright/test/cli.js test tests/e2e/auth/remote-authorization.spec.ts tests/e2e/auth/protected-routes.spec.ts tests/e2e/public/search.spec.ts --workers=1
```

Expected: zero failures and zero skipped security tests.

- [ ] **Step 2: Run repository unit, formatting, and build checks**

```bash
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun test src/ tests/unit/
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun run lint
rtk proxy env PATH=/Users/kevin/.bun/bin:/usr/bin:/bin:/usr/sbin:/sbin /Users/kevin/.bun/bin/bun run build
```

Expected: unit suite, formatter, and build exit 0. Review formatter changes and retain only intended security files.

- [ ] **Step 3: Scan the final diff for old authorization and XSS sinks**

```bash
rtk proxy rg -n 'checkAdminAuth|authorization\.remote' src tests
rtk proxy rg -n '\{@html\}.*(highlight|suggestion)|highlightMatch' 'src/routes/(app)/_components'
rtk git diff --check
rtk git status --short
```

Expected: the security scans have no matches; `git diff --check` exits 0; only planned files plus pre-existing untracked workspace metadata appear.
