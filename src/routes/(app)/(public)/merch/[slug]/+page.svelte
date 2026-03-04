<script lang="ts">
	import { page } from '$app/state'
	import { getProduct, getCartSummary, addToCart } from './data.remote'
	import Button from '$lib/ui/Button.svelte'

	let product = $derived(await getProduct({ slug: page.params.slug! }))
	let cartSummary = $derived(await getCartSummary())

	let quantity = $state(1)
	let selectedImage = $state(0)

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(cents / 100)
	}
</script>

<svelte:head>
	<title>{product?.title || 'Product'} | Merch | Svelte Society</title>
</svelte:head>

{#if product}
	<div class="space-y-10">
		<!-- Breadcrumb -->
		<nav class="flex items-center gap-2 text-sm">
			<a href="/merch" class="text-svelte-900 hover:underline">Merch</a>
			<span class="text-slate-300">/</span>
			<span class="font-medium text-slate-900">{product.title}</span>
		</nav>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Gallery -->
			<div class="space-y-3">
				{#if product.images && product.images.length > 0}
					<div class="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-50">
						<img
							src={product.images[selectedImage]}
							alt={product.title}
							class="h-full w-full object-cover"
						/>
					</div>
					{#if product.images.length > 1}
						<div class="grid grid-cols-4 gap-2">
							{#each product.images as image, i (image)}
								<button
									type="button"
									class="aspect-square overflow-hidden rounded-xl bg-slate-50 transition-all {selectedImage === i ? 'ring-svelte-900 ring-2' : 'ring-1 ring-slate-100 hover:ring-slate-300'}"
									onclick={() => (selectedImage = i)}
								>
									<img src={image} alt={product.title} class="h-full w-full object-cover" />
								</button>
							{/each}
						</div>
					{/if}
				{:else}
					<div
						class="flex aspect-[4/5] items-center justify-center rounded-2xl bg-slate-50 text-slate-300"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-20 w-20"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							/>
						</svg>
					</div>
				{/if}
			</div>

			<!-- Product Info -->
			<div class="space-y-6">
				<div>
					<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">
						Svelte Society
					</p>
					<h1 class="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{product.title}</h1>
					{#if product.description}
						<p class="mt-3 leading-relaxed text-slate-500" data-testid="product-description">
							{product.description}
						</p>
					{/if}
				</div>

				{#if product.marketing_features && product.marketing_features.length > 0}
					<ul class="space-y-2" data-testid="marketing-features">
						{#each product.marketing_features as feature}
							<li class="flex items-start gap-2.5 text-sm text-slate-600">
								<span class="bg-svelte-900 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"></span>
								{feature}
							</li>
						{/each}
					</ul>
				{/if}

				<p class="text-svelte-900 text-3xl font-black tabular-nums">
					{formatPrice(product.base_price_cents)}
				</p>

				<form
				{...addToCart.enhance(async ({ submit }) => {
					await submit()
				})}
			>
					<div class="space-y-5">
						<input {...addToCart.fields.slug.as('hidden', page.params.slug!)} />
						<input {...addToCart.fields.quantity.as('hidden', String(quantity))} />

						{#if product.variant_options && product.variant_options.length > 0}
							<div class="space-y-5">
								{#each product.variant_options as option (option.name)}
									<fieldset>
										<legend class="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-slate-500"
											>{option.name}</legend
										>
										<div class="flex flex-wrap gap-2">
											{#each option.values as value, i (value)}
												<label
													class="cursor-pointer rounded-full border-2 border-slate-200 px-4 py-2 text-sm font-medium transition-all hover:border-slate-400 has-[:checked]:border-svelte-900 has-[:checked]:bg-svelte-900 has-[:checked]:text-white"
													data-testid="variant-option-{option.name.toLowerCase()}-{value.toLowerCase()}"
												>
													<input
														{...addToCart.fields.options[option.name].as('radio', value)}
														checked={i === 0}
														class="sr-only"
													/>
													{value}
												</label>
											{/each}
										</div>
									</fieldset>
								{/each}
							</div>
						{/if}

						<!-- Quantity -->
						<div>
							<span
								class="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-slate-500"
								>Quantity</span
							>
							<div
								class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-1 py-1"
							>
								<button
									type="button"
									class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
									onclick={() => {
										if (quantity > 1) quantity--
									}}
									data-testid="quantity-minus"
								>
									−
								</button>
								<span
									class="w-8 text-center text-sm font-bold tabular-nums"
									data-testid="quantity-display">{quantity}</span
								>
								<button
									type="button"
									class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
									onclick={() => quantity++}
									data-testid="quantity-plus"
								>
									+
								</button>
							</div>
						</div>

						<div class="space-y-3">
							<Button
								type="submit"
								variant="primary"
								size="lg"
								width="full"
								disabled={!!addToCart.pending}
								data-testid="add-to-cart"
							>
								{#if addToCart.pending}
									Adding...
								{:else if addToCart.result?.success}
									Added to Cart!
								{:else}
									Add to Cart
								{/if}
							</Button>

							{#if addToCart.result && !addToCart.result.success}
								<p class="text-center text-sm text-red-600">{addToCart.result.text}</p>
							{/if}

							{#if cartSummary.itemCount > 0}
								<Button
									href="/merch/cart"
									variant="secondary"
									size="lg"
									width="full"
									data-testid="view-cart"
								>
									View Cart ({cartSummary.itemCount})
								</Button>
							{/if}
						</div>
					</div>
				</form>
			</div>
		</div>

		<!-- Size Guide -->
		{#if product.size_guide && product.size_guide.headers.length > 0}
			<div class="space-y-4" data-testid="size-guide">
				<h2 class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Size Guide</h2>
				<div class="overflow-hidden rounded-2xl border border-slate-100">
					<table class="w-full text-left text-sm">
						<thead>
							<tr class="bg-slate-50">
								{#each product.size_guide.headers as header}
									<th class="px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-slate-500"
										>{header}</th
									>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each product.size_guide.rows as row, rowIndex}
								<tr class={rowIndex % 2 === 1 ? 'bg-slate-50/50' : ''}>
									{#each row as cell, i}
										<td class="px-4 py-2.5 {i === 0 ? 'font-semibold' : 'text-slate-500'}"
											>{cell}</td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="py-16 text-center">
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Not Found</p>
		<h1 class="mt-2 text-2xl font-black tracking-tight">Product not found</h1>
		<p class="mt-3 text-slate-500">The product you're looking for doesn't exist.</p>
		<a
			href="/merch"
			class="text-svelte-900 mt-6 inline-block text-sm font-medium hover:underline"
			>&larr; Back to Merch</a
		>
	</div>
{/if}
