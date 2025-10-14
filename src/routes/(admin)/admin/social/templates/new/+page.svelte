<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import { createTemplate } from '../data.remote'
	import { goto } from '$app/navigation'

	let previewText = $derived.by(() => {
		const template = createTemplate.fields.template.value()
		if (template) {
			return template
				.replace(/\{\{title\}\}/g, sampleData.title)
				.replace(/\{\{description\}\}/g, sampleData.description)
				.replace(/\{\{slug\}\}/g, sampleData.slug)
				.replace(/\{\{url\}\}/g, sampleData.url)
				.replace(/\{\{tags\}\}/g, sampleData.tags)
				.replace(/\{\{author\}\}/g, sampleData.author)
		} else {
			return ''
		}
	})

	// Sample data for preview
	const sampleData = {
		title: 'My Awesome Svelte Component',
		description: 'A reusable component for building amazing UIs',
		slug: 'awesome-svelte-component',
		url: 'https://sveltesociety.dev/recipes/awesome-svelte-component',
		tags: 'svelte, components, ui',
		author: 'John Doe'
	}
</script>

<div class="mx-auto max-w-4xl p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Create Social Media Template</h1>
		<p class="mt-1 text-sm text-gray-600">
			Define a template for automatically generating social media posts
		</p>
	</div>

	<form {...createTemplate} class="space-y-6">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Content Type -->
			<div>
				<label for="content-type" class="block text-sm font-medium text-gray-700">
					Content Type
				</label>
				{#each createTemplate.fields.content_type.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<select
					{...createTemplate.fields.content_type.as('select')}
					id="content-type"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 focus:outline-none"
				>
					<option value="">Select a content type...</option>
					<option value="recipe">Recipe</option>
					<option value="video">Video</option>
					<option value="library">Library</option>
					<option value="announcement">Announcement</option>
					<option value="collection">Collection</option>
				</select>
			</div>

			<!-- Platform -->
			<div>
				<label for="platform" class="block text-sm font-medium text-gray-700">Platform</label>
				{#each createTemplate.fields.platform.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<select
					{...createTemplate.fields.platform.as('select')}
					id="platform"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 focus:outline-none"
				>
					<option value="">Select a platform...</option>
					<option value="bluesky">BlueSky</option>
					<option value="nostr">Nostr</option>
					<option value="linkedin">LinkedIn</option>
				</select>
			</div>
		</div>

		<!-- Template -->
		<div>
			<label for="template" class="block text-sm font-medium text-gray-700">Template</label>
			<p class="mt-1 text-xs text-gray-500">
				Use placeholders like {'{{title}}'}, {'{{description}}'}, {'{{url}}'}, etc.
			</p>
			{#each createTemplate.fields.template.issues() as issue}
				<p class="mt-1 text-sm text-red-600">{issue.message}</p>
			{/each}
			<textarea
				{...createTemplate.fields.template.as('text')}
				id="template"
				rows="6"
				class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none"
				placeholder={'Check out our new {{title}}! {{description}}\n\n🔗 {{url}}\n\n#svelte {{tags}}'}
			></textarea>
		</div>

		<!-- Preview -->
		{#if previewText}
			<div class="rounded-md bg-gray-50 p-4">
				<h3 class="mb-2 text-sm font-medium text-gray-700">Preview</h3>
				<p class="text-sm whitespace-pre-wrap text-gray-900">{previewText}</p>
			</div>
		{/if}

		<!-- Is Default -->
		<div class="flex items-center">
			<input
				{...createTemplate.fields.is_default.as('checkbox')}
				id="is-default"
				class="text-svelte-600 focus:ring-svelte-500 h-4 w-4 rounded border-gray-300"
			/>
			<label for="is-default" class="ml-2 block text-sm text-gray-700">
				Set as default template for this content type and platform
			</label>
		</div>

		<!-- Actions -->
		<div class="flex justify-end space-x-3 border-t pt-4">
			<Button variant="secondary" href="/admin/social/templates">Cancel</Button>
			<Button type="submit" variant="primary" disabled={!!createTemplate.pending}>
				{createTemplate.pending ? 'Creating...' : 'Create Template'}
			</Button>
		</div>
	</form>
</div>
