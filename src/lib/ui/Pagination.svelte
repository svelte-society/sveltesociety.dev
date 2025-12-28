<script lang="ts">
	import { page } from '$app/state'

	let {
		/**
		 * The total number of items to paginate
		 */
		count = 100,

		/**
		 * The number of items to show per page
		 */
		perPage = 10,

		/**
		 * The number of sibling pages to show on either side of the current page
		 */
		siblingCount = 1,

		/**
		 * Whether to preserve existing URL parameters when navigating
		 */
		preserveParams = true
	} = $props()

	// Get the current page from the URL
	let currentPage = $derived(parseInt(page.url.searchParams.get('page') || '1', 10))

	// Calculate total pages and range for display
	let totalPages = $derived(Math.ceil(count / perPage))
	let rangeStart = $derived((currentPage - 1) * perPage + 1)
	let rangeEnd = $derived(Math.min(currentPage * perPage, count))

	// Calculate which page numbers to show
	let pages = $derived.by(() => {
		const result: (number | 'ellipsis')[] = []

		// Always show first page
		result.push(1)

		// Calculate the range around current page
		const leftSibling = Math.max(2, currentPage - siblingCount)
		const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount)

		// Add left ellipsis if needed
		if (leftSibling > 2) {
			result.push('ellipsis')
		}

		// Add pages around current
		for (let i = leftSibling; i <= rightSibling; i++) {
			if (i !== 1 && i !== totalPages) {
				result.push(i)
			}
		}

		// Add right ellipsis if needed
		if (rightSibling < totalPages - 1) {
			result.push('ellipsis')
		}

		// Always show last page (if more than 1 page)
		if (totalPages > 1) {
			result.push(totalPages)
		}

		return result
	})

	// Build href for a given page number
	function getPageHref(pageNum: number): string {
		const url = new URL(page.url)
		if (!preserveParams) {
			url.search = ''
		}
		url.searchParams.set('page', String(pageNum))
		return url.pathname + url.search
	}
</script>

<!--
@component
A pagination component using native links for navigation.

- Uses anchor tags for SEO and progressive enhancement
- Preserves URL parameters when navigating between pages
- Styled with custom Svelte colors

Usage:
```svelte
<Pagination count={100} perPage={10} />
```
-->

<nav aria-label="Pagination">
	<div class="my-8 flex items-center justify-center">
		{#if currentPage > 1}
			<a
				href={getPageHref(currentPage - 1)}
				class="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 active:scale-[0.98]"
				aria-label="Previous page"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			</a>
		{:else}
			<span
				class="mr-4 inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 opacity-50"
				aria-disabled="true"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			</span>
		{/if}

		<div class="flex items-center gap-2">
			{#each pages as item, index (item === 'ellipsis' ? `ellipsis-${index}` : item)}
				{#if item === 'ellipsis'}
					<span class="text-sm font-medium text-gray-500 select-none">...</span>
				{:else if item === currentPage}
					<span
						class="border-svelte-900 bg-svelte-900 inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium text-white select-none"
						aria-current="page"
					>
						{item}
					</span>
				{:else}
					<a
						href={getPageHref(item)}
						class="inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium select-none hover:bg-gray-50 active:scale-[0.98]"
					>
						{item}
					</a>
				{/if}
			{/each}
		</div>

		{#if currentPage < totalPages}
			<a
				href={getPageHref(currentPage + 1)}
				class="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 active:scale-[0.98]"
				aria-label="Next page"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</a>
		{:else}
			<span
				class="ml-4 inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 opacity-50"
				aria-disabled="true"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</span>
		{/if}
	</div>
	<p class="text-center text-sm text-gray-500">
		{#if count > 0}
			Showing {rangeStart} - {rangeEnd} of {count}
		{:else}
			No items to display
		{/if}
	</p>
</nav>
