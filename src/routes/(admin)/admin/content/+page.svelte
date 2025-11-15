<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Table from '$lib/ui/admin/Table.svelte'
	import type { Content } from '$lib/types/content'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass'
	import StatusSelect from '$lib/ui/admin/StatusSelect.svelte'
	import TypeSelect from '$lib/ui/admin/TypeSelect.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { getFilteredContent } from './data.remote'
	import FileText from 'phosphor-svelte/lib/FileText'

	// Filter state from URL
	let searchQuery = $state(page.url.searchParams.get('search') || '')
	let selectedStatus = $state(page.url.searchParams.get('status') || 'all')
	let selectedType = $state(page.url.searchParams.get('type') || '')
	let currentPage = $state(parseInt(page.url.searchParams.get('page') || '1'))

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout> | null = null
	let debouncedSearch = $state(page.url.searchParams.get('search') || '')

	// Handle search input with debounce
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

	// Handle filter changes
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

	// Update URL with current filters
	function updateURL() {
		const params = new URLSearchParams()
		if (debouncedSearch) params.set('search', debouncedSearch)
		if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus)
		if (selectedType) params.set('type', selectedType)
		if (currentPage > 1) params.set('page', currentPage.toString())

		goto(`?${params.toString()}`, { replaceState: true, noScroll: true, keepFocus: true })
	}

	// Use remote function
	const { content, pagination } = $derived(
		await getFilteredContent({
			search: debouncedSearch || undefined,
			type: (selectedType || undefined) as
				| 'video'
				| 'library'
				| 'announcement'
				| 'collection'
				| 'recipe'
				| undefined,
			status: (selectedStatus || 'all') as 'draft' | 'published' | 'archived' | 'all',
			page: currentPage
		})
	)

	let colorMap = new Map([
		['draft', 'warning'],
		['published', 'success'],
		['archived', 'danger']
	])

	function getStatusColor(status: string): string {
		return colorMap.get(status) || 'default'
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<!-- Hero Header -->
	<div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-svelte-500 via-svelte-300 to-svelte-100 p-8 shadow-lg">
		<div class="relative z-10">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
						<FileText class="h-7 w-7 text-svelte-500" weight="duotone" />
					</div>
					<div>
						<h1 class="text-3xl font-bold text-white">Content Management</h1>
						<p class="mt-1 text-sm text-white/90">
							Create, edit, and manage all content items
						</p>
					</div>
				</div>
				<Button size="sm" href="/admin/content/new"><Plus weight="bold" />New Content</Button>
			</div>
		</div>
		<div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
	</div>

	<!-- Filters -->
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
		<Table action={true} data={content}>
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
						<div class="mt-1 text-xs text-gray-400">
							{item.slug.length > 50 ? item.slug.slice(0, 50) + '...' : item.slug}
						</div>
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
				<Actions route="content" id={item.id} canDelete={true} canEdit={true} type={item.title} />
			{/snippet}
		</Table>

		{#if content.length === 0}
			<div class="mt-8 text-center">
				<p class="text-gray-500">No content found matching your search.</p>
			</div>
		{/if}

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
