<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { submitRecipe, getTags } from '../submit.remote'

	const { title, description, body, type, tags, notes } = submitRecipe.fields
</script>

<form {...submitRecipe} class="flex flex-col gap-4">
	<input {...type.as('hidden', page.params.type!)} />

	<Input
		{...title.as('text')}
		placeholder="This is a really cool recipe"
		label="Title"
		description="Enter the title of your recipe"
		issues={title.issues()}
		data-testid="recipe-title-input"
	/>

	<TextArea
		{...description.as('text')}
		placeholder="A brief summary of what this recipe covers..."
		label="Description"
		description="Enter a short description of your recipe. This will be shown in listings."
		issues={description.issues()}
		data-testid="recipe-description-input"
	/>

	<MarkdownEditor
		{...body.as('text')}
		placeholder="Enter the recipe content, instructions, and code examples..."
		label="Recipe Content"
		description="Provide the full recipe content including instructions and code. Use markdown to format your content."
		rows={15}
		issues={body.issues()}
		data-testid="recipe-body-input"
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
		data-testid="recipe-notes-input"
	/>

	<Button data-testid="submit-button">Submit Recipe</Button>
</form>
