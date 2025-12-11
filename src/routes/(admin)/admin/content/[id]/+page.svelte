<script lang="ts">
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Info from 'phosphor-svelte/lib/Info'
	import { initForm } from '$lib/utils/form'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import {
		updateContent,
		getContentById,
		getTags,
		getUsers,
		getAvailableChildrenForEdit
	} from '../content.remote'

	const contentId = page.params.id!
	const content = await getContentById({ id: contentId })
	const users = await getUsers()

	initForm(updateContent, () => ({
		id: contentId,
		title: content?.title ?? '',
		slug: content?.slug ?? '',
		description: content?.description ?? '',
		status: content?.status ?? 'draft',
		type: content?.type ?? 'recipe',
		tags: (content?.tags as unknown as { id: string }[] | undefined)?.map((tag) => tag.id) ?? [],
		author_id: content?.author_id ?? '',
		body: (content as unknown as { body?: string })?.body ?? '',
		children:
			content?.type === 'collection' &&
			(content as unknown as { children?: { id: string }[] })?.children
				? (content as unknown as { children: { id: string }[] }).children.map((child) => child.id)
				: [],
		metadata: content?.metadata ?? {}
	}))

	const contentType = $derived(updateContent.fields.type.value() || content?.type || 'recipe')
	const isImported = $derived(content?.metadata?.externalSource !== undefined)
	const authorId = $derived(updateContent.fields.author_id.value())
	const currentAuthor = $derived(users?.find((u) => u.value === authorId))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Content"
		description="Update content information and settings"
		icon={FileText}
	/>

	{#if isImported}
		<div class="rounded-2xl border-2 border-svelte-200 bg-gradient-to-br from-svelte-50 via-white to-svelte-50/50 shadow-sm">
			<div class="border-b border-svelte-100 bg-gradient-to-r from-svelte-100/50 to-white px-6 py-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
						<Info class="h-5 w-5 text-white" weight="duotone" />
					</div>
					<h3 class="text-lg font-bold text-gray-900">External Source Information</h3>
				</div>
			</div>
			<div class="p-6">
				<dl class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Source</dt>
						<dd class="mt-2 text-lg font-bold capitalize text-gray-900">{content?.metadata?.externalSource?.source}</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">External ID</dt>
						<dd class="mt-2 font-mono text-sm font-medium text-gray-900">{content?.metadata?.externalSource?.externalId}</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:col-span-2">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">URL</dt>
						<dd class="mt-2">
							<a
								href={content?.metadata?.externalSource?.url}
								target="_blank"
								rel="noopener noreferrer"
								class="break-all text-sm font-medium text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700"
							>
								{content?.metadata?.externalSource?.url}
							</a>
						</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:col-span-2">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Last Fetched</dt>
						<dd class="mt-2 text-sm font-medium text-gray-900">
							{new Date(content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	{/if}

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Content Details</p>
			</div>
		</div>

		<div class="p-8">
			<form
				{...updateContent.enhance(async ({ submit }) => {
					try {
						await submit()
						toast.success('Content updated successfully!')
					} catch {
						toast.error('Failed to update content')
					}
				})}
				class="flex flex-col gap-4"
			>
				<input type="hidden" name="id" value={contentId} />

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="flex flex-col gap-4">
						<Input
							{...updateContent.fields.title.as('text')}
							label="Title"
							placeholder="Title of your content"
							description="Enter a descriptive title"
							issues={updateContent.fields.title.issues()}
							data-testid="input-title"
						/>
						<Input
							{...updateContent.fields.slug.as('text')}
							label="URL Slug"
							placeholder="url-friendly-name"
							description="The slug used in the URL (auto-generated from title)"
							issues={updateContent.fields.slug.issues()}
							data-testid="input-slug"
						/>
					</div>

					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<label for="type" class="text-xs font-medium">Content Type</label>
							<select
								{...updateContent.fields.type.as('select')}
								id="type"
								disabled={isImported}
								class={[
									'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
									'focus:outline-2 focus:outline-sky-200',
									'disabled:cursor-not-allowed disabled:opacity-50',
									(updateContent.fields.type.issues() ?? []).length > 0
										? 'border-red-300 bg-red-50 text-red-600'
										: 'border-transparent'
								]}
								data-testid="select-type"
							>
								<option value="video">Video</option>
								<option value="library">Library</option>
								<option value="recipe">Recipe</option>
								<option value="announcement">Announcement</option>
								<option value="collection">Collection</option>
								<option value="resource">Resource</option>
							</select>
							<p class="text-xs text-slate-500">
								{isImported ? 'Content type cannot be changed for imported content' : 'Select the type of content'}
							</p>
							{#each updateContent.fields.type.issues() ?? [] as issue, i (i)}
								<p class="text-xs text-red-600">{issue.message}</p>
							{/each}
						</div>

						<div class="flex flex-col gap-2">
							<label for="status" class="text-xs font-medium">Status</label>
							<select
								{...updateContent.fields.status.as('select')}
								id="status"
								class={[
									'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
									'focus:outline-2 focus:outline-sky-200',
									(updateContent.fields.status.issues() ?? []).length > 0
										? 'border-red-300 bg-red-50 text-red-600'
										: 'border-transparent'
								]}
								data-testid="select-status"
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
								<option value="archived">Archived</option>
							</select>
							<p class="text-xs text-slate-500">Select the publication status</p>
							{#each updateContent.fields.status.issues() ?? [] as issue, i (i)}
								<p class="text-xs text-red-600">{issue.message}</p>
							{/each}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-2 space-y-2 rounded-md border-2 border-slate-200 p-4">
					<div class="flex flex-col gap-2">
						<label for="author_id" class="text-xs font-medium">Author</label>
						<select
							{...updateContent.fields.author_id.as('select')}
							id="author_id"
							class="w-full rounded-md border-2 border-transparent bg-slate-100 px-3 py-1.5 text-sm focus:outline-2 focus:outline-sky-200"
							data-testid="select-author"
						>
							<option value="">Select an author...</option>
							{#each users ?? [] as user (user.value)}
								<option value={user.value}>{user.label}</option>
							{/each}
						</select>
						<p class="text-xs text-slate-500">
							{authorId ? 'Change the author or submitter of this content' : 'Select the author or submitter of this content'}
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
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
									{(currentAuthor.name || currentAuthor.username).charAt(0).toUpperCase()}
								</div>
							{/if}
							<div>
								<p class="font-medium text-gray-900">{currentAuthor.name || currentAuthor.username}</p>
								<p class="text-sm text-gray-500">@{currentAuthor.username}</p>
							</div>
						</a>
					{/if}
				</div>

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
											{content?.metadata?.stars?.toLocaleString() || 0}
										</div>
										<div>
											<span class="font-medium">Forks:</span>
											{content?.metadata?.forks?.toLocaleString() || 0}
										</div>
										<div>
											<span class="font-medium">Issues:</span>
											{content?.metadata?.issues?.toLocaleString() || 0}
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
						<p class="text-sm text-gray-500 italic">Repository metadata is read-only for imported content.</p>
					</div>
				{/if}

				{#if isImported}
					<div class="mb-4 rounded-md border border-gray-200 bg-gray-50 p-4">
						<p class="text-sm text-gray-600">
							This imported content doesn't have body text. You can add additional content below if needed.
						</p>
					</div>
				{:else if contentType !== 'resource' && contentType !== 'video' && contentType !== 'library'}
					<MarkdownEditor
						{...updateContent.fields.body.as('text')}
						label="Body"
						placeholder="Write your content in Markdown..."
						description="Content body in Markdown format"
						issues={updateContent.fields.body?.issues()}
						data-testid="textarea-body"
					/>
				{/if}

				<TextArea
					{...updateContent.fields.description.as('text')}
					label="Description"
					placeholder="Brief description of this content"
					description="A short summary that appears in listings and search results"
					issues={updateContent.fields.description.issues()}
					data-testid="textarea-description"
					rows={3}
				/>

				{#if contentType === 'collection'}
					<DynamicSelector
						name="children"
						label="Content"
						description="Select content to add to the collection"
						placeholder="Search content to add..."
						options={await getAvailableChildrenForEdit({ id: contentId })}
						field={updateContent.fields.children}
						data-testid="dynamic-selector-children"
					/>
				{/if}

				{#if contentType === 'resource'}
					<Input
						{...updateContent.fields.metadata.link.as('text')}
						label="Resource Link"
						placeholder="https://example.com/resource"
						description="The URL to the external resource (required)"
						issues={updateContent.fields.metadata?.link?.issues()}
						data-testid="input-resource-link"
					/>
					{#if content?.metadata?.image}
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
										{...updateContent.fields.metadata.image.as('text')}
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
							{...updateContent.fields.metadata.image.as('text')}
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
					options={await getTags()}
					field={updateContent.fields.tags}
					data-testid="dynamic-selector-tags"
				/>

				<div class="mt-6 flex gap-4">
					<Button type="submit" width="full" disabled={!!updateContent.pending}>
						{updateContent.pending ? 'Saving...' : 'Update Content'}
					</Button>
					<Button href="/admin/content" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
