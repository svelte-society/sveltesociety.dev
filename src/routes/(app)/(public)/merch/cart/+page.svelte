<script lang="ts">
	import { getCart, createMerchCheckout } from './cart.remote'
	import CartItem from './CartItem.svelte'

	let cartData = $derived(await getCart())

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(cents / 100)
	}
</script>

<svelte:head>
	<title>Cart | Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-lg font-bold sm:text-xl">Shopping Cart</h1>
		<p class="mt-1 text-sm text-gray-500">
			{cartData.summary.itemCount} item{cartData.summary.itemCount !== 1 ? 's' : ''} in your cart
		</p>
	</div>

	{#if createMerchCheckout.result && !createMerchCheckout.result.success}
		<div
			class="rounded-lg bg-red-50 p-4 text-sm text-red-700"
			data-testid="cart-error"
		>
			{createMerchCheckout.result.text}
		</div>
	{/if}

	{#if cartData.items.length > 0}
		<div class="divide-y divide-zinc-200 rounded-lg bg-zinc-50">
			{#each cartData.items as item (item.product_id + '-' + item.variant_id)}
				<CartItem {item} {formatPrice} />
			{/each}
		</div>

		<div class="rounded-lg bg-zinc-50 p-6">
			<div class="flex items-center justify-between font-bold">
				<span>Total</span>
				<span class="text-lg" data-testid="cart-total"
					>{formatPrice(cartData.summary.totalCents)}</span
				>
			</div>

			<form
				{...createMerchCheckout.enhance(async ({ submit }) => {
					await submit()
					if (createMerchCheckout.result?.success && createMerchCheckout.result?.url) {
						window.location.href = createMerchCheckout.result.url
					}
				})}
				class="mt-4"
			>
				<button
					type="submit"
					class="bg-svelte-900 hover:bg-svelte-500 w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
					disabled={!!createMerchCheckout.pending}
					data-testid="checkout-button"
				>
					{createMerchCheckout.pending ? 'Processing...' : 'Proceed to Checkout'}
				</button>
			</form>

			<p class="mt-3 text-center text-xs text-gray-500">
				You'll be redirected to Stripe for secure payment
			</p>
		</div>
	{:else}
		<div class="rounded-lg bg-zinc-50 py-12 text-center">
			<p class="text-gray-500">Your cart is empty</p>
			<a href="/merch" class="mt-4 inline-block hover:underline">Browse Merch</a>
		</div>
	{/if}
</div>
