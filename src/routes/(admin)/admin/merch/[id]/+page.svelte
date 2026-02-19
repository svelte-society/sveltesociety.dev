<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import {
		getMerchProduct,
		updateMerchProduct,
		createVariant,
		updateVariant,
		deleteVariant
	} from '../data.remote'

	let product = $derived(await getMerchProduct({ id: page.params.id }))

	// Edit product state
	let editTitle = $state('')
	let editDescription = $state('')
	let editPriceDollars = $state('')
	let editImages = $state('')
	let productMessage = $state('')
	let isSavingProduct = $state(false)

	// New variant state
	let newLabel = $state('')
	let newOptionValues = $state('')
	let newPriceDollars = $state('')
	let newStock = $state('0')
	let newSku = $state('')
	let newStyriaCode = $state('')
	let variantMessage = $state('')
	let isSavingVariant = $state(false)

	// Editing variant state
	let editingVariantId = $state<string | null>(null)
	let editVariantStock = $state('0')
	let editVariantPrice = $state('')
	let editVariantSku = $state('')
	let editVariantStyriaCode = $state('')

	// Load product data into edit fields
	$effect(() => {
		if (product) {
			editTitle = product.title
			editDescription = product.description || ''
			editPriceDollars = (product.base_price_cents / 100).toFixed(2)
			editImages = product.images?.join('\n') || ''
		}
	})

	function formatPrice(cents: number | null): string {
		if (cents == null) return '-'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100)
	}

	async function handleSaveProduct() {
		if (!product) return
		isSavingProduct = true
		productMessage = ''

		try {
			const priceCents = Math.round(parseFloat(editPriceDollars) * 100)
			const images = editImages
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean)

			const result = await updateMerchProduct.submit({
				id: product.id,
				title: editTitle,
				description: editDescription,
				base_price_cents: priceCents,
				images
			})

			productMessage = result.data?.text || ''
		} catch {
			productMessage = 'Error saving product'
		} finally {
			isSavingProduct = false
		}
	}

	async function handleCreateVariant() {
		if (!product) return
		isSavingVariant = true
		variantMessage = ''

		try {
			let optionValues: Record<string, string> = {}
			if (newOptionValues.trim()) {
				try {
					optionValues = JSON.parse(newOptionValues)
				} catch {
					variantMessage = 'Invalid option values JSON'
					isSavingVariant = false
					return
				}
			}

			const result = await createVariant.submit({
				product_id: product.id,
				label: newLabel,
				option_values: optionValues,
				price_cents: newPriceDollars ? Math.round(parseFloat(newPriceDollars) * 100) : undefined,
				stock_quantity: parseInt(newStock) || 0,
				sku: newSku || undefined,
				styria_product_code: newStyriaCode || undefined
			})

			if (result.data?.success) {
				newLabel = ''
				newOptionValues = ''
				newPriceDollars = ''
				newStock = '0'
				newSku = ''
				newStyriaCode = ''
			}
			variantMessage = result.data?.text || ''
		} catch {
			variantMessage = 'Error creating variant'
		} finally {
			isSavingVariant = false
		}
	}

	function startEditVariant(variant: any) {
		editingVariantId = variant.id
		editVariantStock = String(variant.stock_quantity)
		editVariantPrice = variant.price_cents != null ? (variant.price_cents / 100).toFixed(2) : ''
		editVariantSku = variant.sku || ''
		editVariantStyriaCode = variant.styria_product_code || ''
	}

	async function handleSaveVariant(variantId: string) {
		if (!product) return

		await updateVariant.submit({
			id: variantId,
			product_id: product.id,
			stock_quantity: parseInt(editVariantStock) || 0,
			price_cents: editVariantPrice ? Math.round(parseFloat(editVariantPrice) * 100) : null,
			sku: editVariantSku || undefined,
			styria_product_code: editVariantStyriaCode || undefined
		})

		editingVariantId = null
	}

	async function handleDeleteVariant(variantId: string) {
		if (!product) return
		await deleteVariant({ id: variantId, product_id: product.id })
	}
</script>

<svelte:head>
	<title>{product?.title || 'Product'} | Merch | Admin</title>
</svelte:head>

{#if product}
	<div class="space-y-8">
		<div class="flex items-center justify-between">
			<div>
				<nav class="mb-2 text-sm text-gray-500">
					<a href="/admin/merch" class="hover:text-orange-600">Merch</a>
					<span class="mx-2">/</span>
					<span class="text-gray-900">{product.title}</span>
				</nav>
				<h1 class="text-2xl font-bold text-gray-900">Edit Product</h1>
			</div>
			<a
				href="/merch/{product.slug}"
				class="text-sm text-orange-600 hover:text-orange-700"
				target="_blank"
			>
				View Public Page
			</a>
		</div>

		<!-- Product Details -->
		<div class="rounded-xl border border-gray-200 bg-white p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Product Details</h2>

			{#if productMessage}
				<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
					{productMessage}
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSaveProduct() }} class="space-y-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Title</label>
						<input
							type="text"
							bind:value={editTitle}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
							data-testid="edit-title"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Base Price (USD)</label>
						<input
							type="number"
							step="0.01"
							bind:value={editPriceDollars}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
							data-testid="edit-price"
						/>
					</div>
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
					<textarea
						bind:value={editDescription}
						rows="2"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
						data-testid="edit-description"
					></textarea>
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Images (one URL per line)</label>
					<textarea
						bind:value={editImages}
						rows="3"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
						data-testid="edit-images"
					></textarea>
				</div>

				<div>
					<button
						type="submit"
						class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
						disabled={isSavingProduct}
						data-testid="save-product"
					>
						{isSavingProduct ? 'Saving...' : 'Save Product'}
					</button>
				</div>
			</form>

			<div class="mt-4 flex items-center gap-4 border-t border-gray-200 pt-4 text-sm text-gray-500">
				<span>ID: {product.id}</span>
				<span>Slug: {product.slug}</span>
				<span>Stripe: {product.stripe_product_id || 'Not linked'}</span>
				<span class="rounded px-2 py-0.5 {product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
					{product.active ? 'Active' : 'Inactive'}
				</span>
			</div>
		</div>

		<!-- Variants -->
		<div class="rounded-xl border border-gray-200 bg-white p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">
				Variants ({product.variants.length})
			</h2>

			{#if variantMessage}
				<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
					{variantMessage}
				</div>
			{/if}

			<!-- Existing variants -->
			{#if product.variants.length > 0}
				<div class="mb-6 overflow-hidden rounded-lg border border-gray-200">
					<table class="w-full text-left text-sm">
						<thead class="border-b border-gray-200 bg-gray-50">
							<tr>
								<th class="px-3 py-2 font-medium text-gray-700">Label</th>
								<th class="px-3 py-2 font-medium text-gray-700">Price</th>
								<th class="px-3 py-2 font-medium text-gray-700">Stock</th>
								<th class="px-3 py-2 font-medium text-gray-700">SKU</th>
								<th class="px-3 py-2 font-medium text-gray-700">Styria Code</th>
								<th class="px-3 py-2 font-medium text-gray-700">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each product.variants as variant (variant.id)}
								<tr>
									{#if editingVariantId === variant.id}
										<td class="px-3 py-2">{variant.label}</td>
										<td class="px-3 py-2">
											<input type="number" step="0.01" bind:value={editVariantPrice} placeholder="Base" class="w-20 rounded border px-2 py-1 text-xs" />
										</td>
										<td class="px-3 py-2">
											<input type="number" bind:value={editVariantStock} class="w-16 rounded border px-2 py-1 text-xs" />
										</td>
										<td class="px-3 py-2">
											<input type="text" bind:value={editVariantSku} class="w-24 rounded border px-2 py-1 text-xs" />
										</td>
										<td class="px-3 py-2">
											<input type="text" bind:value={editVariantStyriaCode} class="w-24 rounded border px-2 py-1 text-xs" />
										</td>
										<td class="px-3 py-2">
											<div class="flex gap-2">
												<button type="button" class="text-xs text-green-600 hover:text-green-700" onclick={() => handleSaveVariant(variant.id)}>Save</button>
												<button type="button" class="text-xs text-gray-500 hover:text-gray-700" onclick={() => editingVariantId = null}>Cancel</button>
											</div>
										</td>
									{:else}
										<td class="px-3 py-2">
											<span class="font-medium">{variant.label}</span>
											{#if !variant.active}
												<span class="ml-1 text-xs text-gray-400">(inactive)</span>
											{/if}
										</td>
										<td class="px-3 py-2">{formatPrice(variant.price_cents)}</td>
										<td class="px-3 py-2">
											<span class={variant.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
												{variant.stock_quantity}
											</span>
										</td>
										<td class="px-3 py-2 text-gray-500">{variant.sku || '-'}</td>
										<td class="px-3 py-2 text-gray-500">{variant.styria_product_code || '-'}</td>
										<td class="px-3 py-2">
											<div class="flex gap-2">
												<button type="button" class="text-xs text-orange-600 hover:text-orange-700" onclick={() => startEditVariant(variant)}>Edit</button>
												<button type="button" class="text-xs text-red-600 hover:text-red-700" onclick={() => handleDeleteVariant(variant.id)}>Delete</button>
											</div>
										</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Add variant form -->
			<div class="rounded-lg border border-dashed border-gray-300 p-4">
				<h3 class="mb-3 text-sm font-medium text-gray-700">Add Variant</h3>
				<form onsubmit={(e) => { e.preventDefault(); handleCreateVariant() }} class="grid grid-cols-2 gap-3 md:grid-cols-3">
					<div>
						<label class="mb-1 block text-xs text-gray-500">Label</label>
						<input type="text" bind:value={newLabel} placeholder="M / Black" class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" required data-testid="variant-label" />
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Option Values (JSON)</label>
						<input type="text" bind:value={newOptionValues} placeholder='{"Size":"M","Color":"Black"}' class="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-sm" data-testid="variant-options" />
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Price Override (USD)</label>
						<input type="number" step="0.01" bind:value={newPriceDollars} placeholder="Base price" class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" data-testid="variant-price" />
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Stock</label>
						<input type="number" bind:value={newStock} class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" data-testid="variant-stock" />
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">SKU</label>
						<input type="text" bind:value={newSku} class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" data-testid="variant-sku" />
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Styria Code</label>
						<input type="text" bind:value={newStyriaCode} class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" data-testid="variant-styria" />
					</div>
					<div class="col-span-full">
						<button
							type="submit"
							class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
							disabled={isSavingVariant}
							data-testid="add-variant"
						>
							{isSavingVariant ? 'Adding...' : 'Add Variant'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
		<a href="/admin/merch" class="mt-4 inline-block text-orange-600 hover:underline">Back to Products</a>
	</div>
{/if}
