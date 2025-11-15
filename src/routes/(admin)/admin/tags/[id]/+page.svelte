<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { superForm } from 'sveltekit-superforms'
	import { slugify } from '$lib/utils/slug'
	import Tag from 'phosphor-svelte/lib/Tag'

	let { data } = $props()
	const superform = superForm(data.form)
	const { form, errors } = superform
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Tag"
		description="Update category tag information"
		icon={Tag}
	/>

	<div class="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
		<Form form={superform}>
			<input type="hidden" name="id" bind:value={$form.id} />
			<Input
				name="name"
				label="Name"
				type="text"
				placeholder="Svelte"
				description="Enter the name of the tag"
				bind:value={$form.name}
				errors={$errors.name}
			/>
			<Input
				name="slug"
				label="Slug"
				type="text"
				placeholder="svelte"
				description="Enter the slug of the tag"
				magic={() => slugify($form.name)}
				bind:value={$form.slug}
				errors={$errors.slug}
			/>

			<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
				<Button type="submit" width="full">Update Tag</Button>
				<Button href="/admin/tags" variant="secondary">Cancel</Button>
			</div>
		</Form>
	</div>
</div>
