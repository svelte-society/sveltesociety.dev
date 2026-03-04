<script lang="ts">
	import { getCart, createMerchCheckout } from './cart.remote'
	import CartItem from './CartItem.svelte'
	import Button from '$lib/ui/Button.svelte'

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

<div class="space-y-8">
	<!-- Header -->
	<div>
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Your</p>
		<h1 class="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Shopping Cart</h1>
		<p class="mt-2 text-sm text-slate-400">
			{cartData.summary.itemCount} item{cartData.summary.itemCount !== 1 ? 's' : ''}
			<span class="mx-1.5 text-slate-200">|</span>
			<a href="/merch" class="text-svelte-900 font-medium hover:underline">Continue shopping</a>
		</p>
	</div>

	{#if createMerchCheckout.result && !createMerchCheckout.result.success}
		<div
			class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
			data-testid="cart-error"
		>
			{createMerchCheckout.result.text}
		</div>
	{/if}

	{#if cartData.items.length > 0}
		<!-- Cart Items -->
		<div class="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
			{#each cartData.items as item (item.product_id + '-' + item.variant_id)}
				<CartItem {item} {formatPrice} />
			{/each}
		</div>

		<!-- Order Summary -->
		<div class="grain rounded-2xl bg-svelte-50 p-6 sm:p-8">
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Order Summary</p>

			<div class="mt-4 flex items-baseline justify-between">
				<span class="text-sm font-medium text-slate-500">Total</span>
				<span class="text-svelte-900 text-2xl font-black tabular-nums" data-testid="cart-total"
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
				class="mt-6"
			>
				<Button
					type="submit"
					variant="primary"
					size="lg"
					width="full"
					disabled={!!createMerchCheckout.pending}
					data-testid="checkout-button"
				>
					{createMerchCheckout.pending ? 'Processing...' : 'Proceed to Checkout'}
				</Button>
			</form>

			<p class="mt-3 text-center text-xs text-slate-400">
				Secure payment via Stripe
			</p>
		</div>
	{:else}
		<div class="grain rounded-2xl bg-svelte-50 py-16 text-center">
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Empty</p>
			<p class="mt-2 text-lg font-black tracking-tight">Your cart is empty</p>
			<div class="mt-6">
				<Button href="/merch" variant="primary" size="lg">Browse Merch</Button>
			</div>
		</div>
	{/if}
</div>
