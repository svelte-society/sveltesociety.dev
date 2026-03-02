<script lang="ts">
	import { page } from '$app/state'
	import {
		getMerchProduct,
		updateMerchProduct,
		createVariant,
		updateVariant,
		deleteVariant,
		generateVariants
	} from '../data.remote'
	import MarketingFeaturesEditor from '../MarketingFeaturesEditor.svelte'
	import SizeGuideEditor from '../SizeGuideEditor.svelte'

	let product = $derived(await getMerchProduct({ id: page.params.id! }))

	// Editing variant state
	let editingVariantId = $state<string | null>(null)

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(cents / 100)
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

			{#if updateMerchProduct.result}
				<div
					class="mb-4 rounded-lg border p-3 text-sm {updateMerchProduct.result.success
						? 'border-blue-200 bg-blue-50 text-blue-700'
						: 'border-red-200 bg-red-50 text-red-700'}"
				>
					{updateMerchProduct.result.text}
				</div>
			{/if}

			<form {...updateMerchProduct} class="space-y-4">
				<input {...updateMerchProduct.fields.id.as('hidden', product.id)} />

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Title</label>
						<input
							{...updateMerchProduct.fields.title.as('text')}
							value={product.title}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
							data-testid="edit-title"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Base Price (EUR)</label>
						<input
							{...updateMerchProduct.fields.base_price.as('text')}
							type="number"
							step="0.01"
							value={(product.base_price_cents / 100).toFixed(2)}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
							data-testid="edit-price"
						/>
					</div>
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
					<textarea
						{...updateMerchProduct.fields.description.as('text')}
						rows="2"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
						data-testid="edit-description">{product.description || ''}</textarea
					>
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700"
						>Images (one URL per line)</label
					>
					<textarea
						{...updateMerchProduct.fields.images.as('text')}
						rows="3"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
						data-testid="edit-images">{product.images?.join('\n') || ''}</textarea
					>
				</div>

				<div>
					<span class="mb-1 block text-sm font-medium text-gray-700">Marketing Features</span>
					<p class="mb-2 text-xs text-gray-400">Bullet points shown on pricing tables (max 15)</p>
					<MarketingFeaturesEditor name="marketing_features" initial={product.marketing_features} />
				</div>

				<div>
					<span class="mb-1 block text-sm font-medium text-gray-700">Size Guide</span>
					<SizeGuideEditor name="size_guide" initial={product.size_guide} />
				</div>

				<div>
					<button
						type="submit"
						class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
						disabled={!!updateMerchProduct.pending}
						data-testid="save-product"
					>
						{updateMerchProduct.pending ? 'Saving...' : 'Save Product'}
					</button>
				</div>
			</form>

			<div
				class="mt-4 flex items-center gap-4 border-t border-gray-200 pt-4 text-sm text-gray-500"
			>
				<span>ID: {product.id}</span>
				<span>Slug: {product.slug}</span>
				<span
					class="rounded px-2 py-0.5 {product.active
						? 'bg-green-100 text-green-700'
						: 'bg-gray-100 text-gray-600'}"
				>
					{product.active ? 'Active' : 'Inactive'}
				</span>
			</div>
		</div>

		<!-- Variants -->
		<div class="rounded-xl border border-gray-200 bg-white p-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900">
					Variants ({product.variants.length})
				</h2>
				{#if product.variant_options && product.variant_options.length > 0}
					<form {...generateVariants} class="inline">
						<input {...generateVariants.fields.product_id.as('hidden', product.id)} />
						<button
							type="submit"
							class="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
							disabled={!!generateVariants.pending}
							data-testid="generate-variants"
						>
							{generateVariants.pending
								? 'Generating...'
								: 'Generate Variants from Options'}
						</button>
					</form>
				{/if}
			</div>

			{#if generateVariants.result?.text}
				<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
					{generateVariants.result.text}
				</div>
			{/if}

			{#if createVariant.result?.text}
				<div
					class="mb-4 rounded-lg border p-3 text-sm {createVariant.result.success
						? 'border-blue-200 bg-blue-50 text-blue-700'
						: 'border-red-200 bg-red-50 text-red-700'}"
				>
					{createVariant.result.text}
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
								<th class="px-3 py-2 font-medium text-gray-700">SKU</th>
								<th class="px-3 py-2 font-medium text-gray-700">Styria Code</th>
								<th class="px-3 py-2 font-medium text-gray-700">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each product.variants as variant (variant.id)}
								{#if editingVariantId === variant.id}
									{@const editForm = updateVariant.for(variant.id)}
									<tr>
										<td colspan="5" class="px-3 py-3">
											<form {...editForm} class="flex flex-wrap items-end gap-3">
												<input {...editForm.fields.id.as('hidden', variant.id)} />
												<input
													{...editForm.fields.product_id.as('hidden', product.id)}
												/>
												<div>
													<span class="block text-xs text-gray-500">Label</span>
													<span class="text-sm font-medium">{variant.label}</span>
												</div>
												<div>
													<span class="block text-xs text-gray-500">Price</span>
													<span class="text-sm">{formatPrice(variant.price_cents)}</span>
												</div>
												<div>
													<label class="block text-xs text-gray-500">SKU</label>
													<input
														{...editForm.fields.sku.as('text')}
														value={variant.sku || ''}
														class="w-28 rounded border px-2 py-1 text-xs"
													/>
												</div>
												<div>
													<label class="block text-xs text-gray-500">Styria Code</label>
													<input
														{...editForm.fields.styria_product_code.as('text')}
														value={variant.styria_product_code || ''}
														class="w-28 rounded border px-2 py-1 text-xs"
													/>
												</div>
												<div class="flex gap-2">
													<button
														type="submit"
														class="text-xs text-green-600 hover:text-green-700"
														>Save</button
													>
													<button
														type="button"
														class="text-xs text-gray-500 hover:text-gray-700"
														onclick={() => (editingVariantId = null)}>Cancel</button
													>
												</div>
											</form>
										</td>
									</tr>
								{:else}
									{@const delForm = deleteVariant.for(variant.id)}
									<tr>
										<td class="px-3 py-2">
											<span class="font-medium">{variant.label}</span>
											{#if !variant.active}
												<span class="ml-1 text-xs text-gray-400">(inactive)</span>
											{/if}
										</td>
										<td class="px-3 py-2">{formatPrice(variant.price_cents)}</td>
										<td class="px-3 py-2 text-gray-500">{variant.sku || '-'}</td>
										<td class="px-3 py-2 text-gray-500"
											>{variant.styria_product_code || '-'}</td
										>
										<td class="px-3 py-2">
											<div class="flex gap-2">
												<button
													type="button"
													class="text-xs text-orange-600 hover:text-orange-700"
													onclick={() => (editingVariantId = variant.id)}>Edit</button
												>
												<form {...delForm} class="inline">
													<input {...delForm.fields.id.as('hidden', variant.id)} />
													<input
														{...delForm.fields.product_id.as('hidden', product.id)}
													/>
													<button
														type="submit"
														class="text-xs text-red-600 hover:text-red-700">Delete</button
													>
												</form>
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Add variant form -->
			<div class="rounded-lg border border-dashed border-gray-300 p-4">
				<h3 class="mb-3 text-sm font-medium text-gray-700">Add Variant</h3>
				<form
					{...createVariant.enhance(async ({ form: formEl, submit }) => {
						await submit()
						if (createVariant.result?.success) {
							formEl.reset()
						}
					})}
					class="grid grid-cols-2 gap-3 md:grid-cols-3"
				>
					<input {...createVariant.fields.product_id.as('hidden', product.id)} />
					<div>
						<label class="mb-1 block text-xs text-gray-500">Label</label>
						<input
							{...createVariant.fields.label.as('text')}
							placeholder="M / Black"
							class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
							required
							data-testid="variant-label"
						/>
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Option Values (JSON)</label>
						<input
							{...createVariant.fields.option_values.as('text')}
							placeholder={'{"Size":"M","Color":"Black"}'}
							class="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-sm"
							data-testid="variant-options"
						/>
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Price Override (EUR)</label>
						<input
							{...createVariant.fields.price.as('text')}
							type="number"
							step="0.01"
							placeholder="Base price"
							class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
							data-testid="variant-price"
						/>
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">SKU</label>
						<input
							{...createVariant.fields.sku.as('text')}
							class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
							data-testid="variant-sku"
						/>
					</div>
					<div>
						<label class="mb-1 block text-xs text-gray-500">Styria Code</label>
						<input
							{...createVariant.fields.styria_product_code.as('text')}
							class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
							data-testid="variant-styria"
						/>
					</div>
					<div class="col-span-full">
						<button
							type="submit"
							class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
							disabled={!!createVariant.pending}
							data-testid="add-variant"
						>
							{createVariant.pending ? 'Adding...' : 'Add Variant'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
		<a href="/admin/merch" class="mt-4 inline-block text-orange-600 hover:underline"
			>Back to Products</a
		>
	</div>
{/if}
