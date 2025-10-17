<script lang="ts">
	import Table from '$lib/ui/admin/Table.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import Calendar from '$lib/ui/Calendar.svelte'
	import { formatRelativeDate } from '$lib/utils/date'
	import { getPosts, getAccounts } from './data.remote'
	import { type PostStatus, type Platform } from '$lib/schema/social'

	let statusFilter = $state<'all' | PostStatus>('all')
	let platformFilter = $state<'all' | Platform>('all')

	// Build filter object for server-side filtering
	const filters = $derived({
		...(statusFilter !== 'all' && { status: statusFilter }),
		...(platformFilter !== 'all' && { platform: platformFilter })
	})

	const posts = $derived(await getPosts(filters))

	const calendarPosts = $derived(
		posts
			.filter((post) => post.scheduled_at !== null)
			.map((post) => ({
				id: post.id,
				contentTitle: post.content_title,
				platform: post.platform,
				scheduledAt: new Date(post.scheduled_at!)
			}))
	)

	function handlePostClick(post: any) {
		console.log('Post clicked:', post)
	}

	const statusBadgeVariant = (status: string) => {
		switch (status) {
			case 'draft':
				return 'default'
			case 'scheduled':
				return 'warning'
			case 'posted':
				return 'success'
			case 'failed':
				return 'danger'
			default:
				return 'default'
		}
	}

	const platformBadgeVariant = (platform: string) => {
		switch (platform) {
			case 'bluesky':
				return 'info'
			case 'nostr':
				return 'warning'
			case 'linkedin':
				return 'success'
			default:
				return 'default'
		}
	}
</script>

<AdminList title="Social Media Posts" newHref="/admin/social/new" newLabel="New Post">
	<!-- Quick Actions -->
	<div class="mb-4 flex gap-2">
		<Button size="sm" variant="secondary" href="/admin/social/templates">Manage Templates</Button>
		<Button size="sm" variant="secondary" href="/admin/social/accounts">Manage Accounts</Button>
	</div>

	<!-- Calendar View -->
	<div class="mb-6">
		<Calendar posts={calendarPosts} onPostClick={handlePostClick} />
	</div>

	<!-- Filters -->
	<div class="mb-4 flex gap-4">
		<div>
			<label for="status-filter" class="mb-1 block text-sm font-medium text-gray-700">Status</label>
			<select
				id="status-filter"
				bind:value={statusFilter}
				class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
			>
				<option value="all">All Statuses</option>
				<option value="draft">Draft</option>
				<option value="scheduled">Scheduled</option>
				<option value="posted">Posted</option>
				<option value="failed">Failed</option>
			</select>
		</div>
		<div>
			<label for="platform-filter" class="mb-1 block text-sm font-medium text-gray-700"
				>Platform</label
			>
			<select
				id="platform-filter"
				bind:value={platformFilter}
				class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm"
			>
				<option value="all">All Platforms</option>
				<option value="bluesky">BlueSky</option>
				<option value="nostr">Nostr</option>
				<option value="linkedin">LinkedIn</option>
			</select>
		</div>
	</div>

	<!-- List View -->
	<h3 class="mb-3 text-base font-semibold text-gray-800">All Posts</h3>
	<Table action={true} data={posts}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Content</th>
			<th scope="col" class={classes}>Platform</th>
			<th scope="col" class={classes}>Status</th>
			<th scope="col" class={classes}>Scheduled</th>
		{/snippet}
		{#snippet row(post, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				<div>{post.content_title}</div>
				<div class="mt-1 max-w-md truncate text-xs text-gray-400">{post.post_text}</div>
			</td>
			<td class={classes}>
				<Badge text={post.platform} color={platformBadgeVariant(post.platform)} />
			</td>
			<td class={classes}>
				<Badge text={post.status} color={statusBadgeVariant(post.status)} />
			</td>
			<td class={classes}>
				{#if post.scheduled_at}
					{formatRelativeDate(post.scheduled_at)}
				{:else}
					<span class="text-gray-400">Not scheduled</span>
				{/if}
			</td>
		{/snippet}
		{#snippet actionCell(post)}
			<Button size="sm" variant="secondary">Edit</Button>
			<Button size="sm" variant="error">Delete</Button>
			{#if post.status === 'scheduled' || post.status === 'draft'}
				<Button size="sm" variant="primary">Post Now</Button>
			{/if}
		{/snippet}
	</Table>
</AdminList>
