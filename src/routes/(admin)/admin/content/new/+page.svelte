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
	import DynamicInput from '$lib/ui/form/DynamicInput.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import { createContentSchema } from '$lib/schema/content'
	import { toast } from 'svelte-sonner'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	const form = superForm(data.form, {
		validators: zodClient(createContentSchema),
		dataType: 'json'
	})

	const { form: formData, submitting } = form

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
						.filter((tag) => ($formData.tags || []).includes(tag.id))
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
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Content</h1>

	<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
		<h2 class="mb-2 font-semibold text-blue-900">Looking to add a video or library?</h2>
		<p class="text-sm text-blue-800">
			Videos and libraries should be imported from their external sources. Use the
			<a href="/admin/external-content" class="font-medium underline hover:text-blue-700"
				>External Content</a
			>
			page to import from YouTube or GitHub, or use the
			<a href="/admin/bulk-import" class="font-medium underline hover:text-blue-700">Bulk Import</a>
			feature for multiple items at once.
		</p>
	</div>

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
			description="Select the type of content"
			options={[
				{ value: 'recipe', label: 'Recipe' },
				{ value: 'announcement', label: 'Announcement' }
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

		<div class="space-y-2">
			<label for="body" class="block text-sm font-medium text-gray-700">Content Body</label>
			<div class="w-full rounded-md border border-gray-300 bg-white">
				<MarkdownEditor name="body" value={$formData.body} />
			</div>
		</div>

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
				{$submitting ? 'Creating...' : 'Create Content'}
			</Button>
			<Button href="/admin/content" secondary>Cancel</Button>
		</div>
	</Form>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
