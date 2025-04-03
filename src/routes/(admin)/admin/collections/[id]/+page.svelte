<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Input from '$lib/ui/form/Input.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { slugify } from '$lib/utils/slug'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import { toast } from 'svelte-sonner'
	import { updateCollectionSchema } from '$lib/schema/content'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	let form = superForm(data.form, {
		invalidateAll: 'force',
		onUpdated: ({ form }) => {
			form?.message?.success ? toast.success(form.message.text) : toast.error(form.message.text)
		}
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
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Collection</h1>

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
			<Button type="button" small secondary onclick={generateSlug}>Generate</Button>
		</div>

		<Input
			name="description"
			label="Description"
			type="text"
			placeholder="A curated collection of the best Svelte tutorials"
			description="Enter a description for this collection"
		/>

		<DynamicSelector
			name="children"
			label="Content"
			description="Select content to add to the collection"
			options={data.content.map((item) => ({
				label: `${item.title} (${item.type})`,
				value: item.id
			}))}
		/>

		<DynamicSelector
			name="tags"
			label="Tags"
			description="Select tags for this collection"
			options={data.tags.map((tag) => ({
				label: tag.name,
				value: tag.id
			}))}
		/>

		<Button type="submit" primary fullWidth disabled={$submitting}>
			{$submitting ? 'Updating...' : 'Update Collection'}
		</Button>
	</Form>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
