<script lang="ts">
	import { page } from '$app/state'
	import { getProducts } from './data.remote'

	let searchQuery = $state('')
	let sortBy = $state('created_at')
	let inStockOnly = $state(false)

	let { products, count } = $derived(
		await getProducts({
			query: searchQuery || undefined,
			in_stock: inStockOnly || undefined,
			sort: sortBy,
			order: 'DESC'
		})
	)

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100)
	}
</script>

<svelte:head>
	<title>Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Merch Store</h1>
		<p class="mt-1 text-gray-500">Official Svelte Society merchandise</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<input
			type="text"
			placeholder="Search merch..."
			bind:value={searchQuery}
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
			data-testid="merch-search"
		/>

		<select
			bind:value={sortBy}
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
			data-testid="merch-sort"
		>
			<option value="created_at">Newest</option>
			<option value="base_price_cents">Price</option>
			<option value="title">Name</option>
		</select>

		<label class="flex items-center gap-2 text-sm text-gray-600">
			<input
				type="checkbox"
				bind:checked={inStockOnly}
				class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
				data-testid="merch-in-stock"
			/>
			In stock only
		</label>

		<span class="text-sm text-gray-500">{count} product{count !== 1 ? 's' : ''}</span>
	</div>

	{#if products.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="merch-grid">
			{#each products as product (product.id)}
				<a
					href="/merch/{product.slug}"
					class="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
					data-testid="merch-card"
				>
					{#if product.images && product.images.length > 0}
						<div class="aspect-square overflow-hidden bg-gray-100">
							<img
								src={product.images[0]}
								alt={product.title}
								class="h-full w-full object-cover transition-transform group-hover:scale-105"
							/>
						</div>
					{:else}
						<div
							class="flex aspect-square items-center justify-center bg-gray-100 text-gray-400"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-12 w-12"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
								/>
							</svg>
						</div>
					{/if}

					<div class="p-4">
						<h2 class="font-semibold text-gray-900 group-hover:text-orange-600">
							{product.title}
						</h2>
						{#if product.description}
							<p class="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
						{/if}
						<div class="mt-2 flex items-center justify-between">
							<span class="text-lg font-bold text-gray-900">
								{#if product.min_price_cents !== product.max_price_cents}
									{formatPrice(product.min_price_cents)} - {formatPrice(product.max_price_cents)}
								{:else}
									{formatPrice(product.base_price_cents)}
								{/if}
							</span>
							{#if product.in_stock}
								<span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
									>In Stock</span
								>
							{:else}
								<span
									class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
									>Out of Stock</span
								>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white py-12 text-center">
			<p class="text-gray-500">No products found</p>
		</div>
	{/if}
</div>
