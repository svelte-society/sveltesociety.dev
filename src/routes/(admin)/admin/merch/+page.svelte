<script lang="ts">
	import { getMerchProducts, toggleProductActive } from './data.remote'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut'
	import Power from 'phosphor-svelte/lib/Power'
	import Storefront from 'phosphor-svelte/lib/Storefront'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'

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
			currency: 'EUR'
		}).format(cents / 100)
	}
</script>

<svelte:head>
	<title>Merch Products | Admin</title>
</svelte:head>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader title="Merch Products" description="{pagination.count} total products" icon={Storefront}>
		{#snippet actions()}
			<a
				href="/admin/merch/new"
				class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
				data-testid="create-product"
			>
				New Product
			</a>
		{/snippet}
	</PageHeader>

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

	<Table action={true} data={products} emptyMessage="No products found" testId="merch-table">
		{#snippet header(classes)}
			<th class={classes}>Product</th>
			<th class={classes}>Price</th>
			<th class={classes}>Variants</th>
			<th class={classes}>Status</th>
		{/snippet}
		{#snippet row(product, classes)}
			<td class={classes}>
				<div class="flex items-center gap-3">
					{#if product.images && product.images.length > 0}
						<img
							src={product.images[0]}
							alt={product.title}
							class="h-10 w-10 rounded-lg object-cover"
						/>
					{:else}
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400"
						>
							<Storefront class="h-5 w-5" />
						</div>
					{/if}
					<div>
						<a
							href="/admin/merch/{product.id}"
							class="font-medium text-gray-900 hover:text-orange-600"
						>
							{product.title}
						</a>
						<p class="text-xs text-gray-500">/{product.slug}</p>
					</div>
				</div>
			</td>
			<td class={classes}>
				{formatPrice(product.base_price_cents)}
			</td>
			<td class={classes}>
				{product.variants.length}
			</td>
			<td class={classes}>
				<Badge color={product.active ? 'success' : 'default'} text={product.active ? 'Active' : 'Inactive'} />
			</td>
		{/snippet}
		{#snippet actionCell(product)}
			<Actions id={product.id}>
				<Action.Edit href={`/admin/merch/${product.id}`} />
				<Button
					href="https://dashboard.stripe.com/products/{product.id}"
					variant="ghost"
					size="icon"
					aria-label="View in Stripe"
					target="_blank"
					rel="noopener noreferrer"
				>
					<ArrowSquareOut class="h-5 w-5" weight="bold" />
				</Button>
				{@const toggleForm = toggleProductActive.for(product.id)}
				<form {...toggleForm} class="inline">
					<input {...toggleForm.fields.id.as('hidden', product.id)} />
					<input
						{...toggleForm.fields.active.as('hidden', product.active ? 'false' : 'true')}
					/>
					<Button
						type="submit"
						variant="ghost"
						size="icon"
						aria-label={product.active ? 'Deactivate' : 'Activate'}
					>
						<Power
							class="h-5 w-5 {product.active ? 'text-green-600' : 'text-gray-400'}"
							weight="bold"
						/>
					</Button>
				</form>
			</Actions>
		{/snippet}
	</Table>
</div>
