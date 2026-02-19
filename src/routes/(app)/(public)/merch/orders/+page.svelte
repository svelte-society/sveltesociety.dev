<script lang="ts">
	import { getMyOrders } from './data.remote'

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
				return { class: 'bg-yellow-100 text-yellow-700', label: 'Pending' }
			case 'submitted':
				return { class: 'bg-blue-100 text-blue-700', label: 'Submitted' }
			case 'in_production':
				return { class: 'bg-purple-100 text-purple-700', label: 'In Production' }
			case 'shipped':
				return { class: 'bg-green-100 text-green-700', label: 'Shipped' }
			case 'delivered':
				return { class: 'bg-green-100 text-green-700', label: 'Delivered' }
			case 'cancelled':
				return { class: 'bg-red-100 text-red-700', label: 'Cancelled' }
			case 'refunded':
				return { class: 'bg-gray-100 text-gray-700', label: 'Refunded' }
			default:
				return { class: 'bg-gray-100 text-gray-600', label: 'Processing' }
		}
	}
</script>

<svelte:head>
	<title>My Orders | Merch | Svelte Society</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
		<p class="mt-1 text-gray-500">Track your merch orders</p>
	</div>

	{#if !authenticated}
		<div class="rounded-lg border border-gray-200 bg-white py-12 text-center">
			<p class="text-gray-500">Please log in to view your orders</p>
		</div>
	{:else if orders.length > 0}
		<div class="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white" data-testid="orders-list">
			{#each orders as order (order.sessionId)}
				<a
					href="/merch/orders/{order.sessionId}"
					class="flex items-center justify-between p-4 transition-colors hover:bg-gray-50"
					data-testid="order-row"
				>
					<div>
						<p class="font-medium text-gray-900">
							{formatDate(order.created)}
						</p>
						<p class="text-sm text-gray-500">
							{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
						</p>
					</div>

					<div class="flex items-center gap-4">
						{@const badge = statusBadge(order.fulfillmentStatus)}
						<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {badge.class}">
							{badge.label}
						</span>
						<span class="font-semibold text-gray-900">
							{formatPrice(order.amount, order.currency)}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-5 w-5 text-gray-400"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
						</svg>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white py-12 text-center">
			<p class="text-gray-500">No orders yet</p>
			<a href="/merch" class="mt-4 inline-block text-orange-600 hover:underline">Browse Merch</a>
		</div>
	{/if}
</div>
