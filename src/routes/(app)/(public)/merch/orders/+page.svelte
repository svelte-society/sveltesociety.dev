<script lang="ts">
	import { getMyOrders } from './data.remote'
	import Button from '$lib/ui/Button.svelte'

	let { orders, authenticated } = $derived(await getMyOrders())

	function formatPrice(cents: number | null, currency: string | null): string {
		if (cents == null) return '$0.00'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency || 'usd'
		}).format(cents / 100)
	}

	function formatDate(iso: string): string {
		if (!iso) return ''
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}

	function statusBadge(status: string): { class: string; label: string } {
		switch (status) {
			case 'pending':
				return {
					class: 'border-yellow-200 bg-yellow-50 text-yellow-700',
					label: 'Pending'
				}
			case 'submitted':
				return {
					class: 'border-blue-200 bg-blue-50 text-blue-700',
					label: 'Submitted'
				}
			case 'in_production':
				return {
					class: 'border-purple-200 bg-purple-50 text-purple-700',
					label: 'In Production'
				}
			case 'shipped':
				return {
					class: 'border-green-200 bg-green-50 text-green-700',
					label: 'Shipped'
				}
			case 'delivered':
				return {
					class: 'border-green-200 bg-green-50 text-green-700',
					label: 'Delivered'
				}
			case 'cancelled':
				return { class: 'border-red-200 bg-red-50 text-red-700', label: 'Cancelled' }
			case 'refunded':
				return {
					class: 'border-slate-200 bg-slate-50 text-slate-600',
					label: 'Refunded'
				}
			default:
				return {
					class: 'border-slate-200 bg-slate-50 text-slate-600',
					label: 'Processing'
				}
		}
	}
</script>

<svelte:head>
	<title>My Orders | Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Your</p>
		<h1 class="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Orders</h1>
		<p class="mt-2 text-sm text-slate-400">Track your merch orders</p>
	</div>

	{#if !authenticated}
		<div class="grain rounded-2xl bg-svelte-50 py-16 text-center">
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Sign In</p>
			<p class="mt-2 text-lg font-black tracking-tight">Please log in to view your orders</p>
		</div>
	{:else if orders.length > 0}
		<div class="space-y-3" data-testid="orders-list">
			{#each orders as order (order.sessionId)}
				<a
					href="/merch/orders/{order.sessionId}"
					class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
					data-testid="order-row"
				>
					<div>
						<p class="font-bold tracking-tight">
							{formatDate(order.created)}
						</p>
						<p class="mt-0.5 text-sm text-slate-400">
							{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
						</p>
					</div>

					<div class="flex items-center gap-4">
						<span
							class="rounded-full border px-3 py-1 text-xs font-medium {statusBadge(order.fulfillmentStatus).class}"
						>
							{statusBadge(order.fulfillmentStatus).label}
						</span>
						<span class="font-black tabular-nums">
							{formatPrice(order.amount, order.currency)}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="grain rounded-2xl bg-svelte-50 py-16 text-center">
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Nothing Yet</p>
			<p class="mt-2 text-lg font-black tracking-tight">No orders yet</p>
			<div class="mt-6">
				<Button href="/merch" variant="primary" size="lg">Browse Merch</Button>
			</div>
		</div>
	{/if}
</div>
