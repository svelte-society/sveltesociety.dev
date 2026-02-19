<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { getMerchProducts, toggleProductActive } from './data.remote'

	let searchQuery = $state('')
	let activeFilter = $state('all')

	let { products, pagination } = $derived(
		await getMerchProducts({
			query: searchQuery || undefined,
			active: activeFilter !== 'all' ? activeFilter : undefined,
			page: 1
		})
	)

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100)
	}

	async function handleToggleActive(id: string, active: boolean) {
		await toggleProductActive({ id, active: !active })
	}
</script>

<svelte:head>
	<title>Merch Products | Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Merch Products</h1>
			<p class="mt-1 text-sm text-gray-500">{pagination.count} total products</p>
		</div>
		<a
			href="/admin/merch/new"
			class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
			data-testid="create-product"
		>
			New Product
		</a>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<input
			type="text"
			placeholder="Search products..."
			bind:value={searchQuery}
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
			data-testid="admin-merch-search"
		/>

		<select
			bind:value={activeFilter}
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
			data-testid="admin-merch-active-filter"
		>
			<option value="all">All</option>
			<option value="true">Active</option>
			<option value="false">Inactive</option>
		</select>
	</div>

	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-200 bg-gray-50">
				<tr>
					<th class="px-4 py-3 font-medium text-gray-700">Product</th>
					<th class="px-4 py-3 font-medium text-gray-700">Price</th>
					<th class="px-4 py-3 font-medium text-gray-700">Variants</th>
					<th class="px-4 py-3 font-medium text-gray-700">Status</th>
					<th class="px-4 py-3 font-medium text-gray-700">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each products as product (product.id)}
					<tr class="hover:bg-gray-50">
						<td class="px-4 py-3">
							<div class="flex items-center gap-3">
								{#if product.images && product.images.length > 0}
									<img
										src={product.images[0]}
										alt={product.title}
										class="h-10 w-10 rounded-lg object-cover"
									/>
								{:else}
									<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
											<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
										</svg>
									</div>
								{/if}
								<div>
									<a href="/admin/merch/{product.id}" class="font-medium text-gray-900 hover:text-orange-600">
										{product.title}
									</a>
									<p class="text-xs text-gray-500">/{product.slug}</p>
								</div>
							</div>
						</td>
						<td class="px-4 py-3 text-gray-700">
							{formatPrice(product.base_price_cents)}
						</td>
						<td class="px-4 py-3 text-gray-700">
							{product.variants.length}
						</td>
						<td class="px-4 py-3">
							{#if product.active}
								<span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>
							{:else}
								<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Inactive</span>
							{/if}
						</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-2">
								<a
									href="/admin/merch/{product.id}"
									class="text-sm text-orange-600 hover:text-orange-700"
								>
									Edit
								</a>
								<button
									type="button"
									class="text-sm text-gray-500 hover:text-gray-700"
									onclick={() => handleToggleActive(product.id, product.active)}
								>
									{product.active ? 'Deactivate' : 'Activate'}
								</button>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-4 py-8 text-center text-gray-500">No products found</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
