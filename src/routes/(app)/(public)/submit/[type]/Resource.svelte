<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { submitResource, getTags } from '../submit.remote'

	const { title, description, link, image, type, tags, notes } = submitResource.fields
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

	<Input
		{...image.as('text')}
		placeholder="https://example.com/image.png (optional)"
		label="Image URL (optional)"
		description="Enter a URL to an image for the resource preview"
		issues={image.issues()}
		data-testid="resource-image-input"
	/>

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
