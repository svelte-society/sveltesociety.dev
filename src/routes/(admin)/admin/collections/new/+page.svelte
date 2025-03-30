<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Input from '$lib/ui/form/Input.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { slugify } from '$lib/utils/slug'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import DynamicInput from '$lib/ui/form/DynamicInput.svelte'
	import { createCollectionSchema } from '$lib/schema/collections'
	import ContentSelector from './ContentSelector.svelte'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	const form = superForm(data.form, {
		validators: zodClient(createCollectionSchema),
		dataType: 'json'
	})

	const { form: formData, submitting } = form

	// Helper to generate slug from title
	function generateSlug() {
		if ($formData.title) {
			$formData.slug = slugify($formData.title)
		}
	}
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Collection</h1>

	<Form {form}>
		<Input
			name="title"
			label="Title"
			placeholder="Best Svelte Tutorials"
			description="Enter a descriptive title for the collection"
		/>

		<div class="flex w-full items-center gap-2">
			<Input
				name="slug"
				label="URL Slug"
				placeholder="best-svelte-tutorials"
				description="The slug used in the URL (auto-generated from title)"
			/>
			<Button small secondary onclick={generateSlug}>Generate</Button>
		</div>

		<Input
			name="description"
			label="Description"
			type="text"
			placeholder="A curated collection of the best Svelte tutorials"
			description="Enter a description for this collection"
		/>

		<div>
			<DynamicInput
				name="children"
				label="Content"
				description="Select content to add to the collection"
				type="text"
				options={data.content.map((item) => ({
					label: `${item.title} (${item.type})`,
					value: item.id
				}))}
				bind:value={$formData.children}
			/>

			<div>
				<ContentSelector
					bind:selectedContent={$formData.children}
					content={data.content.filter((c) => $formData.children.includes(c.id))}
				/>
			</div>
		</div>

		<DynamicInput
			name="tags"
			label="Tags"
			description="Select tags for this collection"
			type="text"
			options={data.tags.map((tag) => ({
				label: tag.name,
				value: tag.id
			}))}
			bind:value={$formData.tags}
		/>

		<Button type="submit" primary fullWidth disabled={$submitting}>
			{$submitting ? 'Creating...' : 'Create Collection'}
		</Button>
	</Form>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
