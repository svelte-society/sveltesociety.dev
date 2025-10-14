# Social Media Feature - Simple Implementation Plan

## Overview

This plan breaks the social media feature into simple, iterative phases. **Each phase leaves the application in a fully working state.**

Build the simplest thing first, then iterate. We'll use **SvelteKit remote functions** for type-safe client-server communication, preferring `form` remote functions for progressive enhancement and web platform alignment.

**UI Components**: Use existing components from `src/lib/ui/`:

- `Button.svelte` - for all buttons
- `admin/Badge.svelte` - for status badges (draft, scheduled, posted, failed)
- `admin/Table.svelte` - for the posts list table
- `Dialog.svelte` - for modals
- `Icon.svelte` - for icons

**Note on Forms**: The existing form components (`form/Input.svelte`, `form/Textarea.svelte`) are built for SuperForms, but remote functions have their own field API. We'll use native HTML inputs with the remote function's `.as()` method, styled to match the existing design:

```
class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
```

---

## Phase 0: Enable Remote Functions

**Goal**: Enable the experimental remote functions feature in SvelteKit

### Tasks

1. Update `svelte.config.js` to enable remote functions
2. Optionally enable experimental async support for `await` in components

### Implementation

```js
// svelte.config.js
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true // Optional: allows using await in components
		}
	}
}
```

### Deliverables

- ✅ Remote functions enabled
- ✅ App still runs correctly

---

## Phase 1: UI Only - Main Dashboard with Mock Data

**Goal**: Build the scheduling dashboard UI with fake data, no backend yet

### What Gets Built

1. **Types (Mock Data)**
   - `src/lib/types/social-media.ts` - Basic TypeScript types
   - Mock data arrays for posts

2. **Route Setup**
   - Create `/admin/social-media/+page.svelte`
   - Create `/admin/social-media/+page.server.ts` (empty for now)
   - Add link to admin sidebar

3. **Main Dashboard UI**
   - Use `admin/Table.svelte` component for posts table
   - Columns: Content Title, Platform, Post Text, Status, Scheduled Time, Actions
   - Use `admin/Badge.svelte` for status badges (default, info, primary, success, danger)
   - Use `Button.svelte` for action buttons
   - Filter tabs: All, Drafts, Scheduled, Posted, Failed
   - Mock data: 5-10 fake posts with different statuses

```svelte
<script>
	import Table from '$lib/ui/admin/Table.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'

	const mockPosts = [
		/* ... */
	]
	let statusFilter = 'all'

	const filteredPosts = $derived(
		statusFilter === 'all' ? mockPosts : mockPosts.filter((p) => p.status === statusFilter)
	)

	const statusColors = {
		draft: 'default',
		scheduled: 'info',
		posted: 'success',
		failed: 'danger'
	}
</script>

<div class="mb-4 flex gap-2">
	<Button
		variant={statusFilter === 'all' ? 'primary' : 'outline'}
		onclick={() => (statusFilter = 'all')}
	>
		{#snippet children()}All{/snippet}
	</Button>
	<Button
		variant={statusFilter === 'draft' ? 'primary' : 'outline'}
		onclick={() => (statusFilter = 'draft')}
	>
		{#snippet children()}Drafts{/snippet}
	</Button>
	<!-- ... more filter buttons -->
</div>

<Table data={filteredPosts} action={true}>
	{#snippet header(classes)}
		<th class={classes}>Content</th>
		<th class={classes}>Platform</th>
		<th class={classes}>Post Text</th>
		<th class={classes}>Status</th>
		<th class={classes}>Scheduled</th>
	{/snippet}

	{#snippet row(post, classes)}
		<td class={classes}>{post.contentTitle}</td>
		<td class={classes}>{post.platform}</td>
		<td class={classes}>{post.postText}</td>
		<td class={classes}>
			<Badge text={post.status} color={statusColors[post.status]} />
		</td>
		<td class={classes}>{post.scheduledAt || '-'}</td>
	{/snippet}

	{#snippet actionCell(post)}
		<Button size="sm" variant="outline">
			{#snippet children()}Edit{/snippet}
		</Button>
		<Button size="sm" variant="primary">
			{#snippet children()}Post Now{/snippet}
		</Button>
	{/snippet}
</Table>
```

4. **Empty States**
   - Show message when no posts match filter
   - "No draft posts yet" message

### Mock Data Example

```ts
const mockPosts = [
	{
		id: '1',
		contentTitle: 'New Svelte 5 Tutorial',
		platform: 'bluesky',
		postText: '🎥 New video: Svelte 5 Runes Explained...',
		status: 'draft',
		scheduledAt: null
	},
	{
		id: '2',
		contentTitle: 'Amazing Library: svelte-dnd',
		platform: 'bluesky',
		postText: '📦 Featured library: svelte-dnd...',
		status: 'scheduled',
		scheduledAt: '2025-01-20T09:00:00Z'
	}
	// ... more mock posts
]
```

### Deliverables

- ✅ App runs correctly
- ✅ Can navigate to `/admin/social-media`
- ✅ Can see list of mock posts
- ✅ Can filter by status (filters don't work yet, just UI)
- ✅ Buttons are visible but don't do anything yet
- ✅ Looks presentable (basic styling)

---

## Phase 2: Add Database Schema & Migrations

**Goal**: Add database tables, no data yet

### What Gets Built

1. **Database Migration**
   - Create `src/lib/server/db/migrations/005_add_social_media_tables.sql`
   - Tables: `social_accounts`, `social_posts`, `social_templates`

2. **Schema Definition**

```sql
-- Social media accounts
CREATE TABLE social_accounts (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL, -- 'bluesky', 'nostr', 'linkedin'
  account_name TEXT NOT NULL,
  account_handle TEXT NOT NULL,
  credentials TEXT NOT NULL, -- Encrypted JSON
  relay_urls TEXT, -- Nostr-specific: JSON array
  is_active BOOLEAN DEFAULT true,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Social media posts
CREATE TABLE social_posts (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  post_text TEXT NOT NULL,
  post_data TEXT, -- JSON: images, links, etc.
  external_post_id TEXT, -- Platform's post ID
  external_url TEXT, -- Link to post on platform
  status TEXT NOT NULL, -- 'draft', 'scheduled', 'posted', 'failed'
  scheduled_at TEXT, -- When to post
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  posted_at TEXT,
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE
);

-- Indexes for efficient queries
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_at, status);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_content ON social_posts(content_id);
```

3. **Types Update**
   - Update `src/lib/types/social-media.ts` with proper types matching schema

4. **Zod Schemas**
   - Create `src/lib/schema/social-media.ts` for validation (we use Zod, not Valibot)

### Deliverables

- ✅ App runs correctly
- ✅ Migration runs successfully: `bun db:migrate`
- ✅ Tables exist in database (can verify with SQLite viewer)
- ✅ Types are properly defined

---

## Phase 3: Connect UI to Database with Remote Functions

**Goal**: Replace mock data with real database queries using remote functions

### What Gets Built

1. **Remote Functions File**
   - Create `src/routes/(admin)/admin/social-media/data.remote.ts`

2. **Basic Queries & Forms**

```ts
// data.remote.ts
import { query, form } from '$app/server'
import { z } from 'zod'
import { db } from '$lib/server/db'

export const getAllPosts = query(async () => {
	const posts = db
		.prepare(
			`
		SELECT
			sp.*,
			c.title as content_title
		FROM social_posts sp
		LEFT JOIN content c ON sp.content_id = c.id
		ORDER BY sp.created_at DESC
	`
		)
		.all()

	return posts
})

export const deletePost = form(
	z.object({
		postId: z.string()
	}),
	async ({ postId }) => {
		db.prepare('DELETE FROM social_posts WHERE id = ?').run(postId)

		// Refresh the posts list
		await getAllPosts().refresh()
	}
)
```

3. **Update UI to Use Remote Functions**

```svelte
<!-- +page.svelte -->
<script>
	import { getAllPosts, deletePost } from './data.remote'
	import Table from '$lib/ui/admin/Table.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'

	const statusColors = {
		draft: 'default',
		scheduled: 'info',
		posted: 'success',
		failed: 'danger'
	}
</script>

<Table data={await getAllPosts()} action={true}>
	{#snippet header(classes)}
		<th class={classes}>Content</th>
		<th class={classes}>Platform</th>
		<th class={classes}>Post Text</th>
		<th class={classes}>Status</th>
		<th class={classes}>Scheduled</th>
	{/snippet}

	{#snippet row(post, classes)}
		<td class={classes}>{post.content_title}</td>
		<td class={classes}>{post.platform}</td>
		<td class={classes}>{post.post_text}</td>
		<td class={classes}>
			<Badge text={post.status} color={statusColors[post.status]} />
		</td>
		<td class={classes}>{post.scheduled_at || '-'}</td>
	{/snippet}

	{#snippet actionCell(post)}
		<form {...deletePost.for(post.id)}>
			<input type="hidden" {...deletePost.fields.postId.as('hidden')} value={post.id} />
			<Button type="submit" size="sm" variant="danger">
				{#snippet children()}Delete{/snippet}
			</Button>
		</form>
	{/snippet}
</Table>
```

4. **Filtering**
   - Add filter parameter to query
   - Update UI to filter by status

### Deliverables

- ✅ App runs correctly
- ✅ Dashboard shows real data from database (empty at first)
- ✅ Can delete posts
- ✅ Filtering works
- ✅ Type-safe communication between client and server

---

## Phase 4: Add Simple Template System

**Goal**: Generate post text from content metadata

### What Gets Built

1. **Template Engine**
   - Create `src/lib/server/services/social-media/templates.ts`
   - Simple string interpolation: `{title}`, `{description}`, `{url}`

```ts
// templates.ts
export const DEFAULT_TEMPLATES = {
	video: {
		bluesky: '🎥 New video: {title}\n\n{description}\n\n{url}'
	},
	library: {
		bluesky: '📦 Featured library: {title}\n\n{description}\n\n{url}'
	}
	// ... other content types
}

export function generatePostText(
	contentType: string,
	platform: string,
	data: { title: string; description: string; url: string }
): string {
	const template = DEFAULT_TEMPLATES[contentType]?.[platform]
	if (!template) return `${data.title}\n\n${data.url}`

	return template
		.replace('{title}', data.title)
		.replace('{description}', data.description)
		.replace('{url}', data.url)
}
```

2. **Create Draft Form**

```ts
// data.remote.ts
import { z } from 'zod'
import { form } from '$app/server'
import { generatePostText } from '$lib/server/services/social-media/templates'

export const createDraftPost = form(
	z.object({
		contentId: z.string(),
		platform: z.string()
	}),
	async ({ contentId, platform }) => {
		// Get content details
		const content = db.prepare('SELECT * FROM content WHERE id = ?').get(contentId)

		// Get active account for platform
		const account = db
			.prepare('SELECT * FROM social_accounts WHERE platform = ? AND is_active = 1 LIMIT 1')
			.get(platform)

		if (!account) throw new Error('No active account for platform')

		// Generate post text
		const postText = generatePostText(content.type, platform, {
			title: content.title,
			description: content.description || '',
			url: `https://sveltesociety.dev/${content.type}/${content.slug}`
		})

		// Insert into database
		db.prepare(
			`
			INSERT INTO social_posts (id, content_id, account_id, platform, post_text, status, created_at)
			VALUES (?, ?, ?, ?, ?, 'draft', ?)
		`
		).run(crypto.randomUUID(), contentId, account.id, platform, postText, new Date().toISOString())

		// Refresh posts list
		await getAllPosts().refresh()
	}
)
```

3. **UI to Create Drafts**
   - Add form to manually create draft from content admin
   - Show success toast when draft created

```svelte
<!-- In content admin somewhere -->
<form {...createDraftPost}>
	<input type="hidden" {...createDraftPost.fields.contentId.as('hidden')} value={content.id} />
	<input type="hidden" {...createDraftPost.fields.platform.as('hidden')} value="bluesky" />
	<button>Create BlueSky Draft</button>
</form>
```

### Deliverables

- ✅ App runs correctly
- ✅ Can manually create draft posts
- ✅ Post text is generated from templates
- ✅ Drafts appear in dashboard

---

## Phase 5: Hook into Content Publishing

**Goal**: Automatically create draft posts when content is published

### What Gets Built

1. **Create Server-Side Helper Function**

```ts
// src/lib/server/services/social-media/drafts.ts
import { db } from '$lib/server/db'
import { generatePostText } from './templates'

export async function createDraftsForContent(contentId: string) {
	// Get content details
	const content = db.prepare('SELECT * FROM content WHERE id = ?').get(contentId)
	if (!content) return

	// Get all active accounts
	const accounts = db.prepare('SELECT * FROM social_accounts WHERE is_active = 1').all()

	// Create draft for each platform
	for (const account of accounts) {
		const postText = generatePostText(content.type, account.platform, {
			title: content.title,
			description: content.description || '',
			url: `https://sveltesociety.dev/${content.type}/${content.slug}`
		})

		db.prepare(
			`
			INSERT INTO social_posts (id, content_id, account_id, platform, post_text, status, created_at)
			VALUES (?, ?, ?, ?, ?, 'draft', ?)
		`
		).run(
			crypto.randomUUID(),
			contentId,
			account.id,
			account.platform,
			postText,
			new Date().toISOString()
		)
	}
}
```

2. **Update Content Publishing Hook**

```ts
// src/routes/(admin)/admin/content/[id]/+page.server.ts
import { createDraftsForContent } from '$lib/server/services/social-media/drafts'

export const actions = {
	default: async ({ request, locals }) => {
		// ... existing content update logic ...

		if (form.data.status === 'published' && wasNotPublishedBefore) {
			// Create draft social posts
			try {
				await createDraftsForContent(content.id)
			} catch (err) {
				// Don't block publishing if social media fails
				console.error('Failed to create social drafts:', err)
			}
		}

		return { success: true }
	}
}
```

### Deliverables

- ✅ App runs correctly
- ✅ Publishing content automatically creates draft posts
- ✅ Shows toast notification
- ✅ Drafts appear in dashboard

---

## Phase 6: Edit & Schedule Posts

**Goal**: Allow editing post text and setting scheduled time

### What Gets Built

1. **Update Post Form**

```ts
// data.remote.ts
export const updatePost = form(
	z.object({
		postId: z.string(),
		postText: z.string(),
		scheduledAt: z.string().nullable()
	}),
	async ({ postId, postText, scheduledAt }) => {
		const status = scheduledAt ? 'scheduled' : 'draft'

		db.prepare(
			`
			UPDATE social_posts
			SET post_text = ?, scheduled_at = ?, status = ?, updated_at = ?
			WHERE id = ?
		`
		).run(postText, scheduledAt, status, new Date().toISOString(), postId)

		// Refresh posts list
		await getAllPosts().refresh()
	}
)
```

2. **UI for Editing**

```svelte
<!-- Use Dialog component for editing -->
<script>
	import Dialog from '$lib/ui/Dialog.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { updatePost } from './data.remote'

	let editOpen = $state(false)
	let editingPost = $state(null)
</script>

<!-- In the actionCell snippet -->
{#snippet actionCell(post)}
	<Button
		size="sm"
		variant="outline"
		onclick={() => {
			editingPost = post
			editOpen = true
		}}
	>
		{#snippet children()}Edit{/snippet}
	</Button>
{/snippet}

<!-- Dialog for editing -->
<Dialog bind:open={editOpen} title="Edit Social Post" showConfirm={false}>
	{#snippet content()}
		{#if editingPost}
			<form {...updatePost.for(editingPost.id)} class="space-y-4">
				<input type="hidden" {...updatePost.fields.postId.as('hidden')} value={editingPost.id} />

				<div>
					<label class="text-xs font-medium">Post Text</label>
					<textarea
						{...updatePost.fields.postText.as('text')}
						rows="6"
						class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
						>{editingPost.post_text}</textarea
					>
				</div>

				<div>
					<label class="text-xs font-medium">Schedule Time</label>
					<input
						{...updatePost.fields.scheduledAt.as('datetime-local')}
						class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
					/>
				</div>

				<Button type="submit" variant="primary">
					{#snippet children()}Save Changes{/snippet}
				</Button>
			</form>
		{/if}
	{/snippet}
</Dialog>
```

### Deliverables

- ✅ App runs correctly
- ✅ Can edit post text
- ✅ Can set scheduled time
- ✅ Status updates to "scheduled" when time is set

---

## Phase 7: BlueSky Client & "Post Now"

**Goal**: Actually post to BlueSky when "Post Now" is clicked

### What Gets Built

1. **Install Dependency**

```bash
bun add @atproto/api
```

2. **BlueSky Client**

```ts
// src/lib/server/services/social-media/clients/bluesky.ts
import { AtpAgent } from '@atproto/api'

export class BlueSkyClient {
	private agent: AtpAgent

	constructor(identifier: string, password: string) {
		this.agent = new AtpAgent({ service: 'https://bsky.social' })
	}

	async login() {
		const credentials = JSON.parse(this.credentials)
		await this.agent.login({
			identifier: credentials.identifier,
			password: credentials.password
		})
	}

	async post(text: string) {
		await this.login()

		const result = await this.agent.post({
			text,
			createdAt: new Date().toISOString()
		})

		return {
			id: result.uri,
			url: `https://bsky.app/profile/${result.uri}`
		}
	}
}
```

3. **Post Now Form**

```ts
// data.remote.ts
export const postNow = form(
	z.object({
		postId: z.string()
	}),
	async ({ postId }) => {
		const post = db.prepare('SELECT * FROM social_posts WHERE id = ?').get(postId)
		const account = db.prepare('SELECT * FROM social_accounts WHERE id = ?').get(post.account_id)

		if (account.platform === 'bluesky') {
			const client = new BlueSkyClient(account.credentials)
			const result = await client.post(post.post_text)

			db.prepare(
				`
				UPDATE social_posts
				SET status = 'posted', external_post_id = ?, external_url = ?, posted_at = ?
				WHERE id = ?
			`
			).run(result.id, result.url, new Date().toISOString(), postId)
		}

		// Refresh posts list
		await getAllPosts().refresh()
	}
)
```

4. **Update UI**

```svelte
<script>
	import Button from '$lib/ui/Button.svelte'
	import { postNow } from './data.remote'
</script>

<!-- In the actionCell snippet -->
{#snippet actionCell(post)}
	<form {...postNow.for(post.id)}>
		<input type="hidden" {...postNow.fields.postId.as('hidden')} value={post.id} />
		<Button type="submit" size="sm" variant="primary" disabled={!!postNow.pending}>
			{#snippet children()}
				{postNow.pending ? 'Posting...' : 'Post Now'}
			{/snippet}
		</Button>
	</form>
{/snippet}
```

### Deliverables

- ✅ App runs correctly
- ✅ Can click "Post Now" to immediately post to BlueSky
- ✅ Post status updates to "posted"
- ✅ Can see link to posted content on BlueSky

---

## Phase 8: Automatic Scheduling Background Job

**Goal**: Scheduled posts automatically publish at the right time

### What Gets Built

1. **Background Job**

```ts
// src/lib/server/jobs/process-scheduled-posts.ts
import { db } from '$lib/server/db'
import { BlueSkyClient } from '../services/social-media/clients/bluesky'

export async function processScheduledPosts() {
	const now = new Date().toISOString()

	const duePosts = db
		.prepare(
			`
		SELECT sp.*, sa.credentials, sa.platform
		FROM social_posts sp
		JOIN social_accounts sa ON sp.account_id = sa.id
		WHERE sp.status = 'scheduled'
		AND sp.scheduled_at <= ?
	`
		)
		.all(now)

	for (const post of duePosts) {
		try {
			let result

			if (post.platform === 'bluesky') {
				const client = new BlueSkyClient(JSON.parse(post.credentials))
				result = await client.post(post.post_text)
			}

			db.prepare(
				`
				UPDATE social_posts
				SET status = 'posted', external_post_id = ?, external_url = ?, posted_at = ?
				WHERE id = ?
			`
			).run(result.id, result.url, new Date().toISOString(), post.id)
		} catch (err) {
			// Mark as failed, will retry later
			db.prepare(
				`
				UPDATE social_posts
				SET status = 'failed', error_message = ?, retry_count = retry_count + 1
				WHERE id = ?
			`
			).run(err.message, post.id)
		}
	}
}
```

2. **Run Job Every Minute**
   - Option A: Use SvelteKit server hooks to run in background
   - Option B: External cron job that calls an endpoint
   - Start with simple `setInterval` in `hooks.server.ts`

```ts
// hooks.server.ts
import { processScheduledPosts } from '$lib/server/jobs/process-scheduled-posts'

// Run every minute
setInterval(() => {
	processScheduledPosts().catch(console.error)
}, 60000)
```

3. **Retry Logic**
   - If retry_count < 3, reschedule for 5 minutes later
   - If retry_count >= 3, leave as failed

### Deliverables

- ✅ App runs correctly
- ✅ Scheduled posts automatically publish at scheduled time
- ✅ Failed posts retry up to 3 times
- ✅ UI shows updated status

---

## Phase 9: Account Management UI

**Goal**: Add/remove BlueSky accounts through the UI

### What Gets Built

1. **Accounts Route**
   - Create `/admin/social-media/accounts/+page.svelte`
   - Create `/admin/social-media/accounts/data.remote.ts`

2. **Account Management Forms**

```ts
// accounts/data.remote.ts
import { query, form } from '$app/server'
import { z } from 'zod'

export const getAccounts = query(async () => {
	return db.prepare('SELECT * FROM social_accounts').all()
})

export const addAccount = form(
	z.object({
		platform: z.string(),
		accountName: z.string(),
		accountHandle: z.string(),
		identifier: z.string(),
		password: z.string()
	}),
	async (data) => {
		// Test connection first
		const client = new BlueSkyClient(data.identifier, data.password)
		await client.login() // Will throw if invalid

		// Store credentials (plain text for now)
		const credentials = JSON.stringify({
			identifier: data.identifier,
			password: data.password
		})

		db.prepare(
			`
			INSERT INTO social_accounts (id, platform, account_name, account_handle, credentials, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`
		).run(
			crypto.randomUUID(),
			data.platform,
			data.accountName,
			data.accountHandle,
			credentials,
			new Date().toISOString(),
			new Date().toISOString()
		)

		// Refresh accounts list
		await getAccounts().refresh()
	}
)

export const deleteAccount = form(
	z.object({
		accountId: z.string()
	}),
	async ({ accountId }) => {
		db.prepare('DELETE FROM social_accounts WHERE id = ?').run(accountId)

		// Refresh accounts list
		await getAccounts().refresh()
	}
)
```

3. **UI**

```svelte
<script>
	import { getAccounts, addAccount, deleteAccount } from './data.remote'
	import Button from '$lib/ui/Button.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
</script>

<h2 class="mb-4 text-2xl font-bold">Connected Accounts</h2>

<div class="mb-8 space-y-2">
	{#each await getAccounts() as account}
		<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
			<div>
				<Badge text={account.platform} color="info" />
				<span class="ml-2">@{account.account_handle}</span>
			</div>

			<form {...deleteAccount.for(account.id)}>
				<input type="hidden" {...deleteAccount.fields.accountId.as('hidden')} value={account.id} />
				<Button type="submit" size="sm" variant="danger">
					{#snippet children()}Delete{/snippet}
				</Button>
			</form>
		</div>
	{/each}
</div>

<h2 class="mb-4 text-2xl font-bold">Add Account</h2>

<form {...addAccount} class="space-y-4 rounded-lg bg-white p-6 shadow-sm">
	<div>
		<label class="text-xs font-medium">Platform</label>
		<select
			{...addAccount.fields.platform.as('select')}
			class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
		>
			<option value="bluesky">BlueSky</option>
		</select>
	</div>

	<div>
		<label class="text-xs font-medium">Display Name</label>
		<input
			{...addAccount.fields.accountName.as('text')}
			placeholder="Display Name"
			class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
		/>
	</div>

	<div>
		<label class="text-xs font-medium">Handle</label>
		<input
			{...addAccount.fields.accountHandle.as('text')}
			placeholder="@handle"
			class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
		/>
	</div>

	<div>
		<label class="text-xs font-medium">Identifier</label>
		<input
			{...addAccount.fields.identifier.as('text')}
			placeholder="Identifier"
			class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
		/>
	</div>

	<div>
		<label class="text-xs font-medium">App Password</label>
		<input
			{...addAccount.fields.password.as('password')}
			placeholder="App Password"
			class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
		/>
	</div>

	<Button type="submit" variant="primary">
		{#snippet children()}Add Account{/snippet}
	</Button>
</form>
```

### Deliverables

- ✅ App runs correctly
- ✅ Can add BlueSky accounts through UI
- ✅ Can delete accounts
- ✅ Can test connection
- ✅ Credentials stored (plain text for now, encryption in later phase)

---

## Phase 10: Add Nostr Support

**Goal**: Support posting to Nostr

### What Gets Built

1. **Install Dependency**

```bash
bun add nostr-tools
```

2. **Nostr Client**

```ts
// src/lib/server/services/social-media/clients/nostr.ts
import { SimplePool, getEventHash, signEvent } from 'nostr-tools'
import { nip19 } from 'nostr-tools'

export class NostrClient {
	private pool: SimplePool
	private privateKey: Uint8Array
	private relays: string[]

	constructor(nsec: string, relays: string[]) {
		this.pool = new SimplePool()
		const { data } = nip19.decode(nsec)
		this.privateKey = data as Uint8Array
		this.relays = relays
	}

	async post(text: string) {
		const event = {
			kind: 1,
			created_at: Math.floor(Date.now() / 1000),
			tags: [],
			content: text
		}

		event.id = getEventHash(event)
		event.sig = signEvent(event, this.privateKey)

		await this.pool.publish(this.relays, event)

		return {
			id: event.id,
			url: `https://njump.me/${event.id}`
		}
	}
}
```

3. **Update Templates**
   - Add Nostr templates

4. **Update Account Management**
   - Support adding Nostr accounts (nsec + relay URLs)

5. **Update Post Logic**
   - Support Nostr in `postNow` command

### Deliverables

- ✅ App runs correctly
- ✅ Can add Nostr accounts
- ✅ Publishing content creates Nostr drafts
- ✅ Can post to Nostr

---

## Phase 11: Add LinkedIn Support

**Goal**: Support posting to LinkedIn

### What Gets Built

1. **LinkedIn Client**
   - Research LinkedIn Share API
   - Implement basic posting

2. **Update Templates**
   - Add LinkedIn templates

3. **Update Account Management**
   - Support adding LinkedIn accounts

### Deliverables

- ✅ App runs correctly
- ✅ Can add LinkedIn accounts
- ✅ Publishing content creates LinkedIn drafts
- ✅ Can post to LinkedIn

---

## Phase 12: Polish & Improvements

**Goal**: Make everything better

### Optional Features (Pick any)

- Better filtering and search
- Inline editing
- Template management UI
- Image attachments
- Credential encryption
- Better error handling
- Analytics

---

## Implementation Guidelines

### Before Starting Each Phase

- [ ] Read the phase description carefully
- [ ] Make sure previous phase is complete
- [ ] Commit previous work

### After Completing Each Phase

- [ ] All features working
- [ ] No console errors
- [ ] Test manually
- [ ] Commit with descriptive message
- [ ] Move to next phase

### General Rules

1. **Keep it simple**: Don't over-engineer
2. **Test as you go**: Manually test each feature
3. **Commit frequently**: After each working feature
4. **Use form remote functions**: Prefer `form` over `command` for progressive enhancement
5. **Type everything**: Use TypeScript with Zod schemas for validation
6. **Web platform first**: Forms work without JavaScript, then enhance with client-side behavior

---

## Current Status

**Current Phase**: Phase 0 - Enable Remote Functions
**Next Step**: Update svelte.config.js
