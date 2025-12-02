<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { submitResource, getTags } from '../submit.remote'

	const { title, description, link, image, type, tags } = submitResource.fields
</script>

<form {...submitResource} class="flex flex-col gap-4">
	<input {...type.as('hidden', page.params.type!)} />

	<Input
		{...title.as('text')}
		placeholder="A useful Svelte resource"
		label="Title"
		description="Enter the title of your resource"
		data-testid="resource-title-input"
	/>

	<TextArea
		{...description.as('text')}
		placeholder="https://example.com/resource"
		label="Description"
		description="Enter a short description"
		data-testid="resource-link-input"
	/>

	<Input
		{...link.as('text')}
		placeholder="https://example.com/resource"
		label="Link"
		description="Enter the URL to the resource"
		data-testid="resource-link-input"
	/>

	<Input
		{...image.as('text')}
		placeholder="https://example.com/image.png (optional)"
		label="Image URL (optional)"
		description="Enter a URL to an image for the resource preview"
		data-testid="resource-image-input"
	/>

	<DynamicSelector
		name="Tags"
		label="Tags"
		description="Select relevant tags for your submission"
		field={tags}
		options={await getTags()}
	/>

	<Button>Submit {page.params.type}</Button>
</form>
