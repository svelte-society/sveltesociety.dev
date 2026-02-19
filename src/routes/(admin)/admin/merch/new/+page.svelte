<script lang="ts">
	import { goto } from '$app/navigation'
	import { createMerchProduct } from '../data.remote'
	import { initForm } from '$lib/utils/form.svelte'

	let title = $state('')
	let slug = $state('')
	let description = $state('')
	let body = $state('')
	let basePriceDollars = $state('')
	let imagesText = $state('')
	let variantOptionsText = $state('')
	let error = $state('')
	let isSubmitting = $state(false)

	// Auto-generate slug from title
	$effect(() => {
		if (title && !slug) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
		}
	})

	async function handleSubmit() {
		isSubmitting = true
		error = ''

		try {
			const priceCents = Math.round(parseFloat(basePriceDollars) * 100)
			if (isNaN(priceCents) || priceCents < 1) {
				error = 'Please enter a valid price'
				isSubmitting = false
				return
			}

			const images = imagesText
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean)

			let variant_options: Array<{ name: string; values: string[] }> | undefined
			if (variantOptionsText.trim()) {
				try {
					variant_options = JSON.parse(variantOptionsText)
				} catch {
					error = 'Invalid variant options JSON'
					isSubmitting = false
					return
				}
			}

			const result = await createMerchProduct.submit({
				title,
				slug,
				description: description || undefined,
				body: body || undefined,
				base_price_cents: priceCents,
				images: images.length > 0 ? images : undefined,
				variant_options
			})

			if (result.data?.success && result.data.productId) {
				goto(`/admin/merch/${result.data.productId}`)
			} else {
				error = result.data?.text || 'Failed to create product'
			}
		} catch (e) {
			error = 'An error occurred'
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	<title>New Product | Merch | Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Create Product</h1>
		<p class="mt-1 text-sm text-gray-500">Add a new merch product</p>
	</div>

	{#if error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
			{error}
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit() }} class="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
					required
					data-testid="input-title"
				/>
			</div>

			<div>
				<label for="slug" class="mb-1 block text-sm font-medium text-gray-700">Slug</label>
				<input
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
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700">Description</label>
			<textarea
				id="description"
				bind:value={description}
				rows="2"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="textarea-description"
			></textarea>
		</div>

		<div>
			<label for="body" class="mb-1 block text-sm font-medium text-gray-700">Body (Markdown)</label>
			<textarea
				id="body"
				bind:value={body}
				rows="6"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="textarea-body"
			></textarea>
		</div>

		<div>
			<label for="price" class="mb-1 block text-sm font-medium text-gray-700">Base Price (USD)</label>
			<input
				id="price"
				type="number"
				step="0.01"
				min="0.01"
				bind:value={basePriceDollars}
				placeholder="29.99"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				required
				data-testid="input-price"
			/>
		</div>

		<div>
			<label for="images" class="mb-1 block text-sm font-medium text-gray-700">Image URLs (one per line)</label>
			<textarea
				id="images"
				bind:value={imagesText}
				rows="3"
				placeholder="https://example.com/image1.jpg"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="textarea-images"
			></textarea>
		</div>

		<div>
			<label for="variants" class="mb-1 block text-sm font-medium text-gray-700">
				Variant Options (JSON)
			</label>
			<textarea
				id="variants"
				bind:value={variantOptionsText}
				rows="3"
				placeholder={`[{"name":"Size","values":["S","M","L","XL"]},{"name":"Color","values":["Black","White"]}]`}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="textarea-variant-options"
			></textarea>
		</div>

		<div class="flex items-center gap-3">
			<button
				type="submit"
				class="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
				disabled={isSubmitting}
				data-testid="submit-product"
			>
				{isSubmitting ? 'Creating...' : 'Create Product'}
			</button>
			<a href="/admin/merch" class="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
		</div>
	</form>
</div>
