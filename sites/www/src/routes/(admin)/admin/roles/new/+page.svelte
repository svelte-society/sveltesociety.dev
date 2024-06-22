<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
	<div class="space-y-2">
		<label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={$form.name}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.name}
			<p class="text-xs italic text-red-500">{$errors.name}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="value" class="block text-sm font-medium text-gray-700">Value:</label>
		<input
			type="text"
			id="value"
			name="value"
			bind:value={$form.value}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.value}
			<p class="text-xs italic text-red-500">{$errors.value}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
		<input
			type="text"
			id="description"
			name="description"
			bind:value={$form.description}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.description}
			<p class="text-xs italic text-red-500">{$errors.description}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="permissions" class="block text-sm font-medium text-gray-700"
			>Permissions (comma-separated):</label
		>
		<input
			type="text"
			id="permissions"
			name="permissions"
			bind:value={$form.permissions}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.permissions}
			<p class="text-xs italic text-red-500">{$errors.permissions}</p>
		{/if}
	</div>

	<div class="pt-4">
		<Button primary type="submit">Create</Button>
	</div>
</form>
