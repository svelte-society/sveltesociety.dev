<!-- src/routes/content/new/+page.svelte -->
<script lang="ts">
	import AutoComplete from '$lib/ui/AutoComplete-Tags.svelte';
	import Button from '$lib/ui/Button.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Create New Content</h1>

	<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
		<div class="space-y-2">
			<label for="title" class="mb-2 block text-sm font-bold text-gray-700">Title:</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={$form.title}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.title}<p class="text-xs italic text-red-500">{$errors.title}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="type" class="mb-2 block text-sm font-bold text-gray-700">Type:</label>
			<select
				id="type"
				name="type"
				bind:value={$form.type}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			>
				<option value="recipe">Recipe</option>
				<option value="video">Video</option>
			</select>
			{#if $errors.type}<p class="text-xs italic text-red-500">{$errors.type}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="body" class="mb-2 block text-sm font-bold text-gray-700">Body:</label>
			<textarea
				id="body"
				name="body"
				bind:value={$form.body}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			></textarea>
			{#if $errors.body}<p class="text-xs italic text-red-500">{$errors.body}</p>{/if}
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
			{#if $errors.slug}<p class="text-xs italic text-red-500">{$errors.slug}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="description" class="mb-2 block text-sm font-bold text-gray-700"
				>Description:</label
			>
			<textarea
				id="description"
				name="description"
				bind:value={$form.description}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			></textarea>
			{#if $errors.description}<p class="text-xs italic text-red-500">{$errors.description}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Tags:</label>
			<AutoComplete
				tags={data.tags}
				bind:selectedTags={$form.tags}
				placeholder="Type to search or create a tag"
			/>
			{#if $errors.description}<p class="text-xs italic text-red-500">{$errors.description}</p>{/if}
		</div>

		<div class="pt-4">
			<Button primary type="submit">Create Content</Button>
		</div>
	</form>
</div>
