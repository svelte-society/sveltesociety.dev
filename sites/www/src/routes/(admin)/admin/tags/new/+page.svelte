<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { slugify } from '$lib/utils/slug';
	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, zod(schema));
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Tag</h1>
	<form method="POST" use:enhance class="space-y-6">
		<Input
			name="name"
			label="Name"
			type="text"
			placeholder="Svelte"
			description="Enter the name of the tag"
			bind:value={$form.name}
			errors={$errors.name}
		/>
		<Input
			name="slug"
			label="Slug"
			placeholder="svelte"
			description="Enter the slug of the tag"
			type="text"
			magic={() => slugify($form.name)}
			bind:value={$form.slug}
			errors={$errors.slug}
		/>
		<button
			type="submit"
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			Create Tag
		</button>
	</form>
</div>
