<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { slide } from 'svelte/transition'
	import { slugify } from '$lib/utils/slug'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import { toast } from 'svelte-sonner'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	let form = superForm(data.form, {
		invalidateAll: 'force',
		dataType: 'json', // Enable JSON data type for nested objects like metadata
		onUpdated: ({ form }) => {
			form?.message?.success ? toast.success(form.message.text) : toast.error(form.message.text)
		}
	})

	const { form: formData, submitting } = form


	// Helper for npm package info
	async function fetchNpmInfo(packageName: string) {
		if (!packageName) return undefined

		try {
			const response = await fetch(`https://registry.npmjs.org/${packageName}`)
			const data = await response.json()
			return {
				name: data.name,
				description: data.description,
				keywords: data.keywords || [],
				maintainers: (data.maintainers || []).map((m: { name: string }) => m.name),
				versions: Object.keys(data.versions || {})
			}
		} catch (error) {
			return undefined
		}
	}

	// Helper to generate slug from title
	function generateSlug() {
		if ($formData.title) {
			$formData.slug = slugify($formData.title)
		}
	}


	function getNpmPackage(): string {
		const metadata = ($formData.metadata as { npm?: string }) || {}
		return metadata.npm || ''
	}
	
	// Check if content is imported
	const isImported = $derived(
		data.content?.metadata?.externalSource !== undefined
	)
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Content</h1>

	{#if isImported}
		<div class="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
			<h2 class="text-sm font-semibold text-blue-800 mb-2">External Source Information</h2>
			<dl class="text-sm text-blue-700 space-y-1">
				<div class="flex gap-2">
					<dt class="font-medium">Source:</dt>
					<dd class="capitalize">{data.content?.metadata?.externalSource?.source}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">External ID:</dt>
					<dd>{data.content?.metadata?.externalSource?.externalId}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">URL:</dt>
					<dd>
						<a href={data.content?.metadata?.externalSource?.url} target="_blank" rel="noopener noreferrer" class="underline">
							{data.content?.metadata?.externalSource?.url}
						</a>
					</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">Last Fetched:</dt>
					<dd>{new Date(data.content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}</dd>
				</div>
			</dl>
		</div>
	{/if}

	<Form {form}>
		<Input
			name="title"
			label="Title"
			placeholder="Title of your content"
			description="Enter a descriptive title"
		/>

		<Select
			name="type"
			label="Content Type"
			description={isImported ? "Content type cannot be changed for imported content" : "Select the type of content"}
			disabled={isImported}
			options={[
				{ value: 'recipe', label: 'Recipe' },
				{ value: 'video', label: 'Video' },
				{ value: 'library', label: 'Library' },
				{ value: 'announcement', label: 'Announcement' },
				{ value: 'showcase', label: 'Showcase' }
			]}
		/>

		<Select
			name="status"
			label="Status"
			description="Select the publication status"
			options={[
				{ value: 'draft', label: 'Draft' },
				{ value: 'published', label: 'Published' },
				{ value: 'archived', label: 'Archived' }
			]}
		/>

		{#if $formData.type === 'video' && isImported && data.content?.metadata?.externalSource?.source === 'youtube'}
			<div transition:slide class="space-y-2">
				<!-- Display YouTube metadata for imported videos -->
				<div class="rounded-md bg-yellow-50 border border-yellow-200 p-4">
					<p class="text-sm font-medium text-yellow-800 mb-2">YouTube Video Information</p>
					{#if data.content?.metadata?.thumbnail}
						<div class="flex gap-4">
							<img src={data.content.metadata.thumbnail} alt="Video thumbnail" class="w-48 rounded" />
							<div class="text-sm space-y-1">
								<div><span class="font-medium">Channel:</span> {data.content.metadata.channelTitle || 'Unknown'}</div>
								<div><span class="font-medium">Published:</span> {new Date(data.content.metadata.publishedAt || '').toLocaleDateString()}</div>
								{#if data.content.metadata.statistics}
									<div><span class="font-medium">Views:</span> {data.content.metadata.statistics.viewCount?.toLocaleString() || 0}</div>
									<div><span class="font-medium">Likes:</span> {data.content.metadata.statistics.likeCount?.toLocaleString() || 0}</div>
								{/if}
								{#if data.content.metadata.watchUrl}
									<div>
										<a href={data.content.metadata.watchUrl} target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">
											Watch on YouTube
										</a>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
				<p class="text-sm text-gray-500 italic">Video metadata is read-only for imported content.</p>
			</div>
		{/if}

		{#if ($formData.type === 'library' || $formData.type === 'showcase') && !isImported}
			<div transition:slide class="space-y-2">
				<Input
					name="metadata.npm"
					label="NPM Package"
					placeholder="e.g. svelte or @sveltejs/kit"
					description="Enter the NPM package name"
				/>

				{#if getNpmPackage()}
					{#await fetchNpmInfo(getNpmPackage()) then info}
						{#if info}
							<div class="mx-4 rounded-md bg-slate-100 p-4 text-sm">
								<div class="flex items-center gap-4">
									<strong class="text-lg">{info.name}</strong>
									<p>{info.description}</p>
								</div>
								<dl class="mt-4">
									<dt class="font-semibold text-slate-600">Maintainers</dt>
									<dd class="pl-4">{info.maintainers.join(', ')}</dd>

									<dt class="font-semibold text-slate-600">Keywords</dt>
									<dd class="pl-4">{info.keywords.join(', ')}</dd>
								</dl>

								<div class="mt-3 flex justify-end gap-2">
									<Button onclick={() => formData.update((f) => ({ ...f, title: info.name }))}>
										Use as Title
									</Button>
									<Button
										onclick={() =>
											formData.update((f) => ({ ...f, description: info.description }))}
									>
										Use as Description
									</Button>
								</div>
							</div>
						{/if}
					{/await}
				{/if}
			</div>
		{/if}

		{#if isImported && !$formData.body}
			<div class="rounded-md bg-gray-50 border border-gray-200 p-4 mb-4">
				<p class="text-sm text-gray-600">
					This imported content doesn't have body text. You can add additional content below if needed.
				</p>
			</div>
		{/if}
		<MarkdownEditor value={$formData.body} name="body" />

		<div class="flex w-full items-center gap-2">
			<Input
				name="slug"
				label="URL Slug"
				placeholder="url-friendly-name"
				description="The slug used in the URL (auto-generated from title)"
			/>
			<Button small secondary onclick={generateSlug}>Generate</Button>
		</div>

		<Textarea
			name="description"
			label="Description"
			placeholder="Brief description of this content"
			description="A short summary that appears in listings and search results"
		/>

		<DynamicSelector
			name="tags"
			label="Tags"
			description="Select tags for this content"
			options={data.tags.map((tag) => ({
				label: tag.name,
				value: tag.id
			}))}
		/>

		<div class="mt-6 flex gap-4">
			<Button type="submit" primary fullWidth disabled={$submitting}>
				{$submitting ? 'Saving...' : 'Update Content'}
			</Button>
			<Button href="/admin/content" secondary>Cancel</Button>
		</div>
	</Form>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
