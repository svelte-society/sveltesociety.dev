<script lang="ts">
	import Table from '$lib/ui/admin/Table.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import Calendar from '$lib/ui/Calendar.svelte'
	import { formatRelativeDate } from '$lib/utils/date'

	// Mock data for initial UI
	const mockPosts = [
		{
			id: '1',
			contentTitle: 'Getting Started with Svelte 5',
			platform: 'bluesky',
			status: 'scheduled',
			scheduledAt: new Date('2025-10-15T10:00:00'),
			postText:
				'Check out this amazing guide to Svelte 5! Learn about the new runes system and how it makes reactive code even easier. https://sveltesociety.dev/recipes/getting-started'
		},
		{
			id: '2',
			contentTitle: 'Advanced State Management',
			platform: 'nostr',
			status: 'draft',
			scheduledAt: null,
			postText: 'Master state management in Svelte 5 with this comprehensive guide.'
		},
		{
			id: '3',
			contentTitle: 'Component Best Practices',
			platform: 'linkedin',
			status: 'posted',
			scheduledAt: null,
			postText:
				'Component best practices for Svelte developers. Learn how to build reusable, maintainable components.'
		},
		{
			id: '4',
			contentTitle: 'SvelteKit Routing Guide',
			platform: 'bluesky',
			status: 'scheduled',
			scheduledAt: new Date('2025-10-16T14:30:00'),
			postText: 'Everything you need to know about routing in SvelteKit!'
		},
		{
			id: '5',
			contentTitle: 'Form Handling Tutorial',
			platform: 'nostr',
			status: 'failed',
			scheduledAt: null,
			postText: 'Learn how to handle forms effectively in Svelte 5.'
		},
		{
			id: '6',
			contentTitle: 'Server-Side Rendering Tips',
			platform: 'linkedin',
			status: 'scheduled',
			scheduledAt: new Date('2025-10-18T09:00:00'),
			postText: 'Optimize your SvelteKit app with these SSR best practices.'
		},
		{
			id: '7',
			contentTitle: 'Animation with Svelte Motion',
			platform: 'bluesky',
			status: 'scheduled',
			scheduledAt: new Date('2025-10-20T15:00:00'),
			postText: 'Create stunning animations in Svelte with ease!'
		}
	]

	let statusFilter = $state('all')
	let platformFilter = $state('all')

	const filteredPosts = $derived(
		mockPosts.filter((post) => {
			if (statusFilter !== 'all' && post.status !== statusFilter) return false
			if (platformFilter !== 'all' && post.platform !== platformFilter) return false
			return true
		})
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
				return 'error'
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
	<!-- Calendar View -->
	<div class="mb-6">
		<Calendar posts={mockPosts} onPostClick={handlePostClick} />
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
	<Table action={true} data={filteredPosts}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Content</th>
			<th scope="col" class={classes}>Platform</th>
			<th scope="col" class={classes}>Status</th>
			<th scope="col" class={classes}>Scheduled</th>
		{/snippet}
		{#snippet row(post, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				<div>{post.contentTitle}</div>
				<div class="mt-1 max-w-md truncate text-xs text-gray-400">{post.postText}</div>
			</td>
			<td class={classes}>
				<Badge variant={platformBadgeVariant(post.platform)}>
					{post.platform}
				</Badge>
			</td>
			<td class={classes}>
				<Badge variant={statusBadgeVariant(post.status)}>
					{post.status}
				</Badge>
			</td>
			<td class={classes}>
				{#if post.scheduledAt}
					{formatRelativeDate(post.scheduledAt.toISOString())}
				{:else}
					<span class="text-gray-400">Not scheduled</span>
				{/if}
			</td>
		{/snippet}
		{#snippet actionCell(post)}
			<Button size="sm" variant="outline">Edit</Button>
			<Button size="sm" variant="outline">Delete</Button>
			{#if post.status === 'scheduled' || post.status === 'draft'}
				<Button size="sm" variant="primary">Post Now</Button>
			{/if}
		{/snippet}
	</Table>
</AdminList>
