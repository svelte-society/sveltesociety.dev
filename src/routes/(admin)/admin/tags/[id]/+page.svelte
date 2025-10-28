<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import { zod4 } from 'sveltekit-superforms/adapters'
	import { superForm } from 'sveltekit-superforms'
	import { slugify } from '$lib/utils/slug'
	import { z } from 'zod'

	// Define the schema locally to match the server
	const schema = z.object({
		id: z.string(),
		name: z.string().min(1, 'Name is required'),
		slug: z.string().min(1, 'Slug is required')
	})

	let { data } = $props()
	const { form, errors, enhance } = superForm(data.form)
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Tag</h1>
	<form method="POST" use:enhance class="space-y-6">
		<input type="hidden" name="id" bind:value={$form.id} />
		<Input
			name="name"
			label="Name"
			type="text"
			placeholder="Svelte"
			description="Enter the name of the tag"
		/>
		<Input
			name="slug"
			label="Slug"
			type="text"
			placeholder="svelte"
			description="Enter the slug of the tag"
			magic={() => slugify($form.name)}
		/>
		<Button width="full">Update Tag</Button>
	</form>
</div>
