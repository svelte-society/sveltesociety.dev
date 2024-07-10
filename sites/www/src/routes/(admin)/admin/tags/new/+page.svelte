<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Create New Tag</h1>

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

		<div class="space-y-2">
			<label for="slug" class="mb-2 block text-sm font-bold text-gray-700">Slug:</label>
			<input
				type="text"
				id="slug"
				name="slug"
				bind:value={$form.slug}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.slug}
				<p class="text-xs italic text-red-500">{$errors.slug}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="color" class="mb-2 block text-sm font-bold text-gray-700">Color:</label>
			<input
				type="color"
				id="color"
				name="color"
				bind:value={$form.color}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.color}
				<p class="text-xs italic text-red-500">{$errors.color}</p>
			{/if}
		</div>

		<div class="pt-4">
			<Button primary type="submit">Create Tag</Button>
		</div>
	</form>
</div>
