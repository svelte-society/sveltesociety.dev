<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
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
</script>

<form
	{...form.enhance(async ({ submit }) => {
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
					<select
						{...form.fields.type.as('select')}
						id="type"
						class={[
							'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
							'focus:outline-2 focus:outline-sky-200',
							(form.fields.type.issues() ?? []).length > 0
								? 'border-red-300 bg-red-50 text-red-600'
								: 'border-transparent'
						]}
						data-testid="select-type"
					>
						{#each typeOptions as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					<p class="text-xs text-slate-500">Select the type of content</p>
					{#each form.fields.type.issues() ?? [] as issue, i (i)}
						<p class="text-xs text-red-600">{issue.message}</p>
					{/each}
				</div>
			{/if}

			<div class="flex flex-col gap-2">
				<label for="status" class="text-xs font-medium">Status</label>
				<select
					{...form.fields.status.as('select')}
					id="status"
					class={[
						'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
						'focus:outline-2 focus:outline-sky-200',
						(form.fields.status.issues() ?? []).length > 0
							? 'border-red-300 bg-red-50 text-red-600'
							: 'border-transparent'
					]}
					data-testid="select-status"
				>
					<option value="draft">Draft</option>
					<option value="pending_review">Pending Review</option>
					<option value="published">Published</option>
					<option value="archived">Archived</option>
				</select>
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
				<select
					{...form.fields.author_id.as('select')}
					id="author_id"
					class="w-full rounded-md border-2 border-transparent bg-slate-100 px-3 py-1.5 text-sm focus:outline-2 focus:outline-sky-200"
					data-testid="select-author"
				>
					<option value="">Select an author...</option>
					{#each users as user (user.value)}
						<option value={user.value}>{user.label}</option>
					{/each}
				</select>
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

	{#if contentType === 'library' && isImported && content?.metadata?.externalSource?.source === 'github'}
		<div class="space-y-2">
			<div class="rounded-md border border-blue-200 bg-blue-50 p-4">
				<p class="mb-2 text-sm font-medium text-blue-800">GitHub Repository Information</p>
				<div class="flex gap-4">
					{#if content?.metadata?.owner?.avatar}
						<img
							src={getCachedImageWithPreset(content.metadata.owner.avatar, 'avatar')}
							alt={content.metadata.owner.name}
							class="h-16 w-16 rounded"
						/>
					{/if}
					<div class="flex-1 space-y-1 text-sm">
						<div class="flex gap-4">
							<div>
								<span class="font-medium">Owner:</span>
								<a
									href={content?.metadata?.owner?.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-600 underline"
								>
									{content?.metadata?.owner?.name}
								</a>
							</div>
							<div>
								<span class="font-medium">Language:</span>
								{content?.metadata?.language || 'Unknown'}
							</div>
						</div>
						<div class="flex gap-4">
							<div>
								<span class="font-medium">Stars:</span>
								{content?.metadata?.stars || 0}
							</div>
							<div>
								<span class="font-medium">Forks:</span>
								{content?.metadata?.forks || 0}
							</div>
							<div>
								<span class="font-medium">Issues:</span>
								{content?.metadata?.issues || 0}
							</div>
						</div>
						{#if content?.metadata?.topics && content.metadata.topics.length > 0}
							<div>
								<span class="font-medium">Topics:</span>
								{content.metadata.topics.join(', ')}
							</div>
						{/if}
						<div class="flex gap-4">
							{#if content?.metadata?.github}
								<a
									href={content.metadata.github}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-600 underline"
								>
									View on GitHub
								</a>
							{/if}
							{#if content?.metadata?.homepage && content.metadata.homepage !== content?.metadata?.github}
								<a
									href={content.metadata.homepage}
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
