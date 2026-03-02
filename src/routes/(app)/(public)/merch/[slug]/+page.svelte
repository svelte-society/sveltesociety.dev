<script lang="ts">
	import { page } from '$app/state'
	import { getProduct, getCartSummary, addToCart } from './data.remote'

	let product = $derived(await getProduct({ slug: page.params.slug! }))
	let cartSummary = $derived(await getCartSummary())

	let quantity = $state(1)

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
	<div class="space-y-8">
		<nav class="text-sm text-gray-500">
			<a href="/merch" class="hover:underline">Merch</a>
			<span class="mx-2">/</span>
			<span class="font-medium text-gray-900">{product.title}</span>
		</nav>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Images -->
			<div class="space-y-3">
				{#if product.images && product.images.length > 0}
					<div class="aspect-square overflow-hidden rounded-lg bg-zinc-100">
						<img
							src={product.images[0]}
							alt={product.title}
							class="h-full w-full object-cover"
						/>
					</div>
					{#if product.images.length > 1}
						<div class="grid grid-cols-4 gap-2">
							{#each product.images.slice(1) as image}
								<div class="aspect-square overflow-hidden rounded-lg bg-zinc-100">
									<img src={image} alt={product.title} class="h-full w-full object-cover" />
								</div>
							{/each}
						</div>
					{/if}
				{:else}
					<div
						class="flex aspect-square items-center justify-center rounded-lg bg-zinc-100 text-zinc-400"
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
					<h1 class="text-2xl font-bold sm:text-3xl">{product.title}</h1>
					{#if product.description}
						<p class="mt-2 text-gray-600" data-testid="product-description">
							{product.description}
						</p>
					{/if}
				</div>

				{#if product.marketing_features && product.marketing_features.length > 0}
					<ul class="space-y-1.5" data-testid="marketing-features">
						{#each product.marketing_features as feature}
							<li class="flex items-start gap-2 text-sm text-gray-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="mt-0.5 h-4 w-4 shrink-0 text-green-500"
								>
									<path
										fill-rule="evenodd"
										d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
										clip-rule="evenodd"
									/>
								</svg>
								{feature}
							</li>
						{/each}
					</ul>
				{/if}

				<div class="text-2xl font-bold">
					{formatPrice(product.base_price_cents)}
				</div>

				<form {...addToCart}>
					<div class="space-y-5">
						<input {...addToCart.fields.slug.as('hidden', page.params.slug!)} />
						<input {...addToCart.fields.quantity.as('hidden', String(quantity))} />

						{#if product.variant_options && product.variant_options.length > 0}
							<div class="space-y-4">
								{#each product.variant_options as option}
									<fieldset>
										<legend class="mb-2 block text-sm font-medium">{option.name}</legend>
										<div class="flex flex-wrap gap-2">
											{#each option.values as value, i}
												<label
													class="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm transition-colors hover:bg-zinc-200 has-[:checked]:bg-zinc-900 has-[:checked]:text-white"
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
							<label class="mb-2 block text-sm font-medium">Quantity</label>
							<div class="flex items-center gap-2">
								<button
									type="button"
									class="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200"
									onclick={() => {
										if (quantity > 1) quantity--
									}}
									data-testid="quantity-minus"
								>
									-
								</button>
								<span
									class="w-10 text-center font-medium"
									data-testid="quantity-display">{quantity}</span
								>
								<button
									type="button"
									class="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200"
									onclick={() => quantity++}
									data-testid="quantity-plus"
								>
									+
								</button>
							</div>
						</div>

						<div class="space-y-3">
							<button
								type="submit"
								class="bg-svelte-900 hover:bg-svelte-500 w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
							</button>

							{#if addToCart.result && !addToCart.result.success}
								<p class="text-sm text-red-600">{addToCart.result.text}</p>
							{/if}

							{#if cartSummary.itemCount > 0}
								<a
									href="/merch/cart"
									class="block w-full rounded-lg bg-zinc-100 px-6 py-3 text-center font-semibold transition-colors hover:bg-zinc-200"
									data-testid="view-cart"
								>
									View Cart ({cartSummary.itemCount})
								</a>
							{/if}
						</div>
					</div>
				</form>
			</div>
		</div>

		<!-- Size Guide -->
		{#if product.size_guide && product.size_guide.headers.length > 0}
			<div class="space-y-3" data-testid="size-guide">
				<h2 class="text-lg font-semibold">Size Guide</h2>
				<div class="overflow-hidden rounded-lg border border-zinc-200">
					<table class="w-full text-left text-sm">
						<thead class="bg-zinc-50">
							<tr>
								{#each product.size_guide.headers as header}
									<th class="px-4 py-2.5 font-medium text-zinc-700">{header}</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-200">
							{#each product.size_guide.rows as row}
								<tr>
									{#each row as cell, i}
										<td class="px-4 py-2 {i === 0 ? 'font-medium' : 'text-zinc-600'}">{cell}</td>
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
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold">Product not found</h1>
		<p class="mt-2 text-gray-500">The product you're looking for doesn't exist.</p>
		<a href="/merch" class="mt-4 inline-block hover:underline">Back to Merch</a>
	</div>
{/if}
