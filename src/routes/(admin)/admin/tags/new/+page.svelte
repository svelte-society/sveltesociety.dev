<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte'
	import { superForm } from 'sveltekit-superforms'
	import AdminForm from '$lib/ui/admin/AdminForm.svelte'
	import { ADMIN_ROUTES, generateSlug } from '$lib/admin'
	import Button from '$lib/ui/Button.svelte'
	import Tag from 'phosphor-svelte/lib/Tag'

	let { data } = $props()
	const form = superForm(data.form, {
		dataType: 'json'
	})

	const { form: formData } = form

	function handleGenerateSlug() {
		if ($formData.name && !$formData.slug) {
			$formData.slug = generateSlug($formData.name)
		}
	}
</script>

<AdminForm
	title="Create New Tag"
	description="Add a new category tag to organize your content"
	icon={Tag}
	{form}
	cancelHref={ADMIN_ROUTES.tags.list}
	submitLabel="Create Tag"
>
	<Input name="name" label="Name" placeholder="Svelte" description="Enter the name of the tag" />

	<div class="flex gap-2">
		<div class="flex-1">
			<Input
				name="slug"
				label="Slug"
				placeholder="svelte"
				description="URL-friendly version of the name"
			/>
		</div>
		<div class="flex items-end pb-0.5">
			<Button
				type="button"
				size="sm"
				variant="secondary"
				onclick={handleGenerateSlug}
				disabled={!$formData.name}
			>
				Generate
			</Button>
		</div>
	</div>
</AdminForm>
