<script lang="ts">
	import { toast } from 'svelte-sonner'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Info from 'phosphor-svelte/lib/Info'
	import { createContent, getTags, getAvailableChildren } from '../content.remote'

	const contentType = $derived(createContent.fields.type.value() || 'recipe')
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Create New Content"
		description="Add a new recipe, announcement, or collection"
		icon={FileText}
	/>

	<div class="rounded-2xl border-2 border-svelte-200 bg-gradient-to-br from-svelte-50 via-white to-svelte-50/50 shadow-sm">
		<div class="border-b border-svelte-100 bg-gradient-to-r from-svelte-100/50 to-white px-6 py-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
					<Info class="h-5 w-5 text-white" weight="duotone" />
				</div>
				<h3 class="text-lg font-bold text-gray-900">Important Information</h3>
			</div>
		</div>
		<div class="p-6">
			<div class="flex items-start gap-4">
				<div class="flex-1">
					<h4 class="font-semibold text-gray-900">Looking to add a video or library?</h4>
					<p class="mt-2 text-sm leading-relaxed text-gray-700">
						Videos and libraries should be imported from their external sources. Use the
						<a href="/admin/external-content" class="font-semibold text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700">External Content</a>
						page to import from YouTube or GitHub, or use the
						<a href="/admin/bulk-import" class="font-semibold text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700">Bulk Import</a>
						feature for multiple items at once.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Content Details</p>
			</div>
		</div>

		<div class="p-8">
			<form
				{...createContent.enhance(async ({ submit }) => {
					try {
						await submit()
						toast.success('Content created successfully!')
					} catch {
						toast.error('Failed to create content')
					}
				})}
				class="flex flex-col gap-4"
			>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="flex flex-col gap-4">
						<Input
							{...createContent.fields.title.as('text')}
							label="Title"
							placeholder="Title of your content"
							description="Enter a descriptive title"
							issues={createContent.fields.title.issues()}
							data-testid="input-title"
						/>
						<Input
							{...createContent.fields.slug.as('text')}
							label="URL Slug"
							placeholder="url-friendly-name"
							description="The slug used in the URL (auto-generated from title)"
							issues={createContent.fields.slug.issues()}
							data-testid="input-slug"
						/>
					</div>

					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<label for="type" class="text-xs font-medium">Content Type</label>
							<select
								{...createContent.fields.type.as('select')}
								id="type"
								class={[
									'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
									'focus:outline-2 focus:outline-sky-200',
									(createContent.fields.type.issues() ?? []).length > 0
										? 'border-red-300 bg-red-50 text-red-600'
										: 'border-transparent'
								]}
								data-testid="select-type"
							>
								<option value="recipe">Recipe</option>
								<option value="announcement">Announcement</option>
								<option value="collection">Collection</option>
								<option value="resource">Resource</option>
							</select>
							<p class="text-xs text-slate-500">Select the type of content</p>
							{#each createContent.fields.type.issues() ?? [] as issue, i (i)}
								<p class="text-xs text-red-600">{issue.message}</p>
							{/each}
						</div>

						<div class="flex flex-col gap-2">
							<label for="status" class="text-xs font-medium">Status</label>
							<select
								{...createContent.fields.status.as('select')}
								id="status"
								class={[
									'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
									'focus:outline-2 focus:outline-sky-200',
									(createContent.fields.status.issues() ?? []).length > 0
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
							{#each createContent.fields.status.issues() ?? [] as issue, i (i)}
								<p class="text-xs text-red-600">{issue.message}</p>
							{/each}
						</div>
					</div>
				</div>

				<TextArea
					{...createContent.fields.description.as('text')}
					label="Description"
					placeholder="Brief description of this content"
					description="A short summary that appears in listings and search results"
					issues={createContent.fields.description.issues()}
					data-testid="textarea-description"
					rows={3}
				/>

				{#if contentType !== 'resource'}
					<MarkdownEditor
						{...createContent.fields.body.as('text')}
						label="Body"
						placeholder="Write your content in Markdown..."
						description="Content body in Markdown format"
						issues={createContent.fields.body?.issues()}
						data-testid="textarea-body"
					/>
				{/if}

				{#if contentType === 'collection'}
					<DynamicSelector
						name="children"
						label="Content"
						description="Select content to add to the collection"
						placeholder="Search content to add..."
						options={await getAvailableChildren()}
						field={createContent.fields.children}
						data-testid="dynamic-selector-children"
					/>
				{/if}

				{#if contentType === 'resource'}
					<Input
						{...createContent.fields.metadata.link.as('text')}
						label="Resource Link"
						placeholder="https://example.com/resource"
						description="The URL to the external resource (required)"
						issues={createContent.fields.metadata?.link?.issues()}
						data-testid="input-resource-link"
					/>

					<Input
						{...createContent.fields.metadata.image.as('text')}
						label="Image URL (optional)"
						placeholder="https://example.com/image.png"
						description="An optional image URL for the resource preview"
						data-testid="input-resource-image"
					/>
				{/if}

				<DynamicSelector
					name="tags"
					label="Tags"
					description="Select tags for this content"
					placeholder="Search tags..."
					options={await getTags()}
					field={createContent.fields.tags}
					data-testid="dynamic-selector-tags"
				/>

				<div class="mt-6 flex gap-4">
					<Button type="submit" width="full" disabled={!!createContent.pending}>
						{createContent.pending ? 'Creating...' : 'Create Content'}
					</Button>
					<Button href="/admin/content" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
