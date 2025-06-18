<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import MarkdownEditor from '$lib/ui/form/MarkdownEditor.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { slide } from 'svelte/transition'
	import { slugify } from '$lib/utils/slug'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import { toast } from 'svelte-sonner'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

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

	// Generate description using AI
	let generatingDescription = $state(false)

	async function generateDescription() {
		if (!$formData.body || $formData.body.trim() === '') {
			toast.error('Please add some content to the body first')
			return
		}

		generatingDescription = true

		try {
			const response = await fetch('/api/generate-description', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					body: $formData.body,
					title: $formData.title,
					type: $formData.type
				})
			})

			if (!response.ok) {
				const error = await response.text()
				throw new Error(error || 'Failed to generate description')
			}

			const { description } = await response.json()
			$formData.description = description
			toast.success('Description generated successfully')
		} catch (error) {
			console.error('Error generating description:', error)
			toast.error(error instanceof Error ? error.message : 'Failed to generate description')
		} finally {
			generatingDescription = false
		}
	}

	// Suggest tags using AI
	let suggestingTags = $state(false)

	async function suggestTags() {
		if (!$formData.title && !$formData.body && !$formData.description) {
			toast.error('Please add a title, description, or body content first')
			return
		}

		suggestingTags = true

		try {
			const response = await fetch('/api/suggest-tags', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: $formData.title,
					body: $formData.body,
					description: $formData.description,
					type: $formData.type,
					existingTags: data.tags
						.filter((tag) => $formData.tags.includes(tag.id))
						.map((tag) => tag.name)
				})
			})

			if (!response.ok) {
				const error = await response.text()
				throw new Error(error || 'Failed to suggest tags')
			}

			const { tags } = await response.json()

			// Add suggested tags to the current selection
			const newTagIds = tags.map((tag: any) => tag.id)
			const currentTags = $formData.tags || []
			$formData.tags = [...new Set([...currentTags, ...newTagIds])]

			toast.success(`Added ${newTagIds.length} suggested tags`)
		} catch (error) {
			console.error('Error suggesting tags:', error)
			toast.error(error instanceof Error ? error.message : 'Failed to suggest tags')
		} finally {
			suggestingTags = false
		}
	}

	function getNpmPackage(): string {
		const metadata = ($formData.metadata as { npm?: string }) || {}
		return metadata.npm || ''
	}

	// Check if content is imported
	const isImported = $derived(data.content?.metadata?.externalSource !== undefined)
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Content</h1>

	{#if isImported}
		<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
			<h2 class="mb-2 text-sm font-semibold text-blue-800">External Source Information</h2>
			<dl class="space-y-1 text-sm text-blue-700">
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
						<a
							href={data.content?.metadata?.externalSource?.url}
							target="_blank"
							rel="noopener noreferrer"
							class="underline"
						>
							{data.content?.metadata?.externalSource?.url}
						</a>
					</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">Last Fetched:</dt>
					<dd>
						{new Date(data.content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}
					</dd>
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
			description={isImported
				? 'Content type cannot be changed for imported content'
				: 'Select the type of content'}
			disabled={isImported}
			options={[
				{ value: 'recipe', label: 'Recipe' },
				{ value: 'video', label: 'Video' },
				{ value: 'library', label: 'Library' },
				{ value: 'announcement', label: 'Announcement' },
				{ value: 'collection', label: 'Collection' }
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
				<div class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
					<p class="mb-2 text-sm font-medium text-yellow-800">YouTube Video Information</p>
					{#if data.content?.metadata?.thumbnail}
						<div class="flex gap-4">
							<img
								src={getCachedImageWithPreset(data.content.metadata.thumbnail, 'thumbnail')}
								alt="Video thumbnail"
								class="w-48 rounded"
							/>
							<div class="space-y-1 text-sm">
								<div>
									<span class="font-medium">Channel:</span>
									{data.content.metadata.channelTitle || 'Unknown'}
								</div>
								<div>
									<span class="font-medium">Published:</span>
									{new Date(data.content.metadata.publishedAt || '').toLocaleDateString()}
								</div>
								{#if data.content.metadata.statistics}
									<div>
										<span class="font-medium">Views:</span>
										{data.content.metadata.statistics.viewCount?.toLocaleString() || 0}
									</div>
									<div>
										<span class="font-medium">Likes:</span>
										{data.content.metadata.statistics.likeCount?.toLocaleString() || 0}
									</div>
								{/if}
								{#if data.content.metadata.watchUrl}
									<div>
										<a
											href={data.content.metadata.watchUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-600 underline"
										>
											Watch on YouTube
										</a>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
				<p class="text-sm text-gray-500 italic">
					Video metadata is read-only for imported content.
				</p>
			</div>
		{/if}

		{#if $formData.type === 'library' && isImported && data.content?.metadata?.externalSource?.source === 'github'}
			<div transition:slide class="space-y-2">
				<!-- Display GitHub metadata for imported repositories -->
				<div class="rounded-md border border-blue-200 bg-blue-50 p-4">
					<p class="mb-2 text-sm font-medium text-blue-800">GitHub Repository Information</p>
					<div class="flex gap-4">
						{#if data.content?.metadata?.owner?.avatar}
							<img
								src={getCachedImageWithPreset(data.content.metadata.owner.avatar, 'avatar')}
								alt={data.content.metadata.owner.name}
								class="h-16 w-16 rounded"
							/>
						{/if}
						<div class="flex-1 space-y-1 text-sm">
							<div class="flex gap-4">
								<div>
									<span class="font-medium">Owner:</span>
									<a
										href={data.content.metadata.owner?.url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 underline">{data.content.metadata.owner?.name}</a
									>
								</div>
								<div>
									<span class="font-medium">Language:</span>
									{data.content.metadata.language || 'Unknown'}
								</div>
							</div>
							<div class="flex gap-4">
								<div>
									<span class="font-medium">⭐ Stars:</span>
									{data.content.metadata.stars?.toLocaleString() || 0}
								</div>
								<div>
									<span class="font-medium">🍴 Forks:</span>
									{data.content.metadata.forks?.toLocaleString() || 0}
								</div>
								<div>
									<span class="font-medium">🐛 Issues:</span>
									{data.content.metadata.issues?.toLocaleString() || 0}
								</div>
							</div>
							{#if data.content.metadata.topics && data.content.metadata.topics.length > 0}
								<div>
									<span class="font-medium">Topics:</span>
									{data.content.metadata.topics.join(', ')}
								</div>
							{/if}
							<div class="flex gap-4">
								{#if data.content.metadata.github}
									<a
										href={data.content.metadata.github}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 underline"
									>
										View on GitHub
									</a>
								{/if}
								{#if data.content.metadata.homepage && data.content.metadata.homepage !== data.content.metadata.github}
									<a
										href={data.content.metadata.homepage}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 underline"
									>
										Homepage
									</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<p class="text-sm text-gray-500 italic">
					Repository metadata is read-only for imported content.
				</p>
			</div>
		{:else if ($formData.type === 'library' || $formData.type === 'showcase') && !isImported}
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
			<div class="mb-4 rounded-md border border-gray-200 bg-gray-50 p-4">
				<p class="text-sm text-gray-600">
					This imported content doesn't have body text. You can add additional content below if
					needed.
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

		<div class="space-y-2">
			<Textarea
				name="description"
				label="Description"
				placeholder="Brief description of this content"
				description="A short summary that appears in listings and search results"
			/>
			<div class="flex justify-end">
				<Button
					small
					secondary
					onclick={generateDescription}
					disabled={generatingDescription || !$formData.body}
				>
					{generatingDescription ? 'Generating...' : 'Generate with AI'}
				</Button>
			</div>
		</div>

		{#if $formData.type === 'collection'}
			<div transition:slide class="space-y-2">
				<DynamicSelector
					name="children"
					label="Content"
					description="Select content to add to the collection"
					options={data.availableContent.map((item) => ({
						label: `${item.title} (${item.type})`,
						value: item.id
					}))}
				/>
			</div>
		{/if}

		<div>
			<DynamicSelector
				name="tags"
				label="Tags"
				description="Select tags for this content"
				options={data.tags.map((tag) => ({
					label: tag.name,
					value: tag.id
				}))}
			/>
			<div class="mt-2 flex justify-end">
				<Button
					small
					secondary
					onclick={suggestTags}
					disabled={suggestingTags ||
						(!$formData.title && !$formData.body && !$formData.description)}
				>
					{suggestingTags ? 'Suggesting...' : 'Suggest Tags with AI'}
				</Button>
			</div>
		</div>

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
