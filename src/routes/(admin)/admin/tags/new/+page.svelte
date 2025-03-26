<script lang="ts">
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import { zod } from 'sveltekit-superforms/adapters'
	import { schema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import Button from '$lib/ui/Button.svelte'
	let { data } = $props()
	const form = superForm(data.form, zod(schema))
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Tag</h1>
	<Form {form}>
		<Input name="name" label="Name" placeholder="Svelte" description="Enter the name of the tag" />
		<Input name="slug" label="Slug" placeholder="svelte" description="Enter the slug of the tag" />
		<Button type="submit" primary fullWidth>Create</Button>
	</Form>
</div>
