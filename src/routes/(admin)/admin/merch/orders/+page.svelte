<script lang="ts">
	import { getMerchFulfillments, syncAllActiveFulfillments } from './data.remote'

	let statusFilter = $state('all')
	let isSyncing = $state(false)

	let { fulfillments, pagination } = $derived(
		await getMerchFulfillments({
			status: statusFilter !== 'all' ? statusFilter : undefined,
			page: 1
		})
	)

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
				return { class: 'bg-gray-100 text-gray-600', label: status }
		}
	}

	async function handleSyncAll() {
		isSyncing = true
		try {
			await syncAllActiveFulfillments()
		} finally {
			isSyncing = false
		}
	}
</script>

<svelte:head>
	<title>Orders | Merch | Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Merch Orders</h1>
			<p class="mt-1 text-sm text-gray-500">{pagination.count} total orders</p>
		</div>
		<button
			type="button"
			class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
			disabled={isSyncing}
			onclick={handleSyncAll}
			data-testid="sync-all"
		>
			{isSyncing ? 'Syncing...' : 'Sync All from Styria'}
		</button>
	</div>

	<div class="flex items-center gap-3">
		<select
			bind:value={statusFilter}
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
			data-testid="status-filter"
		>
			<option value="all">All Statuses</option>
			<option value="pending">Pending</option>
			<option value="submitted">Submitted</option>
			<option value="in_production">In Production</option>
			<option value="shipped">Shipped</option>
			<option value="delivered">Delivered</option>
			<option value="cancelled">Cancelled</option>
			<option value="refunded">Refunded</option>
		</select>
	</div>

	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-200 bg-gray-50">
				<tr>
					<th class="px-4 py-3 font-medium text-gray-700">Date</th>
					<th class="px-4 py-3 font-medium text-gray-700">Customer</th>
					<th class="px-4 py-3 font-medium text-gray-700">Stripe Session</th>
					<th class="px-4 py-3 font-medium text-gray-700">Styria Order</th>
					<th class="px-4 py-3 font-medium text-gray-700">Status</th>
					<th class="px-4 py-3 font-medium text-gray-700">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each fulfillments as fulfillment (fulfillment.id)}
					<tr class="hover:bg-gray-50">
						<td class="px-4 py-3 text-gray-700">
							{formatDate(fulfillment.created_at)}
						</td>
						<td class="px-4 py-3">
							<div>
								<p class="font-medium text-gray-900">{fulfillment.userName}</p>
								<p class="text-xs text-gray-500">{fulfillment.userEmail}</p>
							</div>
						</td>
						<td class="px-4 py-3">
							<code class="text-xs text-gray-500">
								{fulfillment.stripe_checkout_session_id.slice(0, 20)}...
							</code>
						</td>
						<td class="px-4 py-3 text-gray-700">
							{fulfillment.styria_order_id || '-'}
						</td>
						<td class="px-4 py-3">
							{@const badge = statusBadge(fulfillment.fulfillment_status)}
							<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {badge.class}">
								{badge.label}
							</span>
						</td>
						<td class="px-4 py-3">
							<a
								href="/admin/merch/orders/{fulfillment.id}"
								class="text-sm text-orange-600 hover:text-orange-700"
							>
								View
							</a>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-8 text-center text-gray-500">No orders found</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
