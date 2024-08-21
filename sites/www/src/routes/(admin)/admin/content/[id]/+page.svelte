<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import Input from '$lib/ui/form/Input.svelte';
	import 
	import Select from '$lib/ui/form/Select.svelte';
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte';
	import AutoComplete from '$lib/ui/AutoComplete-Tags.svelte';
	import { schema } from './schema';
	import { slugify } from '$lib/utils/slug';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, {
		validators: zod(schema),
		dataType: 'json'
	});
	async function tryVideo(
		id: string
	): Promise<{ preview: string; title: string; author: string } | undefined> {
		return fetch(
			`https://www.youtube.com/oembed?url=https%3A//youtube.com/watch%3Fv%3D${id}&format=json`
		)
			.then((response) => response.json())
			.then((response) => ({
				preview: response.thumbnail_url,
				title: response.title,
				author: response.author_name
			}))
			.catch((_) => undefined);
	}
	const startingTitle = $form.title;
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">
		{#if $page.params.id === 'new'}Create New Content{:else}Edit <var>{startingTitle}</var>{/if}
	</h1>
	<form method="POST" use:enhance class="space-y-6">
		<input type="hidden" name="status" value={$form.status} />
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
		<Select
			name="status"
			label="Status"
			description="Select the status"
			options={[
				{ value: 'draft', label: 'Draft' },
				{ value: 'published', label: 'Published' },
				{ value: 'archived', label: 'Archived' }
			]}
			bind:value={$form.status}
			errors={$errors.status}
		/>
		{#if $form.type === 'video'}
			<div transition:slide class="space-y-2">
				<Input
					name="metadata[videoId]"
					label="Youtube video Id"
					type="text"
					placeholder="RVnxF3j3N8U"
					description="Enter the Id of the Youtube video"
					bind:value={$form.metadata.videoId}
					errors={$errors.metadata?.videoId}
				/>
			</div>
			{#await tryVideo($form.metadata.videoId) then info}
				{#if info}
					<div
						class="mx-4 flex gap-4 rounded-md border-2 border-transparent bg-slate-100 p-4 text-sm text-slate-800 placeholder-slate-500"
						style="margin-top: 0.5rem"
					>
						<img src={info.preview} alt="Video preview" class="max-w-xs rounded" />
						<div>
							<strong>{info.title}</strong>
							<div><i>by</i> {info.author}</div>
						</div>
					</div>
				{/if}
			{/await}
		{/if}
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
				bind:selectedTags={$form.tags}
			/>
		</div>
		<Button primary fullWidth>
			{#if $page.params.id === 'new'}Create Content{:else}Update Content{/if}
		</Button>
	</form>
</div>
