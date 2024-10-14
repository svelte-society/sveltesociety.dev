<script lang="ts">
import { page } from '$app/stores'

let { totalPages = 1 } = $props()

let currentPage = $derived(parseInt($page.url.searchParams.get('page') || '1', 10))
let visiblePages = $derived(getVisiblePages(currentPage, totalPages))

function getVisiblePages(current: number, total: number) {
	if (total <= 6) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}

	let pages = [1, total]

	if (current > 2) pages.push(current - 1)
	if (current < total - 1) pages.push(current + 1)

	pages.push(current)

	pages = [...new Set(pages)].sort((a, b) => a - b)

	if (pages[1] - pages[0] > 1) pages.splice(1, 0, '...')
	if (pages[pages.length - 1] - pages[pages.length - 2] > 1)
		pages.splice(pages.length - 1, 0, '...')

	return pages
}
</script>

<nav aria-label="Pagination" class="mt-8 flex justify-center">
	<ul class="flex items-center space-x-1">
		<li>
			<a
				href="?page={currentPage - 1}"
				class="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-500 hover:bg-gray-100 {currentPage ===
				1
					? 'pointer-events-none cursor-not-allowed opacity-50'
					: 'hover:bg-gray-50'}"
				aria-label="Previous page"
				tabindex={currentPage === 1 ? -1 : 0}
			>
				&laquo;
			</a>
		</li>

		{#each visiblePages as page}
			{#if page === '...'}
				<li class="px-2 py-1 text-gray-500">...</li>
			{:else}
				<li>
					<a
						href="?page={page}"
						class="rounded-md border border-gray-300 px-2 py-1 {page === currentPage
							? 'pointer-events-none bg-blue-500 text-white'
							: 'bg-white text-gray-500 hover:bg-gray-50'}"
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</a>
				</li>
			{/if}
		{/each}

		<li>
			<a
				href="?page={currentPage + 1}"
				class="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-500 hover:bg-gray-100 {currentPage ===
				totalPages
					? 'pointer-events-none cursor-not-allowed opacity-50'
					: 'hover:bg-gray-50'}"
				aria-label="Next page"
				tabindex={currentPage === totalPages ? -1 : 0}
			>
				&raquo;
			</a>
		</li>
	</ul>
</nav>
