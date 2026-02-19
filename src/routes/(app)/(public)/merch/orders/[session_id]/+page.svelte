<script lang="ts">
	import { page } from '$app/state'
	import { getMyOrder } from '../data.remote'

	let order = $derived(await getMyOrder({ sessionId: page.params.session_id! }))

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
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
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
	<title>Order Detail | Merch | Svelte Society</title>
</svelte:head>

{#if order}
	<div class="space-y-6">
		<nav class="text-sm text-gray-500">
			<a href="/merch" class="hover:text-orange-600">Merch</a>
			<span class="mx-2">/</span>
			<a href="/merch/orders" class="hover:text-orange-600">Orders</a>
			<span class="mx-2">/</span>
			<span class="text-gray-900">Order Detail</span>
		</nav>

		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Order Detail</h1>
				<p class="mt-1 text-sm text-gray-500">{formatDate(order.created)}</p>
			</div>
			<span class="rounded-full px-3 py-1 text-sm font-medium {statusBadge(order.fulfillmentStatus).class}">
				{statusBadge(order.fulfillmentStatus).label}
			</span>
		</div>

		<!-- Line Items -->
		<div class="rounded-xl border border-gray-200 bg-white">
			<div class="border-b border-gray-200 px-4 py-3">
				<h2 class="font-semibold text-gray-900">Items</h2>
			</div>
			<div class="divide-y divide-gray-200">
				{#each order.lineItems as item}
					<div class="flex items-center justify-between p-4">
						<div>
							<p class="font-medium text-gray-900">{item.description}</p>
							<p class="text-sm text-gray-500">Qty: {item.quantity}</p>
						</div>
						<p class="font-semibold text-gray-900">
							{formatPrice(item.amountTotal, item.currency)}
						</p>
					</div>
				{/each}
			</div>
			<div class="border-t border-gray-200 px-4 py-3">
				<div class="flex items-center justify-between font-bold text-gray-900">
					<span>Total</span>
					<span>{formatPrice(order.amount, order.currency)}</span>
				</div>
			</div>
		</div>

		<!-- Shipping Address -->
		{#if order.shippingAddress}
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<h2 class="mb-2 font-semibold text-gray-900">Shipping Address</h2>
				<p class="text-gray-600">{order.shippingAddress.name}</p>
				<p class="text-gray-600">{order.shippingAddress.line1}</p>
				{#if order.shippingAddress.line2}
					<p class="text-gray-600">{order.shippingAddress.line2}</p>
				{/if}
				<p class="text-gray-600">
					{order.shippingAddress.city}{order.shippingAddress.state
						? `, ${order.shippingAddress.state}`
						: ''}
					{order.shippingAddress.postalCode}
				</p>
				<p class="text-gray-600">{order.shippingAddress.country}</p>
			</div>
		{/if}

		<!-- Tracking -->
		{#if order.trackingNumber}
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<h2 class="mb-2 font-semibold text-gray-900">Tracking</h2>
				<p class="text-gray-600">
					Tracking Number: <code class="rounded bg-gray-100 px-2 py-0.5"
						>{order.trackingNumber}</code
					>
				</p>
			</div>
		{/if}

		<a href="/merch/orders" class="inline-block text-sm text-orange-600 hover:underline">
			&larr; Back to Orders
		</a>
	</div>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold text-gray-900">Order not found</h1>
		<p class="mt-2 text-gray-500">This order doesn't exist or you don't have access to it.</p>
		<a href="/merch/orders" class="mt-4 inline-block text-orange-600 hover:underline"
			>Back to Orders</a
		>
	</div>
{/if}
