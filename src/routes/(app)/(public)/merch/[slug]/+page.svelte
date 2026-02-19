<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { getProduct } from './data.remote'
	import { cart } from '$lib/stores/cart.svelte'

	let product = $derived(await getProduct({ slug: page.params.slug }))

	let selectedOptions = $state<Record<string, string>>({})
	let quantity = $state(1)
	let addedToCart = $state(false)

	// Initialize selected options from first variant
	$effect(() => {
		if (product?.variant_options && Object.keys(selectedOptions).length === 0) {
			const initial: Record<string, string> = {}
			for (const opt of product.variant_options) {
				if (opt.values.length > 0) {
					initial[opt.name] = opt.values[0]
				}
			}
			selectedOptions = initial
		}
	})

	const selectedVariant = $derived(() => {
		if (!product?.variants) return null
		return product.variants.find((v) => {
			return Object.entries(selectedOptions).every(
				([key, value]) => v.option_values[key] === value
			)
		}) || null
	})

	const currentPrice = $derived(() => {
		const variant = selectedVariant()
		if (variant?.price_cents != null) return variant.price_cents
		return product?.base_price_cents || 0
	})

	const isInStock = $derived(() => {
		const variant = selectedVariant()
		if (!variant) return false
		return variant.stock_quantity > 0 && variant.active
	})

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100)
	}

	function handleAddToCart() {
		const variant = selectedVariant()
		if (!variant || !product || !isInStock()) return

		cart.addItem(
			{
				productId: product.id,
				variantId: variant.id,
				productTitle: product.title,
				variantLabel: variant.label,
				image: product.images?.[0] || '',
				priceCents: variant.price_cents ?? product.base_price_cents,
				stripePriceId: variant.stripe_price_id || ''
			},
			quantity
		)

		addedToCart = true
		setTimeout(() => {
			addedToCart = false
		}, 2000)
	}
</script>

<svelte:head>
	<title>{product?.title || 'Product'} | Merch | Svelte Society</title>
</svelte:head>

{#if product}
	<div class="space-y-8">
		<nav class="text-sm text-gray-500">
			<a href="/merch" class="hover:text-orange-600">Merch</a>
			<span class="mx-2">/</span>
			<span class="text-gray-900">{product.title}</span>
		</nav>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Images -->
			<div class="space-y-4">
				{#if product.images && product.images.length > 0}
					<div class="aspect-square overflow-hidden rounded-xl bg-gray-100">
						<img
							src={product.images[0]}
							alt={product.title}
							class="h-full w-full object-cover"
						/>
					</div>
					{#if product.images.length > 1}
						<div class="grid grid-cols-4 gap-2">
							{#each product.images.slice(1) as image}
								<div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
									<img src={image} alt={product.title} class="h-full w-full object-cover" />
								</div>
							{/each}
						</div>
					{/if}
				{:else}
					<div
						class="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-400"
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
					<h1 class="text-3xl font-bold text-gray-900">{product.title}</h1>
					{#if product.description}
						<p class="mt-2 text-gray-600">{product.description}</p>
					{/if}
				</div>

				<div class="text-3xl font-bold text-gray-900">
					{formatPrice(currentPrice())}
				</div>

				<!-- Variant Selectors -->
				{#if product.variant_options && product.variant_options.length > 0}
					<div class="space-y-4">
						{#each product.variant_options as option}
							<div>
								<label class="mb-2 block text-sm font-medium text-gray-700"
									>{option.name}</label
								>
								<div class="flex flex-wrap gap-2">
									{#each option.values as value}
										<button
											type="button"
											class="rounded-lg border px-4 py-2 text-sm transition-colors {selectedOptions[
												option.name
											] === value
												? 'border-orange-500 bg-orange-50 text-orange-700'
												: 'border-gray-300 text-gray-700 hover:border-gray-400'}"
											onclick={() => {
												selectedOptions = { ...selectedOptions, [option.name]: value }
											}}
											data-testid="variant-option-{option.name.toLowerCase()}-{value.toLowerCase()}"
										>
											{value}
										</button>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Quantity -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50"
							onclick={() => {
								if (quantity > 1) quantity--
							}}
							data-testid="quantity-minus"
						>
							-
						</button>
						<span class="w-12 text-center text-lg font-medium" data-testid="quantity-display"
							>{quantity}</span
						>
						<button
							type="button"
							class="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50"
							onclick={() => quantity++}
							data-testid="quantity-plus"
						>
							+
						</button>
					</div>
				</div>

				<!-- Add to Cart -->
				<div class="space-y-3">
					<button
						type="button"
						class="w-full rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!isInStock()}
						onclick={handleAddToCart}
						data-testid="add-to-cart"
					>
						{#if addedToCart}
							Added to Cart!
						{:else if isInStock()}
							Add to Cart
						{:else}
							Out of Stock
						{/if}
					</button>

					{#if cart.itemCount > 0}
						<a
							href="/merch/cart"
							class="block w-full rounded-lg border border-gray-300 px-6 py-3 text-center text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-50"
							data-testid="view-cart"
						>
							View Cart ({cart.itemCount})
						</a>
					{/if}
				</div>

				<!-- Stock Info -->
				{#if selectedVariant()}
					<p class="text-sm text-gray-500">
						{#if selectedVariant()?.stock_quantity > 0}
							{selectedVariant()?.stock_quantity} in stock
						{:else}
							Out of stock
						{/if}
					</p>
				{/if}
			</div>
		</div>

		<!-- Body content -->
		{#if product.rendered_body}
			<div class="prose max-w-none">
				{@html product.rendered_body}
			</div>
		{/if}
	</div>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
		<p class="mt-2 text-gray-500">The product you're looking for doesn't exist.</p>
		<a href="/merch" class="mt-4 inline-block text-orange-600 hover:underline">Back to Merch</a>
	</div>
{/if}
