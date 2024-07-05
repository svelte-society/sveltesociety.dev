<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';
	const { data } = $props<{ form: any }>();
	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="mb-4 space-y-6 rounded bg-white px-8 pb-8 pt-6 shadow-md">
	<input type="hidden" id="id" name="id" value={$form.id} />

	<div class="mb-4">
		<label for="title" class="mb-2 block text-sm font-bold text-gray-700">Title:</label>
		<input
			type="text"
			id="title"
			name="title"
			bind:value={$form.title}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.title}
			<p class="text-xs italic text-red-500">{$errors.title}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Description:</label>
		<textarea
			id="description"
			name="description"
			bind:value={$form.description}
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			rows="4"
		></textarea>
		{#if $errors.description}
			<p class="text-xs italic text-red-500">{$errors.description}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="author_id" class="mb-2 block text-sm font-bold text-gray-700">Author ID:</label>
		<input
			type="number"
			id="author_id"
			name="author_id"
			bind:value={$form.author_id}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.author_id}
			<p class="text-xs italic text-red-500">{$errors.author_id}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="created_at" class="mb-2 block text-sm font-bold text-gray-700">Created At:</label>
		<input
			type="datetime-local"
			id="created_at"
			name="created_at"
			bind:value={$form.created_at}
			readonly
			class="focus:shadow-outline w-full appearance-none rounded border bg-gray-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
	</div>

	<div class="mb-4">
		<label for="updated_at" class="mb-2 block text-sm font-bold text-gray-700">Updated At:</label>
		<input
			type="datetime-local"
			id="updated_at"
			name="updated_at"
			bind:value={$form.updated_at}
			readonly
			class="focus:shadow-outline w-full appearance-none rounded border bg-gray-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
	</div>

	<div class="flex items-center justify-between">
		<Button primary type="submit">Update Collection</Button>
	</div>
</form>
