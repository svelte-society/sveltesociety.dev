<script lang="ts">
	import { getProducts } from './data.remote'

	let { products, catalogUnavailable } = $derived(
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

	let featured = $derived(products[0])
	let rest = $derived(products.slice(1))
</script>

<svelte:head>
	<title>Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Official</p>
		<h1 class="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Merch Store</h1>
	</div>

	{#if catalogUnavailable}
		<div
			class="border-svelte-200 bg-svelte-50 border py-16 text-center"
			data-testid="catalog-unavailable"
		>
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Unavailable</p>
			<p class="mt-2 text-lg font-black tracking-tight">
				The merch store is temporarily unavailable
			</p>
			<p class="mt-2 text-sm text-slate-500">Please try again later.</p>
		</div>
	{:else if products.length > 0}
		<!-- Featured Hero Product -->
		{#if featured}
			<a
				href="/merch/{featured.slug}"
				class="grain group relative block overflow-hidden rounded-2xl"
				data-testid="merch-card"
			>
				{#if featured.images && featured.images.length > 0}
					<div class="aspect-[4/3] sm:aspect-[16/10]">
						<img
							src={featured.images[0]}
							alt={featured.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
				{:else}
					<div class="bg-svelte-50 flex aspect-[4/3] items-center justify-center sm:aspect-[16/10]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-16 w-16 text-slate-300"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							/>
						</svg>
					</div>
				{/if}

				<!-- Gradient overlay -->
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
				></div>

				<!-- Content overlay -->
				<div class="absolute inset-x-0 bottom-0 z-[2] p-5 sm:p-8">
					<span
						class="bg-svelte-900 mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-white"
					>
						Featured
					</span>
					<h2
						class="text-2xl font-black tracking-tight text-white sm:text-3xl"
					>
						{featured.title}
					</h2>
					{#if featured.description}
						<p class="mt-2 line-clamp-2 max-w-lg text-sm text-white/80">
							{featured.description}
						</p>
					{/if}
					<p class="text-svelte-300 mt-3 text-lg font-black tabular-nums">
						{#if featured.min_price_cents !== featured.max_price_cents}
							{formatPrice(featured.min_price_cents)} – {formatPrice(featured.max_price_cents)}
						{:else}
							{formatPrice(featured.base_price_cents)}
						{/if}
					</p>
				</div>
			</a>
		{/if}

		<!-- Product Grid -->
		{#if rest.length > 0}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2" data-testid="merch-grid">
				{#each rest as product, i (product.id)}
					<a
						href="/merch/{product.slug}"
						class="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {i % 3 === 0 ? 'sm:row-span-2' : ''}"
						data-testid="merch-card"
					>
						{#if product.images && product.images.length > 0}
							<div class="{i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden">
								<img
									src={product.images[0]}
									alt={product.title}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
						{:else}
							<div
								class="bg-svelte-50 flex {i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'} items-center justify-center text-slate-300"
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

						<div class="p-5">
							<h2
								class="font-bold tracking-tight group-hover:underline"
							>
								{product.title}
							</h2>
							{#if product.description}
								<p class="mt-1.5 line-clamp-2 text-sm text-slate-500">
									{product.description}
								</p>
							{/if}
							<p class="text-svelte-900 mt-3 font-black tabular-nums">
								{#if product.min_price_cents !== product.max_price_cents}
									{formatPrice(product.min_price_cents)} – {formatPrice(product.max_price_cents)}
								{:else}
									{formatPrice(product.base_price_cents)}
								{/if}
							</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="grain rounded-2xl bg-svelte-50 py-16 text-center">
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Coming Soon</p>
			<p class="mt-2 text-lg font-black tracking-tight">No products available yet</p>
		</div>
	{/if}
</div>
