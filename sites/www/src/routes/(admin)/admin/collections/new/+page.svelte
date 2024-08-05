<script lang="ts">
	import ContentSelector from './ContentSelector.svelte';

	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();
	const { form, enhance, constraints } = superForm(data.form);
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Collection</h1>
	<form method="POST" use:enhance class="space-y-6">
		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title:</label>
			<input
				{...$constraints.title}
				id="title"
				name="title"
				bind:value={$form.title}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			/>
		</div>
		<div>
			<label for="slug" class="mb-1 block text-sm font-medium text-gray-700">Slug:</label>
			<input
				{...$constraints.slug}
				id="slug"
				name="slug"
				bind:value={$form.slug}
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			/>
		</div>
		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
				>Description:</label
			>
			<textarea
				{...$constraints.description}
				id="description"
				name="description"
				bind:value={$form.description}
				class="h-32 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			></textarea>
		</div>

		<div>
			<ContentSelector name="children" bind:selectedIds={$form.children} />
		</div>
		<button
			type="submit"
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			Create Collection
		</button>
	</form>
</div>
