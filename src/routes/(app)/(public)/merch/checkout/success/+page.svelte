<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'

	const sessionId = $derived(page.url.searchParams.get('session_id'))
</script>

<svelte:head>
	<title>Order Confirmed | Svelte Society</title>
</svelte:head>

<div class="relative mx-auto max-w-lg py-16 text-center">
	<!-- Decorative dots -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="bg-svelte-100 absolute top-4 left-8 h-3 w-3 rounded-full opacity-60"></div>
		<div class="bg-svelte-300 absolute top-12 right-12 h-2 w-2 rounded-full opacity-50"></div>
		<div class="bg-svelte-100 absolute top-20 left-1/4 h-4 w-4 rounded-full opacity-40"></div>
		<div class="bg-svelte-300 absolute right-8 bottom-24 h-2.5 w-2.5 rounded-full opacity-50"></div>
		<div class="bg-svelte-100 absolute bottom-16 left-12 h-2 w-2 rounded-full opacity-60"></div>
		<div class="bg-svelte-300 absolute top-8 right-1/3 h-3.5 w-3.5 rounded-full opacity-30"></div>
	</div>

	<!-- Checkmark -->
	<div
		class="animate-scale-in bg-svelte-100 mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke="currentColor"
			class="text-svelte-900 h-10 w-10"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	</div>

	<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Thank You</p>
	<h1 class="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Order Confirmed!</h1>
	<p class="mt-4 leading-relaxed text-slate-500">
		Your purchase is on its way. You'll receive a confirmation email shortly.
	</p>

	{#if sessionId}
		<p class="mt-3 text-sm text-slate-400">
			Reference: <code class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium"
				>{sessionId}</code
			>
		</p>
	{/if}

	<div class="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
		<Button href="/merch/orders" variant="primary" size="lg" data-testid="view-orders">
			View My Orders
		</Button>
		<Button href="/merch" variant="secondary" size="lg">
			Continue Shopping
		</Button>
	</div>
</div>
