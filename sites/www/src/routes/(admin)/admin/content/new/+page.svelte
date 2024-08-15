<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import Input from '$lib/ui/form/Input.svelte';
	import Select from '$lib/ui/form/Select.svelte';
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte';
	import AutoComplete from '$lib/ui/AutoComplete-Tags.svelte';
	import { schema } from './schema';
	import {slugify} from "$lib/utils/slug";

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, zod(schema));
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Content</h1>
	<form method="POST" use:enhance class="space-y-6">
		<Input
			name="title"
			label="Title"
			type="text"
			placeholder="Best Svelte Runes Tutorial"
			description="Enter the title of the content"
			bind:value={$form.title}
			errors={$errors.title}
		/>
		<Select
			name="type"
			label="Type"
			description="Select the type of content"
			options={[
				{ value: 'recipe', label: 'Recipe' },
				{ value: 'video', label: 'Video' }
			]}
			bind:value={$form.type}
			errors={$errors.type}
		/>
		<div class="space-y-2">
			<label for="body" class="block text-sm font-medium text-gray-700">Body</label>
			<div
				class="w-full rounded-md border-2 border-transparent bg-slate-100 text-sm text-slate-800 placeholder-slate-500"
			>
				<div class="px-2 py-1.5 pr-4">
					<MarkdownEditor name="body" bind:value={$form.body} />
				</div>
			</div>
			{#if $errors.body}<p class="text-xs italic text-red-500">{$errors.body}</p>{/if}
		</div>
		<Input
			name="slug"
			label="Slug"
			type="text"
			placeholder="best-svelte-runes-tutorial"
			description="Enter the slug for the content URL"
			magic={() => slugify($form.title)}
			bind:value={$form.slug}
			errors={$errors.slug}
		/>
		<Input
			name="description"
			label="Description"
			type="textarea"
			placeholder="Learn how to use Svelte runes effectively"
			description="Enter a brief description of the content"
			bind:value={$form.description}
			errors={$errors.description}
		/>
		<div class="space-y-2">
			<label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
			<AutoComplete
				tags={data.tags}
				placeholder="Type to search or create a tag"
				description="Select tags for your content"
				errors={$errors.tags?._errors}
			/>
		</div>
		<button
			type="submit"
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			Create Content
		</button>
	</form>
</div>

<SuperDebug data={$errors} />
