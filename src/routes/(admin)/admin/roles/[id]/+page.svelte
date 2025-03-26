<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import { superForm } from 'sveltekit-superforms/client'

	let { data } = $props()

	const form = superForm(data.form, {
		resetForm: false,
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json'
	})

	const { form: formData, submitting } = form
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Role</h1>
	<Form {form} action="">
		<input type="hidden" name="id" value={$formData.id} />

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

		<div class="mb-4">
			<label class="flex items-center space-x-2">
				<input
					type="checkbox"
					name="active"
					checked={$formData.active}
					class="form-checkbox h-5 w-5 text-blue-600"
				/>
				<span class="text-sm font-medium text-gray-700">Active</span>
			</label>
			<p class="mt-1 text-sm text-gray-500">Is this role currently active?</p>
		</div>

		<div class="pt-4">
			<Button primary type="submit" disabled={$submitting}>
				{$submitting ? 'Updating...' : 'Update Role'}
			</Button>
		</div>
	</Form>
</div>
