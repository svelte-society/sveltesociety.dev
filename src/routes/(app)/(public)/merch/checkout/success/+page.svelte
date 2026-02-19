<script lang="ts">
	import { page } from '$app/state'
	import { cart } from '$lib/stores/cart.svelte'
	import { browser } from '$app/environment'

	const sessionId = $derived(page.url.searchParams.get('session_id'))

	// Clear cart on successful checkout
	$effect(() => {
		if (browser && sessionId) {
			cart.clearCart()
		}
	})
</script>

<svelte:head>
	<title>Order Confirmed | Svelte Society</title>
</svelte:head>

<div class="mx-auto max-w-lg py-12 text-center">
	<div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="h-8 w-8 text-green-600"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	</div>

	<h1 class="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
	<p class="mt-3 text-gray-600">
		Thank you for your purchase! You'll receive a confirmation email shortly.
	</p>

	{#if sessionId}
		<p class="mt-2 text-sm text-gray-500">
			Order reference: <code class="rounded bg-gray-100 px-2 py-0.5 text-xs">{sessionId}</code>
		</p>
	{/if}

	<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
		<a
			href="/merch/orders"
			class="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
			data-testid="view-orders"
		>
			View My Orders
		</a>
		<a
			href="/merch"
			class="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
		>
			Continue Shopping
		</a>
	</div>
</div>
