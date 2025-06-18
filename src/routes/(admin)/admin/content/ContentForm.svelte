<script>
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import MarkdownEditor from '$lib/ui/form/MarkdownEditor.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { slide } from 'svelte/transition'

	let { form, isImported = false, isEditing = false, data } = $props()

	const { form: formData, submitting } = form
</script>

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
		disabled={isImported || isEditing}
		options={[
			{ value: 'recipe', label: 'Recipe' },
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
			<p class="text-sm text-gray-500 italic">Video metadata is read-only for imported content.</p>
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
	{/if}

	{#if isImported}
		<div class="mb-4 rounded-md border border-gray-200 bg-gray-50 p-4">
			<p class="text-sm text-gray-600">
				This imported content doesn't have body text. You can add additional content below if
				needed.
			</p>
		</div>
	{:else}
		<MarkdownEditor name="body" />
	{/if}

	<Input
		name="slug"
		label="URL Slug"
		placeholder="url-friendly-name"
		description="The slug used in the URL (auto-generated from title)"
	/>

	<Textarea
		name="description"
		label="Description"
		placeholder="Brief description of this content"
		description="A short summary that appears in listings and search results"
	/>

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
