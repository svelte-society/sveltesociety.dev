<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { debounce } from '$lib/utils/debounce'
	import { submitResource, getTags } from '../submit.remote'

	const { title, description, link, type, tags, notes } = submitResource.fields

	let resourcePreview = $state<{
		preview?: { title: string | null; description: string | null; image: string | null }
	} | null>(null)
	let previousLinkUrl = $state<string>('')
	let previewLoading = $state(false)
	let previewError = $state<string | null>(null)

	const fetchResourcePreview = debounce(async (url: string) => {
		if (!url) {
			resourcePreview = null
			return
		}

		previewLoading = true
		previewError = null

		try {
			const response = await fetch(`/api/preview/resource?url=${encodeURIComponent(url)}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch preview')
			}

			resourcePreview = data
		} catch (error) {
			previewError = error instanceof Error ? error.message : 'Failed to fetch preview'
			resourcePreview = null
		} finally {
			previewLoading = false
		}
	}, 1000)

	$effect(() => {
		if (link.value()) {
			const currentUrl = link.value() || ''
			if (currentUrl !== previousLinkUrl) {
				previousLinkUrl = currentUrl
				fetchResourcePreview(currentUrl)
			}
		}
	})
</script>

<form {...submitResource} class="flex flex-col gap-4">
	<input {...type.as('hidden', page.params.type!)} />

	<Input
		{...title.as('text')}
		placeholder="A useful Svelte resource"
		label="Title"
		description="Enter the title of your resource"
		issues={title.issues()}
		data-testid="resource-title-input"
	/>

	<TextArea
		{...description.as('text')}
		placeholder="A brief description of this resource..."
		label="Description"
		description="Enter a short description"
		issues={description.issues()}
		data-testid="resource-description-input"
	/>

	<Input
		{...link.as('text')}
		placeholder="https://example.com/resource"
		label="Link"
		description="Enter the URL to the resource"
		issues={link.issues()}
		data-testid="resource-link-input"
	/>

	{#if previewLoading}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-4" data-testid="resource-preview-loading">
			<p class="text-sm text-gray-600">Loading preview...</p>
		</div>
	{:else if previewError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4" data-testid="resource-preview-error">
			<p class="text-sm text-red-600">{previewError}</p>
		</div>
	{:else if resourcePreview?.preview}
		<div class="rounded-lg border border-gray-200 bg-white p-4" data-testid="resource-preview">
			<h3 class="mb-2 text-sm font-medium text-gray-900">Preview</h3>
			<div class="flex gap-4">
				{#if resourcePreview.preview.image}
					<img
						src={resourcePreview.preview.image}
						alt="Resource preview"
						class="h-20 w-32 rounded object-cover"
						data-testid="resource-preview-image"
					/>
				{:else}
					<div class="flex h-20 w-32 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
						No image
					</div>
				{/if}
				<div class="flex-1">
					{#if resourcePreview.preview.title}
						<p class="font-medium text-gray-900" data-testid="resource-preview-title">
							{resourcePreview.preview.title}
						</p>
					{/if}
					{#if resourcePreview.preview.description}
						<p class="mt-1 line-clamp-2 text-sm text-gray-500">
							{resourcePreview.preview.description}
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<DynamicSelector
		name="Tags"
		label="Tags"
		description="Select relevant tags for your submission"
		field={tags}
		options={await getTags()}
		data-testid="tags-selector"
	/>

	<TextArea
		{...notes.as('text')}
		placeholder="Any additional notes or context..."
		label="Notes (optional)"
		description="Any additional information for the moderators about your submission"
		rows={3}
		data-testid="resource-notes-input"
	/>

	<Button data-testid="submit-button">Submit Resource</Button>
</form>
