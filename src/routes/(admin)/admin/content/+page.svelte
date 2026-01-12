<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Table from '$lib/ui/admin/Table.svelte'
	import type { Content } from '$lib/types/content'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass'
	import ArrowsClockwise from 'phosphor-svelte/lib/ArrowsClockwise'
	import StatusSelect from '$lib/ui/admin/StatusSelect.svelte'
	import TypeSelect from '$lib/ui/admin/TypeSelect.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { getFilteredContent, refreshMetadata, deleteContent } from './data.remote'
	import FileText from 'phosphor-svelte/lib/FileText'

	const REFRESHABLE_TYPES = ['video', 'library', 'resource']

	function canRefreshMetadata(type: string): boolean {
		return REFRESHABLE_TYPES.includes(type)
	}

	let searchQuery = $state(page.url.searchParams.get('search') || '')
	let selectedStatus = $state(page.url.searchParams.get('status') || 'all')
	let selectedType = $state(page.url.searchParams.get('type') || '')
	let currentPage = $state(parseInt(page.url.searchParams.get('page') || '1'))

	let debounceTimer: ReturnType<typeof setTimeout> | null = null
	let debouncedSearch = $state(page.url.searchParams.get('search') || '')

	function handleSearchInput(value: string) {
		searchQuery = value

		if (debounceTimer) {
			clearTimeout(debounceTimer)
		}

		debounceTimer = setTimeout(() => {
			debouncedSearch = value
			currentPage = 1
			updateURL()
		}, 300)
	}

	function handleStatusChange(value: string) {
		selectedStatus = value
		currentPage = 1
		updateURL()
	}

	function handleTypeChange(value: string) {
		selectedType = value
		currentPage = 1
		updateURL()
	}

	function updateURL() {
		const params = new URLSearchParams()
		if (debouncedSearch) params.set('search', debouncedSearch)
		if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus)
		if (selectedType) params.set('type', selectedType)
		if (currentPage > 1) params.set('page', currentPage.toString())

		goto(`?${params.toString()}`, { replaceState: true, noScroll: true, keepFocus: true })
	}

	const { content, pagination } = $derived(
		await getFilteredContent({
			search: debouncedSearch || undefined,
			type: (selectedType || undefined) as
				| 'video'
				| 'library'
				| 'announcement'
				| 'collection'
				| 'recipe'
				| 'resource'
				| undefined,
			status: (selectedStatus || 'all') as 'draft' | 'pending_review' | 'published' | 'archived' | 'all',
			page: currentPage
		})
	)

	let colorMap = new Map([
		['pending_review', 'warning'],
		['draft', 'warning'],
		['published', 'success'],
		['archived', 'danger']
	])

	function getStatusColor(status: string): string {
		return colorMap.get(status) || 'default'
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Content Management"
		description="Create, edit, and manage all content items"
		icon={FileText}
	>
		{#snippet actions()}
			<a
				href="/admin/content/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Content
			</a>
		{/snippet}
	</PageHeader>

	<div class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<MagnifyingGlass class="h-5 w-5 text-gray-500" />
			</div>
			<input
				type="text"
				value={searchQuery}
				oninput={(e) => handleSearchInput(e.currentTarget.value)}
				placeholder="Search content..."
				class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-svelte-500 focus:ring-2 focus:ring-svelte-500 focus:ring-offset-0 sm:text-sm"
			/>
		</div>

		<div class="w-full sm:w-48">
			<TypeSelect value={selectedType} onchange={handleTypeChange} />
		</div>

		<div class="w-full sm:w-48">
			<StatusSelect value={selectedStatus} onchange={handleStatusChange} />
		</div>
	</div>

	{#if content}
		<Table action={true} data={content} emptyMessage="No content found matching your search.">
			{#snippet header(classes)}
				<th scope="col" class={classes}>Title</th>
				<th scope="col" class={[classes, 'text-center']}>Status</th>
				<th scope="col" class={classes}>Type</th>
				<th scope="col" class={classes}>Description</th>
				<th scope="col" class={classes}>Created</th>
			{/snippet}
			{#snippet row(item: Content, classes)}
				<td class="whitespace-nowrap {classes} font-medium text-gray-900">
					<a href={`/admin/content/${item.id}`} data-testid="content-edit-link">
						<div data-testid="content-title-text">{item.title.length > 50 ? item.title.slice(0, 50) + '...' : item.title}</div>
					</a>
				</td>
				<td class={classes}
					><a href={`/admin/content/${item.id}`}>
						<Badge color={getStatusColor(item.status)} text={item.status} />
					</a></td
				>
				<td class={classes}>
					<a
						href={`/admin/content/${item.id}`}
						class="group relative flex items-center justify-center"
					>
						<div class="type-icon-wrapper text-gray-600">
							<TypeIcon type={item.type} />
						</div>
						<div
							class="pointer-events-none absolute bottom-full mb-2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white capitalize opacity-0 transition-opacity group-hover:opacity-100"
						>
							{item.type}
						</div>
					</a>
				</td>
				<td class={classes}>
					<a href={`/admin/content/${item.id}`} class="line-clamp-2">
						{item.description || ''}
					</a>
				</td>
				<td class={classes}>
					<a href={`/admin/content/${item.id}`}>
						{formatRelativeDate(item.created_at || '')}
					</a>
				</td>
			{/snippet}
			{#snippet actionCell(item: Content)}
				<Actions id={item.id}>
					<Action.Edit href={`/admin/content/${item.id}`} />
					{#if canRefreshMetadata(item.type)}
						<Action.Button
							icon={ArrowsClockwise}
							form={refreshMetadata}
							variant="info"
							tooltip="Refresh metadata"
							testId="refresh-metadata-button"
						/>
					{/if}
					<Action.Delete
						form={deleteContent}
						confirm={`Are you sure you want to delete "${item.title}"?`}
					/>
				</Actions>
			{/snippet}
		</Table>

		{#if pagination}
			<Pagination count={pagination.count} perPage={pagination.perPage} />
		{/if}
	{/if}
</div>

<style>
	.type-icon-wrapper :global(svg) {
		width: 24px;
		height: 24px;
	}
</style>
