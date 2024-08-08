<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { schema } from './schema';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, zod(schema));
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Role</h1>
	<form method="POST" use:enhance class="space-y-6">
		<Input
			name="name"
			label="Name"
			type="text"
			placeholder="Admin"
			description="Enter the name of the role"
			bind:value={$form.name}
			errors={$errors.name}
		/>
		<Input
			name="value"
			label="Value"
			type="text"
			placeholder="ADMIN"
			description="Enter the value of the role (usually uppercase)"
			bind:value={$form.value}
			errors={$errors.value}
		/>
		<Input
			name="description"
			label="Description"
			type="text"
			placeholder="Administrator role with full access"
			description="Enter a description of the role"
			bind:value={$form.description}
			errors={$errors.description}
		/>
		<div class="pt-4">
			<Button primary type="submit">Create Role</Button>
		</div>
	</form>
</div>
