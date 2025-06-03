<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Input from '$lib/ui/form/Input.svelte'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import AdminForm from '$lib/ui/admin/AdminForm.svelte'
	import SlugField from '$lib/ui/admin/SlugField.svelte'
	import StatusField from '$lib/ui/admin/StatusField.svelte'
	import { createCollectionSchema } from '$lib/schema/content'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import { toast } from 'svelte-sonner'
	import Files from 'phosphor-svelte/lib/Files'
	import Tag from 'phosphor-svelte/lib/Tag'
	import { ADMIN_ROUTES } from '$lib/admin'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	const form = superForm(data.form, {
		validators: zodClient(createCollectionSchema),
		invalidateAll: 'force',
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form?.message) {
				form.message.success ? toast.success(form.message.text) : toast.error(form.message.text)
			}
		}
	})

	const { form: formData } = form
</script>

<AdminForm
	title="Create New Collection"
	{form}
	cancelHref={ADMIN_ROUTES.collections.list}
	submitLabel="Create Collection"
>
	<Input
		name="title"
		label="Title"
		placeholder="Best Svelte Tutorials"
		description="Enter a descriptive title for the collection"
	/>

	<SlugField
		nameValue={$formData.title}
		slugValue={$formData.slug}
		onSlugChange={(value) => ($formData.slug = value)}
		nameField="title"
	/>

	<Textarea
		name="description"
		label="Description"
		placeholder="A curated collection of the best Svelte tutorials"
		description="Enter a description for this collection"
	/>

	<StatusField bind:value={$formData.status} />

	<DynamicSelector
		name="children"
		label="Content"
		description="Select content to add to the collection"
		Icon={Files}
		options={data.content.map((item) => ({
			label: `${item.title} (${item.type})`,
			value: item.id
		}))}
	/>

	<DynamicSelector
		name="tags"
		label="Tags"
		description="Select tags for this collection"
		Icon={Tag}
		options={data.tags.map((tag) => ({
			label: tag.name,
			value: tag.id
		}))}
	/>
</AdminForm>
