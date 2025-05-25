<script lang="ts">
	import { Pagination } from 'bits-ui'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

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
	let currentPage = $derived(parseInt($page.url.searchParams.get('page') || '1', 10))
	
	// Calculate the actual range for display
	let rangeStart = $derived((currentPage - 1) * perPage + 1)
	let rangeEnd = $derived(Math.min(currentPage * perPage, count))

	// Function to handle page change
	function handlePageChange(pageNum: number) {
		if (preserveParams) {
			const url = new URL($page.url)
			url.searchParams.set('page', pageNum.toString())
			goto(url.toString(), { replaceState: false })
		} else {
			goto(`?page=${pageNum}`, { replaceState: false })
		}
	}
</script>

<!--
@component
A pagination component built with Bits UI.

- Uses the Bits UI Pagination component
- Preserves URL parameters when navigating between pages
- Styled with custom Svelte colors
- Uses SvelteKit's goto for client-side navigation

Usage:
```svelte
<Pagination count={100} perPage={10} />
```
-->

<Pagination.Root
	{count}
	{perPage}
	{siblingCount}
	page={currentPage}
	onPageChange={handlePageChange}
>
	{#snippet children({ pages, range })}
		<div class="my-8 flex items-center justify-center">
			<Pagination.PrevButton
				class="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
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
			</Pagination.PrevButton>

			<div class="flex items-center gap-2">
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<div class="text-sm font-medium text-gray-500 select-none">...</div>
					{:else}
						<Pagination.Page
							{page}
							class="data-selected:border-svelte-900 data-selected:bg-svelte-900 inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium select-none hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-selected:text-white"
						>
							{page.value}
						</Pagination.Page>
					{/if}
				{/each}
			</div>

			<Pagination.NextButton
				class="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
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
			</Pagination.NextButton>
		</div>
		<p class="text-center text-sm text-gray-500">
			{#if count > 0}
				Showing {rangeStart} - {rangeEnd} of {count}
			{:else}
				No items to display
			{/if}
		</p>
	{/snippet}
</Pagination.Root>
