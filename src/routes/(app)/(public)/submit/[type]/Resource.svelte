<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { usePreview } from '$lib/utils/use-preview.svelte'
	import { submitResource, getTags } from '../submit.remote'

	const { title, description, link, type, tags, notes } = submitResource.fields

	const preview = usePreview<{
		preview?: { title: string | null; description: string | null; image: string | null }
	}>('/api/preview/resource', 'url')

	$effect(() => {
		preview.fetch(link.value() || '')
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

	{#if preview.state.loading}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-4" data-testid="resource-preview-loading">
			<p class="text-sm text-gray-600">Loading preview...</p>
		</div>
	{:else if preview.state.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4" data-testid="resource-preview-error">
			<p class="text-sm text-red-600">{preview.state.error}</p>
		</div>
	{:else if preview.state.data?.preview}
		<div class="rounded-lg border border-gray-200 bg-white p-4" data-testid="resource-preview">
			<h3 class="mb-2 text-sm font-medium text-gray-900">Preview</h3>
			<div class="flex gap-4">
				{#if preview.state.data.preview.image}
					<img
						src={preview.state.data.preview.image}
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
					{#if preview.state.data.preview.title}
						<p class="font-medium text-gray-900" data-testid="resource-preview-title">
							{preview.state.data.preview.title}
						</p>
					{/if}
					{#if preview.state.data.preview.description}
						<p class="mt-1 line-clamp-2 text-sm text-gray-500">
							{preview.state.data.preview.description}
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
