<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import Select from '$lib/ui/Select.svelte'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { refreshMetadata } from './data.remote'
	import type { RemoteForm } from '@sveltejs/kit'

	interface Option {
		value: string
		label: string
		avatar?: string
		name?: string
		username?: string
	}

	interface Props {
		mode: 'create' | 'edit'
		form: RemoteForm<any, any>
		contentId?: string
		content?: any
		users?: Option[]
		tagOptions: Option[]
		childrenOptions: Option[]
	}

	let { mode, form, contentId, content, users, tagOptions, childrenOptions = [] }: Props = $props()

	const isEditing = $derived(mode === 'edit')
	const contentType = $derived(isEditing ? content?.type : form.fields.type.value() || 'recipe')
	const isImported = $derived(content?.metadata?.externalSource !== undefined)
	const authorId = $derived(isEditing ? form.fields.author_id?.value() : undefined)
	const currentAuthor = $derived(users?.find((u) => u.value === authorId))

	const typeOptions = [
		{ value: 'recipe', label: 'Recipe' },
		{ value: 'announcement', label: 'Announcement' },
		{ value: 'collection', label: 'Collection' },
		{ value: 'resource', label: 'Resource' }
	]

	const typeLabels: Record<string, string> = {
		video: 'Video',
		library: 'Library',
		recipe: 'Recipe',
		announcement: 'Announcement',
		collection: 'Collection',
		resource: 'Resource'
	}

	const successMessage = $derived(
		isEditing ? 'Content updated successfully!' : 'Content created successfully!'
	)
	const errorMessage = $derived(isEditing ? 'Failed to update content' : 'Failed to create content')
	const submitLabel = $derived(
		form.pending
			? isEditing
				? 'Saving...'
				: 'Creating...'
			: isEditing
				? 'Update Content'
				: 'Create Content'
	)

	const showBody = $derived(
		isImported
			? false
			: contentType !== 'resource' && contentType !== 'video' && contentType !== 'library'
	)

	let refreshing = $state(false)
	const refreshAction = $derived(contentId ? refreshMetadata.for(contentId) : null)
</script>

<!-- Thumbnail section for refreshable content types - outside main form to avoid nested forms -->
{#if (contentType === 'library' || contentType === 'video' || contentType === 'resource') && isEditing}
	{@const thumbnail = contentType === 'resource' ? content?.metadata?.image : content?.metadata?.thumbnail}
	{@const typeLabel = contentType === 'library' ? 'Library' : contentType === 'video' ? 'Video' : 'Resource'}
	{@const sourceHint = contentType === 'library' ? 'GitHub' : contentType === 'video' ? 'YouTube' : 'the resource URL'}
	<div class="mb-4 space-y-2">
		<!-- Thumbnail Status -->
		<div class={[
			'rounded-md border p-4',
			thumbnail ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
		]}>
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<p class={[
						'mb-2 text-sm font-medium',
						thumbnail ? 'text-green-800' : 'text-amber-800'
					]}>
						{thumbnail ? 'Thumbnail Available' : 'Thumbnail Missing'}
					</p>
					{#if thumbnail}
						<img
							src={getCachedImageWithPreset(thumbnail, 'thumbnail')}
							alt="{typeLabel} thumbnail"
							class="w-64 rounded border border-gray-200"
						/>
					{:else}
						<p class="text-sm text-amber-700">
							The thumbnail could not be fetched from {sourceHint}. Click "Refresh Metadata" to try again.
						</p>
					{/if}
				</div>
				{#if refreshAction}
					<form
						{...refreshAction.enhance(async ({ submit }) => {
							refreshing = true
							try {
								await submit()
								if (refreshAction.result?.success) {
									toast.success(refreshAction.result.text || 'Metadata refreshed!')
								} else {
									toast.error(refreshAction.result?.text || 'Failed to refresh metadata')
								}
							} catch {
								toast.error('Failed to refresh metadata')
							}
							refreshing = false
						})}
					>
						<input {...refreshAction.fields.id.as('hidden', contentId)} />
						<button
							type="submit"
							disabled={refreshing}
							class="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
						>
							{refreshing ? 'Refreshing...' : 'Refresh Metadata'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}

<form
	{...form.enhance(async ({ submit }) => {
		// For create, the remote function uses redirect() which throws - let it propagate
		if (!isEditing) {
			await submit()
			return
		}
		// For edit, handle success/error with toasts
		try {
			const result = await submit()
			if (result?.success === true || form.result?.success === true) {
				toast.success(successMessage)
			} else {
				toast.error(result?.text || form.result?.text || errorMessage)
			}
		} catch {
			toast.error(errorMessage)
		}
	})}
	class="flex flex-col gap-4"
>
	{#if isEditing && contentId}
		<input type="hidden" name="id" value={contentId} />
		<input type="hidden" name="type" value={contentType} />
	{/if}

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="flex flex-col gap-4">
			<Input
				{...form.fields.title.as('text')}
				label="Title"
				placeholder="Title of your content"
				description="Enter a descriptive title"
				issues={form.fields.title.issues()}
				data-testid="input-title"
			/>
			<Input
				{...form.fields.slug.as('text')}
				label="URL Slug"
				placeholder="url-friendly-name"
				description="The slug used in the URL (auto-generated from title)"
				issues={form.fields.slug.issues()}
				data-testid="input-slug"
			/>
		</div>

		<div class="flex flex-col gap-4">
			{#if !isEditing}
				<div class="flex flex-col gap-2">
					<label for="type" class="text-xs font-medium">Content Type</label>
					<Select
						{...form.fields.type.as('select')}
						options={typeOptions}
						data-testid="select-type"
					/>
					<p class="text-xs text-slate-500">Select the type of content</p>
					{#each form.fields.type.issues() ?? [] as issue, i (i)}
						<p class="text-xs text-red-600">{issue.message}</p>
					{/each}
				</div>
			{/if}

			<div class="flex flex-col gap-2">
				<label for="status" class="text-xs font-medium">Status</label>
				<Select
					{...form.fields.status.as('select')}
					options={[
						{ value: 'draft', label: 'Draft' },
						{ value: 'pending_review', label: 'Pending Review' },
						{ value: 'published', label: 'Published' },
						{ value: 'archived', label: 'Archived' }
					]}
					data-testid="select-status"
				/>
				<p class="text-xs text-slate-500">Select the publication status</p>
				{#each form.fields.status.issues() ?? [] as issue, i (i)}
					<p class="text-xs text-red-600">{issue.message}</p>
				{/each}
			</div>
		</div>
	</div>

	{#if isEditing && users}
		<div class="grid grid-cols-1 gap-2 space-y-2 rounded-md border-2 border-slate-200 p-4">
			<div class="flex flex-col gap-2">
				<label for="author_id" class="text-xs font-medium">Author</label>
				<Select
					{...form.fields.author_id.as('select')}
					options={[{ value: '', label: 'Select an author...' }, ...users]}
					data-testid="select-author"
				/>
				<p class="text-xs text-slate-500">
					{authorId
						? 'Change the author or submitter of this content'
						: 'Select the author or submitter of this content'}
				</p>
			</div>
			{#if currentAuthor}
				<a
					href="/user/{currentAuthor.username}"
					class="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
				>
					{#if currentAuthor.avatar}
						<img
							src={currentAuthor.avatar}
							alt={currentAuthor.name || currentAuthor.username}
							class="h-10 w-10 rounded-full"
						/>
					{:else}
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700"
						>
							{(currentAuthor.name || currentAuthor.username || '?').charAt(0).toUpperCase()}
						</div>
					{/if}
					<div>
						<p class="font-medium text-gray-900">{currentAuthor.name || currentAuthor.username}</p>
						<p class="text-sm text-gray-500">@{currentAuthor.username}</p>
					</div>
				</a>
			{/if}
		</div>
	{/if}

	{#if contentType === 'video' && isImported && content?.metadata?.externalSource?.source === 'youtube'}
		<div class="space-y-2">
			<div class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
				<p class="mb-2 text-sm font-medium text-yellow-800">YouTube Video Information</p>
				{#if content?.metadata?.thumbnail}
					<div class="flex gap-4">
						<img
							src={getCachedImageWithPreset(content.metadata.thumbnail, 'thumbnail')}
							alt="Video thumbnail"
							class="w-48 rounded"
						/>
						<div class="space-y-1 text-sm">
							<div>
								<span class="font-medium">Channel:</span>
								{content.metadata.channelTitle || 'Unknown'}
							</div>
							<div>
								<span class="font-medium">Published:</span>
								{new Date(content.metadata.publishedAt || '').toLocaleDateString()}
							</div>
							{#if content.metadata.statistics}
								<div>
									<span class="font-medium">Views:</span>
									{content.metadata.statistics.viewCount?.toLocaleString() || 0}
								</div>
								<div>
									<span class="font-medium">Likes:</span>
									{content.metadata.statistics.likeCount?.toLocaleString() || 0}
								</div>
							{/if}
							{#if content.metadata.watchUrl}
								<div>
									<a
										href={content.metadata.watchUrl}
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
			<p class="text-sm text-gray-500 italic">Video metadata is read-only for imported content.</p>
		</div>
	{/if}

	{#if showBody}
		<MarkdownEditor
			{...form.fields.body.as('text')}
			label="Body"
			placeholder="Write your content in Markdown..."
			description="Content body in Markdown format"
			issues={form.fields.body?.issues()}
			data-testid="textarea-body"
		/>
	{/if}

	<TextArea
		{...form.fields.description.as('text')}
		label="Description"
		placeholder="Brief description of this content"
		description="A short summary that appears in listings and search results"
		issues={form.fields.description.issues()}
		data-testid="textarea-description"
		rows={3}
	/>

	{#if contentType === 'collection'}
		<DynamicSelector
			name="children"
			label="Content"
			description="Select content to add to the collection"
			placeholder="Search content to add..."
			options={childrenOptions}
			field={form.fields.children}
			data-testid="dynamic-selector-children"
		/>
	{/if}

	{#if contentType === 'resource'}
		<Input
			{...form.fields.metadata.link.as('text')}
			label="Resource Link"
			placeholder="https://example.com/resource"
			description="The URL to the external resource (required)"
			issues={form.fields.metadata?.link?.issues()}
			data-testid="input-resource-link"
		/>
		{#if isEditing && content?.metadata?.image}
			<div class="rounded-md border border-gray-200 bg-gray-50 p-4">
				<p class="mb-2 text-sm font-medium text-gray-700">Preview Image</p>
				<div class="flex gap-4">
					<img
						src={getCachedImageWithPreset(content.metadata.image, 'thumbnail')}
						alt="Resource preview"
						class="w-48 rounded"
					/>
					<div class="flex-1 space-y-2">
						<p class="text-sm text-gray-600">Image automatically fetched from the resource URL.</p>
						<Input
							{...form.fields.metadata.image.as('text')}
							label="Image URL"
							placeholder="https://example.com/image.png"
							description="Override the auto-fetched image if needed"
							data-testid="input-resource-image"
						/>
					</div>
				</div>
			</div>
		{:else}
			<Input
				{...form.fields.metadata.image.as('text')}
				label="Image URL (optional)"
				placeholder="https://example.com/image.png"
				description="An optional image URL for the resource preview"
				data-testid="input-resource-image"
			/>
		{/if}
	{/if}

	<DynamicSelector
		name="tags"
		label="Tags"
		description="Select tags for this content"
		placeholder="Search tags..."
		options={tagOptions}
		field={form.fields.tags}
		data-testid="dynamic-selector-tags"
	/>

	<div class="mt-6 flex gap-4">
		<Button type="submit" width="full" disabled={!!form.pending}>
			{submitLabel}
		</Button>
		<Button href="/admin/content" variant="secondary">Cancel</Button>
	</div>
</form>
