<script lang="ts">
	import { page } from '$app/state'
	import { formatRelativeDate } from '$lib/utils/date'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import ShareNetwork from 'phosphor-svelte/lib/ShareNetwork'
	import Copy from 'phosphor-svelte/lib/Copy'
	import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank'
	import GearSix from 'phosphor-svelte/lib/GearSix'
	import Robot from 'phosphor-svelte/lib/Robot'
	import FileText from 'phosphor-svelte/lib/FileText'
	import ChartBar from 'phosphor-svelte/lib/ChartBar'
	import { getPosts, deletePost, duplicatePost } from './data.remote'
	import { POST_STATUS_CONFIG, POST_TYPE_CONFIG, PLATFORM_CONFIG } from '$lib/types/social'
	import type { SocialPostStatus, SocialPostType, SocialPlatform } from '$lib/types/social'

	// Fetch data using URL search params
	const sp = $derived(page.url.searchParams)
	const filters = $derived({
		search: sp.get('search') || undefined,
		status: (sp.get('status') || 'all') as 'draft' | 'scheduled' | 'published' | 'failed' | 'all',
		post_type: (sp.get('post_type') || 'all') as 'content' | 'sponsor' | 'job' | 'custom' | 'all',
		platform: (sp.get('platform') || 'all') as 'twitter' | 'bluesky' | 'linkedin' | 'all',
		page: parseInt(sp.get('page') || '1')
	})
	const { posts, pagination } = $derived(await getPosts(filters))

	// Form reference for auto-submit
	let form: HTMLFormElement
	let debounceTimer: ReturnType<typeof setTimeout> | null = null

	function submitForm() {
		form.requestSubmit()
	}

	function debouncedSubmit() {
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(submitForm, 300)
	}

	const statusOptions = [
		{ value: '', label: 'All Statuses' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'scheduled', label: 'Scheduled' },
		{ value: 'published', label: 'Published' },
		{ value: 'failed', label: 'Failed' }
	]

	const typeOptions = [
		{ value: '', label: 'All Types' },
		{ value: 'content', label: 'Content' },
		{ value: 'sponsor', label: 'Sponsor' },
		{ value: 'job', label: 'Job' },
		{ value: 'custom', label: 'Custom' }
	]

	const platformOptions = [
		{ value: '', label: 'All Platforms' },
		{ value: 'twitter', label: 'Twitter/X' },
		{ value: 'bluesky', label: 'Bluesky' },
		{ value: 'linkedin', label: 'LinkedIn' }
	]

	function getStatusColor(status: SocialPostStatus): string {
		return POST_STATUS_CONFIG[status]?.color || 'default'
	}

	function getTypeColor(type: SocialPostType): string {
		return POST_TYPE_CONFIG[type]?.color || 'default'
	}

	function getPlatformBadges(platforms: { platform: SocialPlatform; status: string }[]) {
		return platforms.map((p) => ({
			platform: p.platform,
			label: PLATFORM_CONFIG[p.platform]?.label || p.platform,
			color: p.status === 'published' ? 'success' : p.status === 'failed' ? 'danger' : 'default'
		}))
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Social Posts"
		description="Manage social media posts for Twitter/X, Bluesky, and LinkedIn"
		icon={ShareNetwork}
	>
		{#snippet actions()}
			<a
				href="/admin/social/analytics"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="analytics-button"
			>
				<ChartBar class="h-4 w-4" weight="bold" />
				Analytics
			</a>
			<a
				href="/admin/social/templates"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="templates-button"
			>
				<FileText class="h-4 w-4" weight="bold" />
				Templates
			</a>
			<a
				href="/admin/social/rules"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="rules-button"
			>
				<Robot class="h-4 w-4" weight="bold" />
				Rules
			</a>
			<a
				href="/admin/social/settings"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="settings-button"
			>
				<GearSix class="h-4 w-4" weight="bold" />
				Settings
			</a>
			<a
				href="/admin/social/calendar"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="calendar-button"
			>
				<CalendarBlank class="h-4 w-4" weight="bold" />
				Calendar
			</a>
			<a
				href="/admin/social/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90"
				data-testid="new-post-button"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Post
			</a>
		{/snippet}
	</PageHeader>

	<!-- Filter Form (auto-submits on change) -->
	<form bind:this={form} class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto]">
		<Input
			name="search"
			type="text"
			value={page.url.searchParams.get('search') || ''}
			oninput={debouncedSubmit}
			placeholder="Search posts..."
		/>

		<Select
			name="status"
			options={statusOptions}
			value={page.url.searchParams.get('status') || ''}
			onchange={submitForm}
		/>

		<Select
			name="post_type"
			options={typeOptions}
			value={page.url.searchParams.get('post_type') || ''}
			onchange={submitForm}
		/>

		<Select
			name="platform"
			options={platformOptions}
			value={page.url.searchParams.get('platform') || ''}
			onchange={submitForm}
		/>

		{#if page.url.search}
			<a href={page.url.pathname} class="self-center text-sm text-gray-500 hover:text-gray-700">
				Clear filters
			</a>
		{/if}
	</form>

	<!-- Table -->
	{#if posts}
		<Table action={true} data={posts} testId="social-posts-table" emptyMessage="No social posts found">
			{#snippet header(classes)}
				<th class={classes}>Title</th>
				<th class={[classes, 'text-center']}>Type</th>
				<th class={[classes, 'text-center']}>Status</th>
				<th class={classes}>Platforms</th>
				<th class={classes}>Scheduled</th>
				<th class={classes}>Created</th>
			{/snippet}
			{#snippet row(post: typeof posts[number], classes: string)}
				<td class="{classes} font-medium">
					<a
						href={`/admin/social/${post.id}`}
						class="hover:text-svelte-500"
						data-testid="post-edit-link"
					>
						{post.title}
					</a>
				</td>
				<td class={[classes, 'text-center']}>
					<Badge color={getTypeColor(post.post_type)} text={POST_TYPE_CONFIG[post.post_type]?.label || post.post_type} />
				</td>
				<td class={[classes, 'text-center']}>
					<Badge color={getStatusColor(post.status)} text={POST_STATUS_CONFIG[post.status]?.label || post.status} />
				</td>
				<td class={classes}>
					<div class="flex flex-wrap gap-1">
						{#each getPlatformBadges(post.platforms) as badge}
							<span
								class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium"
								class:bg-green-100={badge.color === 'success'}
								class:text-green-800={badge.color === 'success'}
								class:bg-red-100={badge.color === 'danger'}
								class:text-red-800={badge.color === 'danger'}
								class:bg-gray-100={badge.color === 'default'}
								class:text-gray-800={badge.color === 'default'}
							>
								{badge.label}
							</span>
						{/each}
					</div>
				</td>
				<td class={classes}>
					{#if post.scheduled_at}
						{formatRelativeDate(post.scheduled_at)}
					{:else}
						<span class="text-gray-400">—</span>
					{/if}
				</td>
				<td class={classes}>
					{formatRelativeDate(post.created_at)}
				</td>
			{/snippet}
			{#snippet actionCell(post: typeof posts[number])}
				<Actions id={post.id}>
					<Action.Edit href={`/admin/social/${post.id}`} />
					<Action.Button
						icon={Copy}
						tooltip="Duplicate"
						form={duplicatePost}
					/>
					<Action.Delete form={deletePost} confirm={`Delete "${post.title}"?`} />
				</Actions>
			{/snippet}
		</Table>

		{#if posts.length === 0}
			<div class="mt-8 text-center">
				<p class="text-gray-500">No posts found.</p>
				<a
					href="/admin/social/new"
					class="mt-4 inline-flex items-center gap-2 text-svelte-500 hover:underline"
				>
					<Plus class="h-4 w-4" />
					Create your first post
				</a>
			</div>
		{/if}

		{#if pagination}
			<Pagination count={pagination.count} perPage={pagination.perPage} />
		{/if}
	{/if}
</div>
