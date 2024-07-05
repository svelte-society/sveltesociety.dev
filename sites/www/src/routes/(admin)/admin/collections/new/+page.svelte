<script lang="ts">
	import SelectAuthor from '../SelectAuthor.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();
	const { form, errors, enhance } = superForm(data.create_form);
</script>

<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
	<div class="space-y-2">
		<label for="title" class="block text-sm font-medium text-gray-700">Title:</label>
		<input
			type="text"
			id="title"
			name="title"
			bind:value={$form.title}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.title}
			<p class="text-xs italic text-red-500">{$errors.title}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
		<textarea
			id="description"
			name="description"
			bind:value={$form.description}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			rows="4"
		></textarea>
		{#if $errors.description}
			<p class="text-xs italic text-red-500">{$errors.description}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<SelectAuthor />
		<label for="author_id" class="block text-sm font-medium text-gray-700">Author ID:</label>
		<input
			type="number"
			id="author_id"
			name="author_id"
			bind:value={$form.author_id}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.author_id}
			<p class="text-xs italic text-red-500">{$errors.author_id}</p>
		{/if}
	</div>

	<div class="pt-4">
		<Button primary type="submit">Create Collection</Button>
	</div>
</form>
