<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte'
	import { createMerchCheckout } from './cart.remote'
	import { goto } from '$app/navigation'

	let isCheckingOut = $state(false)
	let error = $state('')

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100)
	}

	async function handleCheckout() {
		if (cart.items.length === 0) return

		isCheckingOut = true
		error = ''

		try {
			const result = await createMerchCheckout.submit({
				items: cart.items.map((item) => ({
					productId: item.productId,
					variantId: item.variantId,
					stripePriceId: item.stripePriceId,
					quantity: item.quantity
				}))
			})

			if (result.data?.success && result.data.url) {
				window.location.href = result.data.url
			} else {
				error = result.data?.text || 'Checkout failed'
			}
		} catch (e) {
			error = 'An error occurred during checkout'
		} finally {
			isCheckingOut = false
		}
	}
</script>

<svelte:head>
	<title>Cart | Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Shopping Cart</h1>
		<p class="mt-1 text-gray-500">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart</p>
	</div>

	{#if error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" data-testid="cart-error">
			{error}
		</div>
	{/if}

	{#if cart.items.length > 0}
		<div class="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
			{#each cart.items as item (item.productId + '-' + item.variantId)}
				<div class="flex items-center gap-4 p-4" data-testid="cart-item">
					{#if item.image}
						<div class="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
							<img src={item.image} alt={item.productTitle} class="h-full w-full object-cover" />
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						<h3 class="font-medium text-gray-900">{item.productTitle}</h3>
						<p class="text-sm text-gray-500">{item.variantLabel}</p>
						<p class="font-semibold text-gray-900">{formatPrice(item.priceCents)}</p>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
							onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity - 1)}
						>
							-
						</button>
						<span class="w-8 text-center text-sm">{item.quantity}</span>
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
							onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity + 1)}
						>
							+
						</button>
					</div>

					<div class="text-right">
						<p class="font-semibold text-gray-900">
							{formatPrice(item.priceCents * item.quantity)}
						</p>
						<button
							type="button"
							class="mt-1 text-sm text-red-600 hover:text-red-700"
							onclick={() => cart.removeItem(item.productId, item.variantId)}
							data-testid="cart-remove"
						>
							Remove
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-6">
			<div class="flex items-center justify-between text-lg font-bold text-gray-900">
				<span>Total</span>
				<span data-testid="cart-total">{formatPrice(cart.total)}</span>
			</div>

			<button
				type="button"
				class="mt-4 w-full rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isCheckingOut}
				onclick={handleCheckout}
				data-testid="checkout-button"
			>
				{#if isCheckingOut}
					Processing...
				{:else}
					Proceed to Checkout
				{/if}
			</button>

			<p class="mt-3 text-center text-sm text-gray-500">
				You'll be redirected to Stripe for secure payment
			</p>
		</div>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white py-12 text-center">
			<p class="text-gray-500">Your cart is empty</p>
			<a href="/merch" class="mt-4 inline-block text-orange-600 hover:underline">Browse Merch</a>
		</div>
	{/if}
</div>
