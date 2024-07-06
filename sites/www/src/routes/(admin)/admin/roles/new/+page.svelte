<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
	<div class="space-y-2">
		<label for="name" class="mb-2 block text-sm font-bold text-gray-700">Name:</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={$form.name}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.name}
			<p class="text-xs italic text-red-500">{$errors.name}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Description:</label>
		<input
			type="text"
			id="description"
			name="description"
			bind:value={$form.description}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.description}
			<p class="text-xs italic text-red-500">{$errors.description}</p>
		{/if}
	</div>

	<div class="pt-4">
		<Button primary type="submit">Create</Button>
	</div>
</form>
