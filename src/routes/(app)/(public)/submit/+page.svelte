<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import SuperDebug from 'sveltekit-superforms'
	import { options } from './schema'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import Button from '$lib/ui/Button.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import CategorySelector from '$lib/ui/form/CategorySelector.svelte'
	let { data } = $props()

	const form = superForm(data.form, {
		resetForm: true,
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		validationMethod: 'onsubmit'
	})

	const { form: formData, submitting } = form
</script>

<div class="mx-auto grid max-w-3xl gap-6">
	<h1 class="mb-6 text-2xl font-bold">Submit a new resource</h1>
	<p class="text-sm">
		Before making a submission, please ensure that the resource you are submitting is not already
		listed on the site. Use the search bar to check if the resource is already listed.
	</p>
	<Form {form} action="?/submit">
		<!-- Content type selection first -->
		<CategorySelector
			name="type"
			label="Type"
			description="Select the type of content you are submitting"
			{options}
		/>

		<!-- Common fields for all types -->
		<Input
			placeholder="Enter a title..."
			name="title"
			label="Title"
			description="Enter the title of your content submission"
		/>
		<Textarea
			placeholder="Enter a description..."
			name="description"
			label="Description"
			description="Enter the description of your content submission."
		/>

		<!-- Tags field using DynamicSelector -->
		<DynamicSelector
			name="tags"
			label="Tags"
			description="Select relevant tags for your submission"
			options={data.tags.map((tag) => ({
				label: tag.name,
				value: tag.id
			}))}
		/>

		<!-- Type-specific fields -->
		{#if $formData.type === 'recipe'}
			<Textarea
				placeholder="Enter the recipe content, instructions, and code examples..."
				name="body"
				label="Recipe Content"
				description="Provide the full recipe content including instructions and code"
			/>
		{:else if $formData.type === 'video'}
			<Input
				placeholder="https://youtube.com/watch?v=..."
				name="url"
				label="Video URL"
				description="Enter the YouTube URL for the video"
			/>
		{:else if $formData.type === 'library'}
			<Input
				placeholder="username/repository"
				name="github_repo"
				label="GitHub Repository"
				description="GitHub repository (required for libraries)"
			/>
		{:else if $formData.type === 'link'}
			<Input
				placeholder="https://example.com"
				name="url"
				label="URL"
				description="The URL you want to share"
			/>
		{/if}

		<!-- Notes field (always shown) -->
		<Textarea
			placeholder="Any additional notes or context..."
			name="notes"
			label="Notes (optional)"
			description="Any additional information about your submission"
		/>

		<Button type="submit" primary disabled={$submitting}>
			{$submitting ? 'Submitting...' : 'Submit'}
		</Button>
	</Form>
</div>

<SuperDebug data={$formData} />
