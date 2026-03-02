<script lang="ts">
	import { getProducts } from './data.remote'

	let { products } = $derived(
		await getProducts({
			sort: 'created_at',
			order: 'DESC'
		})
	)

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(cents / 100)
	}
</script>

<svelte:head>
	<title>Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-lg font-bold sm:text-xl">Merch Store</h1>
		<p class="mt-1 text-sm text-gray-500">Official Svelte Society merchandise</p>
	</div>

	{#if products.length > 0}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="merch-grid">
			{#each products as product (product.id)}
				<a
					href="/merch/{product.slug}"
					class="group grid gap-3 rounded-lg bg-zinc-50 p-4"
					data-testid="merch-card"
				>
					{#if product.images && product.images.length > 0}
						<div class="aspect-square overflow-hidden rounded-lg">
							<img
								src={product.images[0]}
								alt={product.title}
								class="h-full w-full object-cover transition-transform group-hover:scale-105"
							/>
						</div>
					{:else}
						<div
							class="flex aspect-square items-center justify-center rounded-lg bg-zinc-200 text-zinc-400"
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

					<div>
						<h2 class="font-bold group-hover:underline">
							{product.title}
						</h2>
						{#if product.description}
							<p class="mt-1 line-clamp-2 text-sm text-gray-600">{product.description}</p>
						{/if}
						<div class="mt-2 text-sm font-semibold">
							{#if product.min_price_cents !== product.max_price_cents}
								{formatPrice(product.min_price_cents)} - {formatPrice(product.max_price_cents)}
							{:else}
								{formatPrice(product.base_price_cents)}
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="rounded-lg bg-zinc-50 py-12 text-center">
			<p class="text-gray-500">No products available yet</p>
		</div>
	{/if}
</div>
