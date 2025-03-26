<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { schema } from './schema'

	let { data } = $props()

	const form = superForm(data.form, {
		resetForm: false,
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		validators: zodClient(schema)
	})

	const { submitting } = form
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Role</h1>
	<Form {form}>
		<Input name="name" label="Name" placeholder="Admin" description="Enter the name of the role" />
		<Input
			name="value"
			label="Value"
			placeholder="ADMIN"
			description="Enter the value of the role (usually uppercase)"
		/>
		<Input
			name="description"
			label="Description"
			placeholder="Administrator role with full access"
			description="Enter a description of the role"
		/>
		<div class="pt-4">
			<Button primary type="submit" disabled={$submitting}>
				{$submitting ? 'Creating...' : 'Create Role'}
			</Button>
		</div>
	</Form>
</div>
