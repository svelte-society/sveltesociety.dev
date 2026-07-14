<script lang="ts">
	import { page } from '$app/state'
	import {
		getMerchFulfillment,
		syncStyriaStatus,
		updateFulfillmentStatus,
		setFulfillmentTracking
	} from '../data.remote'

	let fulfillment = $derived(await getMerchFulfillment({ id: page.params.id! }))

	let trackingNumber = $state('')
	let newStatus = $state('')

	$effect(() => {
		if (fulfillment) {
			trackingNumber = fulfillment.shipping_tracking_number || ''
			newStatus = fulfillment.fulfillment_status
		}
	})

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

	function formatPrice(cents: number | null, currency?: string): string {
		if (cents == null) return '$0.00'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency || 'usd'
		}).format(cents / 100)
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
				return { class: 'bg-gray-100 text-gray-600', label: status }
		}
	}

	async function handleSyncStatus() {
		if (!fulfillment) return
		await syncStyriaStatus({ id: fulfillment.id })
	}

	async function handleUpdateStatus() {
		if (!fulfillment) return
		await updateFulfillmentStatus({ id: fulfillment.id, status: newStatus })
	}

	async function handleSetTracking() {
		if (!fulfillment || !trackingNumber) return
		await setFulfillmentTracking({ id: fulfillment.id, trackingNumber })
	}
</script>

<svelte:head>
	<title>Order Detail | Merch | Admin</title>
</svelte:head>

{#if fulfillment}
	<div class="space-y-6">
		<nav class="text-sm text-gray-500">
			<a href="/admin/merch/orders" class="hover:text-orange-600">Merch Orders</a>
			<span class="mx-2">/</span>
			<span class="text-gray-900">Fulfillment Detail</span>
		</nav>

		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Fulfillment Detail</h1>
				<p class="mt-1 text-sm text-gray-500">{formatDate(fulfillment.created_at)}</p>
			</div>
			<span class="rounded-full px-3 py-1 text-sm font-medium {statusBadge(fulfillment.fulfillment_status).class}">
				{statusBadge(fulfillment.fulfillment_status).label}
			</span>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Left column -->
			<div class="space-y-6">
				<!-- Customer Info -->
				<div class="rounded-xl border border-gray-200 bg-white p-4">
					<h2 class="mb-3 font-semibold text-gray-900">Customer</h2>
					<p class="text-gray-700">{fulfillment.userName}</p>
					<p class="text-sm text-gray-500">{fulfillment.userEmail}</p>
					<p class="mt-2 text-xs text-gray-400">User ID: {fulfillment.user_id}</p>
				</div>

				<!-- Line Items -->
				{#if fulfillment.sessionDetails?.lineItems}
					<div class="rounded-xl border border-gray-200 bg-white p-4">
						<h2 class="mb-3 font-semibold text-gray-900">Items</h2>
						<div class="divide-y divide-gray-200">
							{#each fulfillment.sessionDetails.lineItems as item}
								<div class="flex justify-between py-2">
									<div>
										<p class="text-gray-900">{item.description}</p>
										<p class="text-sm text-gray-500">Qty: {item.quantity}</p>
									</div>
									<p class="font-medium">{formatPrice(item.amountTotal)}</p>
								</div>
							{/each}
						</div>
						<div class="mt-2 border-t border-gray-200 pt-2">
							<div class="flex justify-between font-bold text-gray-900">
								<span>Total</span>
								<span>
									{formatPrice(
										fulfillment.sessionDetails.amount,
										fulfillment.sessionDetails.currency ?? undefined
									)}
								</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- Shipping Address -->
				{#if fulfillment.sessionDetails?.shippingAddress}
					<div class="rounded-xl border border-gray-200 bg-white p-4">
						<h2 class="mb-3 font-semibold text-gray-900">Shipping Address</h2>
						<p>{fulfillment.sessionDetails.shippingAddress.name}</p>
						<p>{fulfillment.sessionDetails.shippingAddress.line1}</p>
						{#if fulfillment.sessionDetails.shippingAddress.line2}
							<p>{fulfillment.sessionDetails.shippingAddress.line2}</p>
						{/if}
						<p>
							{fulfillment.sessionDetails.shippingAddress.city}, {fulfillment.sessionDetails
								.shippingAddress.state}
							{fulfillment.sessionDetails.shippingAddress.postalCode}
						</p>
						<p>{fulfillment.sessionDetails.shippingAddress.country}</p>
					</div>
				{/if}
			</div>

			<!-- Right column -->
			<div class="space-y-6">
				<!-- IDs -->
				<div class="rounded-xl border border-gray-200 bg-white p-4">
					<h2 class="mb-3 font-semibold text-gray-900">References</h2>
					<dl class="space-y-2 text-sm">
						<div>
							<dt class="text-gray-500">Fulfillment ID</dt>
							<dd class="font-mono text-gray-900">{fulfillment.id}</dd>
						</div>
						<div>
							<dt class="text-gray-500">Stripe Session</dt>
							<dd class="break-all font-mono text-gray-900">
								{fulfillment.stripe_checkout_session_id}
							</dd>
						</div>
						<div>
							<dt class="text-gray-500">Styria Order ID</dt>
							<dd class="font-mono text-gray-900">{fulfillment.styria_order_id || 'Not submitted'}</dd>
						</div>
					</dl>
				</div>

				<!-- Status Management -->
				<div class="rounded-xl border border-gray-200 bg-white p-4">
					<h2 class="mb-3 font-semibold text-gray-900">Status Management</h2>

					<div class="space-y-3">
						<div class="flex items-center gap-2">
							<select
								bind:value={newStatus}
								class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
								data-testid="status-select"
							>
								<option value="pending">Pending</option>
								<option value="submitted">Submitted</option>
								<option value="in_production">In Production</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
								<option value="cancelled">Cancelled</option>
								<option value="refunded">Refunded</option>
							</select>
							<button
								type="button"
								class="rounded bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
								onclick={handleUpdateStatus}
								data-testid="update-status"
							>
								Update
							</button>
						</div>

						{#if fulfillment.styria_order_id}
							<button
								type="button"
								class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
								onclick={handleSyncStatus}
								data-testid="sync-status"
							>
								Sync from Styria
							</button>
						{/if}
					</div>
				</div>

				<!-- Tracking -->
				<div class="rounded-xl border border-gray-200 bg-white p-4">
					<h2 class="mb-3 font-semibold text-gray-900">Tracking</h2>
					<div class="flex items-center gap-2">
						<input
							type="text"
							bind:value={trackingNumber}
							placeholder="Tracking number"
							class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
							data-testid="tracking-input"
						/>
						<button
							type="button"
							class="rounded bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
							onclick={handleSetTracking}
							data-testid="save-tracking"
						>
							Save
						</button>
					</div>
				</div>

				<!-- Timeline -->
				<div class="rounded-xl border border-gray-200 bg-white p-4">
					<h2 class="mb-3 font-semibold text-gray-900">Timeline</h2>
					<dl class="space-y-2 text-sm">
						<div>
							<dt class="text-gray-500">Created</dt>
							<dd class="text-gray-900">{formatDate(fulfillment.created_at)}</dd>
						</div>
						<div>
							<dt class="text-gray-500">Last Updated</dt>
							<dd class="text-gray-900">{formatDate(fulfillment.updated_at)}</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold text-gray-900">Fulfillment not found</h1>
		<a href="/admin/merch/orders" class="mt-4 inline-block text-orange-600 hover:underline">Back to Orders</a>
	</div>
{/if}
