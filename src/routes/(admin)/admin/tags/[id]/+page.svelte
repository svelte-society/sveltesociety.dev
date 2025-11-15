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

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Tag Configuration</p>
			</div>
		</div>

		<div class="p-8">
			<Form form={superform}>
				<input type="hidden" name="id" bind:value={$form.id} />

				<div class="grid gap-6 lg:grid-cols-2">
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
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button type="submit" width="full">Update Tag</Button>
					<Button href="/admin/tags" variant="secondary">Cancel</Button>
				</div>
			</Form>
		</div>
	</div>
</div>
