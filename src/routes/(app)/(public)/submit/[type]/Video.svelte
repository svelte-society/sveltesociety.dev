<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { usePreview } from '$lib/utils/use-preview.svelte'
	import { submitVideo, getTags } from '../submit.remote'

	const { description, type, tags, url, notes } = submitVideo.fields

	const preview = usePreview<{
		exists: boolean
		content?: { id: string; title: string; status: string; url: string | null }
		preview?: { title: string; description: string; thumbnail: string; channelTitle: string }
	}>('/api/preview/youtube', 'url')

	$effect(() => {
		preview.fetch(url.value() || '')
	})
</script>

<form {...submitVideo} class="flex flex-col gap-4">
	<input {...type.as('hidden', page.params.type!)} />

	<TextArea
		{...description.as('text')}
		placeholder="A brief description of this video..."
		label="Description"
		description="Enter a short description"
		issues={description.issues()}
		data-testid="video-description-input"
	/>

	<Input
		{...url.as('url')}
		placeholder="https://youtube.com/watch?v=..."
		label="Video URL"
		description="Enter the YouTube URL for the video"
		issues={url.issues()}
		data-testid="video-url-input"
	/>

	{#if preview.state.loading}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
			<p class="text-sm text-gray-600">Loading preview...</p>
		</div>
	{:else if preview.state.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-600">{preview.state.error}</p>
		</div>
	{:else if preview.state.data?.exists && preview.state.data.content}
		<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
			<p class="text-sm font-medium text-yellow-800">This video has already been submitted</p>
			<p class="mt-1 text-sm text-yellow-700">
				{#if preview.state.data.content.status === 'published'}
					View it here: <a href={preview.state.data.content.url} class="underline"
						>{preview.state.data.content.title}</a
					>
				{:else if preview.state.data.content.status === 'draft' || preview.state.data.content.status === 'pending_review'}
					"{preview.state.data.content.title}" is currently awaiting review.
				{:else}
					"{preview.state.data.content.title}" has been submitted.
				{/if}
			</p>
		</div>
	{:else if preview.state.data?.preview}
		<div class="rounded-lg border border-gray-200 bg-white p-4">
			<h3 class="mb-2 text-sm font-medium text-gray-900">Preview</h3>
			<div class="flex gap-4">
				<img
					src={preview.state.data.preview.thumbnail}
					alt={preview.state.data.preview.title}
					class="h-20 w-32 rounded object-cover"
				/>
				<div class="flex-1">
					<p class="font-medium text-gray-900">{preview.state.data.preview.title}</p>
					<p class="mt-1 text-sm text-gray-600">{preview.state.data.preview.channelTitle}</p>
					<p class="mt-1 line-clamp-2 text-xs text-gray-500">
						{preview.state.data.preview.description}
					</p>
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
		data-testid="video-notes-input"
	/>

	<Button data-testid="submit-button">Submit Video</Button>
</form>
