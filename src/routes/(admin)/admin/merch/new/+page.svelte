<script lang="ts">
	import { goto } from '$app/navigation'
	import { createMerchProduct } from '../data.remote'
	import VariantOptionsEditor from '../VariantOptionsEditor.svelte'
	import MarketingFeaturesEditor from '../MarketingFeaturesEditor.svelte'
	import SizeGuideEditor from '../SizeGuideEditor.svelte'

	let slug = $state('')

	// Auto-generate slug from title
	$effect(() => {
		const title = createMerchProduct.fields.title.value()
		if (title && !slug) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
		}
	})
</script>

<svelte:head>
	<title>New Product | Merch | Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Create Product</h1>
		<p class="mt-1 text-sm text-gray-500">Add a new merch product</p>
	</div>

	{#if createMerchProduct.result && !createMerchProduct.result.success}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
			{createMerchProduct.result.text}
		</div>
	{/if}

	<form
		{...createMerchProduct.enhance(async ({ submit }) => {
			await submit()
			if (createMerchProduct.result?.success && createMerchProduct.result?.productId) {
				goto(`/admin/merch/${createMerchProduct.result.productId}`)
			}
		})}
		class="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
	>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title</label>
				<input
					{...createMerchProduct.fields.title.as('text')}
					id="title"
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
					required
					data-testid="input-title"
				/>
			</div>

			<div>
				<label for="slug" class="mb-1 block text-sm font-medium text-gray-700">Slug</label>
				<input
					name="slug"
					id="slug"
					type="text"
					bind:value={slug}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
					required
					data-testid="input-slug"
				/>
			</div>
		</div>

		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
				>Description</label
			>
			<textarea
				{...createMerchProduct.fields.description.as('text')}
				id="description"
				rows="2"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="textarea-description"
			></textarea>
		</div>

		<div>
			<label for="price" class="mb-1 block text-sm font-medium text-gray-700"
				>Base Price (EUR)</label
			>
			<input
				{...createMerchProduct.fields.base_price.as('text')}
				id="price"
				type="number"
				step="0.01"
				min="0.01"
				placeholder="29.99"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				required
				data-testid="input-price"
			/>
		</div>

		<div>
			<label for="images" class="mb-1 block text-sm font-medium text-gray-700"
				>Image URLs (one per line)</label
			>
			<textarea
				{...createMerchProduct.fields.images.as('text')}
				id="images"
				rows="3"
				placeholder="https://example.com/image1.jpg"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="textarea-images"
			></textarea>
		</div>

		<div>
			<span class="mb-1 block text-sm font-medium text-gray-700">Marketing Features</span>
			<p class="mb-2 text-xs text-gray-400">Bullet points shown on pricing tables (max 15)</p>
			<MarketingFeaturesEditor name="marketing_features" />
		</div>

		<div>
			<span class="mb-1 block text-sm font-medium text-gray-700">Variant Options</span>
			<VariantOptionsEditor name="variant_options" />
		</div>

		<div>
			<span class="mb-1 block text-sm font-medium text-gray-700">Size Guide</span>
			<SizeGuideEditor name="size_guide" />
		</div>

		<div class="flex items-center gap-3">
			<button
				type="submit"
				class="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
				disabled={!!createMerchProduct.pending}
				data-testid="submit-product"
			>
				{createMerchProduct.pending ? 'Creating...' : 'Create Product'}
			</button>
			<a href="/admin/merch" class="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
		</div>
	</form>
</div>
