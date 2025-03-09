<script lang="ts">
import { superForm } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import Input from '$lib/ui/form/Input.svelte'
import Select from '$lib/ui/form/Select.svelte'
import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
import AutoComplete from '$lib/ui/AutoComplete-Tags.svelte'
import { schema } from './schema'
import { slugify } from '$lib/utils/slug'
import { slide } from 'svelte/transition'
import { page } from '$app/stores'
import Button from '$lib/ui/Button.svelte'

let { data } = $props()
const { form, errors, enhance } = superForm(data.form, {
	validators: zod(schema),
	dataType: 'json'
})
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
		.catch((_) => undefined)
}
async function tryNpm(id: string | undefined): Promise<
	| {
			name: string
			description: string
			keywords: string[]
			maintainers: Array<{
				name: string
			}>
			versions: string[]
	  }
	| undefined
> {
	if (!id) {
		return Promise.reject()
	}
	return fetch(`https://registry.npmjs.org/${id}`)
		.then((response) => response.json())
		.then((response) => ({
			name: response.name,
			description: response.description,
			keywords: response.keywords || [],
			maintainers: response.maintainers || [],
			versions: Object.keys(response.versions || {})
		}))
		.catch((_) => undefined)
}
const startingTitle = $form.title

// Helper function to safely get video ID
function getVideoId(): string {
	if (!$form.metadata || typeof $form.metadata.videoId === 'undefined') {
		return '';
	}
	
	// Handle array case
	if (Array.isArray($form.metadata.videoId)) {
		return $form.metadata.videoId[0] || '';
	}
	
	return $form.metadata.videoId || '';
}

// Helper function to safely get npm package
function getNpmPackage(): string {
	if (!$form.metadata || typeof $form.metadata.npm === 'undefined') {
		return '';
	}
	
	// Handle array case
	if (Array.isArray($form.metadata.npm)) {
		return $form.metadata.npm[0] || '';
	}
	
	return $form.metadata.npm || '';
}

// Helper function to handle form errors as array
function getErrorsAsArray(errors: any): string[] {
	if (!errors) return [];
	if (Array.isArray(errors)) return errors;
	if (errors._errors) return Array.isArray(errors._errors) ? errors._errors : [errors._errors];
	return [];
}

// Helper function to handle form errors as string
function getErrorsAsString(errors: any): string {
	if (!errors) return '';
	if (typeof errors === 'string') return errors;
	
	const errorArray = getErrorsAsArray(errors);
	return errorArray.length > 0 ? errorArray.join(', ') : '';
}

// Create string versions of type and status for binding
let typeValue = $state($form.type as string);
let statusValue = $state($form.status as string);

// Update form values when string values change
$effect(() => {
	$form.type = typeValue as any;
});

$effect(() => {
	$form.status = statusValue as any;
});
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
				{ value: 'video', label: 'Video' },
				{ value: 'library', label: 'Library' },
				{ value: 'announcement', label: 'Announcement' },
				{ value: 'showcase', label: 'Showcase' }
			]}
			bind:value={typeValue}
			errors={getErrorsAsString($errors.type)}
		/>
		<input type="hidden" name="type" value={typeValue} />
		
		<Select
			name="status"
			label="Status"
			description="Select the status"
			options={[
				{ value: 'draft', label: 'Draft' },
				{ value: 'published', label: 'Published' },
				{ value: 'archived', label: 'Archived' }
			]}
			bind:value={statusValue}
			errors={getErrorsAsString($errors.status)}
		/>
		<input type="hidden" name="status" value={statusValue} />
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
			{#await tryVideo(getVideoId()) then info}
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
		{#if $form.type === 'library'}
			<div transition:slide class="space-y-2">
				<Input
					name="metadata[npm]"
					label="NPM name of the package"
					type="text"
					placeholder="@sveltejs/kit"
					description="Enter the NPM package identifier"
					bind:value={$form.metadata.npm}
					errors={$errors.metadata?.npm}
				/>
			</div>
			{#await tryNpm(getNpmPackage()) then info}
				{#if info}
					<div
						class="mx-4 rounded-md border-2 border-transparent bg-slate-100 p-4 text-sm text-slate-800 placeholder-slate-500"
						style="margin-top: 0.5rem"
					>
						<div class="flex items-center gap-4">
							<strong class="text-lg">{info.name}</strong>
							<p>{info.description}</p>
						</div>
						<dl class="mt-4">
							<dt class="font-semibold text-slate-600">Authors / Maintainers</dt>
							<dd class="pl-4">{info.maintainers.map((i) => i.name).join(', ')}</dd>

							<dt class="font-semibold text-slate-600">Keywords</dt>
							<dd class="pl-4">{info.keywords.join(', ')}</dd>
						</dl>
					</div>
					<div class="flex items-end justify-end gap-1 px-4" style="margin-top: 0.5rem;">
						<Button secondary onclick={() => ($form.title = info.name)}>
							<svg
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
									stroke="currentcolor"
									opacity="0.5"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Title
						</Button>
						<Button secondary onclick={() => ($form.description = info.description)}>
							<svg
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
									stroke="currentcolor"
									opacity="0.5"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Description
						</Button>
					</div>
				{/if}
			{/await}
		{/if}
		{#if $form.type === 'showcase'}
			<div transition:slide class="space-y-2">
				<Input
					name="metadata[npm]"
					label="NPM name of the package"
					type="text"
					placeholder="@sveltejs/kit"
					description="Enter the NPM package identifier"
					bind:value={$form.metadata.npm}
					errors={$errors.metadata?.npm}
				/>
			</div>
			{#await tryNpm(getNpmPackage()) then info}
				{#if info}
					<div
						class="mx-4 rounded-md border-2 border-transparent bg-slate-100 p-4 text-sm text-slate-800 placeholder-slate-500"
						style="margin-top: 0.5rem"
					>
						<div class="flex items-center gap-4">
							<strong class="text-lg">{info.name}</strong>
							<p>{info.description}</p>
						</div>
						<dl class="mt-4">
							<dt class="font-semibold text-slate-600">Authors / Maintainers</dt>
							<dd class="pl-4">{info.maintainers.map((i) => i.name).join(', ')}</dd>

							<dt class="font-semibold text-slate-600">Keywords</dt>
							<dd class="pl-4">{info.keywords.join(', ')}</dd>
						</dl>
					</div>
					<div class="flex items-end justify-end gap-1 px-4" style="margin-top: 0.5rem;">
						<Button secondary onclick={() => ($form.title = info.name)}>
							<svg
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
									stroke="currentcolor"
									opacity="0.5"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Title
						</Button>
						<Button secondary onclick={() => ($form.description = info.description)}>
							<svg
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
									stroke="currentcolor"
									opacity="0.5"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Description
						</Button>
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
