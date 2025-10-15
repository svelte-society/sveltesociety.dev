<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import { page } from '$app/state'
	import { updateTemplate, getTemplate } from '../data.remote'

	const template = await getTemplate(page.params.id!)

	updateTemplate.fields.id.set(page.params.id!)
	updateTemplate.fields.template.set(template!.template)
	updateTemplate.fields.is_default.set(template!.is_default)

	const generatePreviewText = (text: string) => {
		if (text) {
			return text
				.replace(/\{\{title\}\}/g, sampleData.title)
				.replace(/\{\{description\}\}/g, sampleData.description)
				.replace(/\{\{slug\}\}/g, sampleData.slug)
				.replace(/\{\{url\}\}/g, sampleData.url)
				.replace(/\{\{tags\}\}/g, sampleData.tags)
				.replace(/\{\{author\}\}/g, sampleData.author)
		} else {
			return ''
		}
	}

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

<div class="mx-auto max-w-4xl space-y-6 p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Edit Social Media Template</h1>
		<p class="mt-1 text-sm text-gray-600">
			Update the template for automatically generating social media posts
		</p>
	</div>

	<form {...updateTemplate} class="space-y-6">
		<input type="hidden" name="id" value={template!.id} />

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="content-type" class="block text-sm font-medium text-gray-700">
					Content Type
				</label>
				<input
					type="text"
					name="content_type"
					value={template!.content_type}
					disabled
					class="mt-1 w-full rounded-md border-2 border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 capitalize"
				/>
				<p class="mt-1 text-xs text-gray-500">Cannot be changed after creation</p>
			</div>
			<div>
				<label for="platform" class="block text-sm font-medium text-gray-700">Platform</label>
				<input
					type="text"
					name="platform"
					value={template!.platform}
					disabled
					class="mt-1 w-full rounded-md border-2 border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 capitalize"
				/>
				<p class="mt-1 text-xs text-gray-500">Cannot be changed after creation</p>
			</div>
		</div>

		<div>
			<label for="template" class="block text-sm font-medium text-gray-700">Template</label>
			<p class="mt-1 text-xs text-gray-500">
				Use placeholders like {'{{title}}'}, {'{{description}}'}, {'{{url}}'}, etc.
			</p>
			{#each updateTemplate.fields.template.issues() as issue}
				<p class="mt-1 text-sm text-red-600">{issue.message}</p>
			{/each}
			<textarea
				{...updateTemplate.fields.template.as('text')}
				rows="20"
				class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none"
				placeholder={'Check out our new {{title}}! {{description}}\n\n🔗 {{url}}\n\n#svelte {{tags}}'}
			></textarea>
		</div>

		{#if updateTemplate.fields.template.value()}
			<div class="rounded-md bg-gray-50 p-4">
				<h3 class="mb-2 text-sm font-medium text-gray-700">Preview</h3>
				<p class="text-sm whitespace-pre-wrap text-gray-900">
					{generatePreviewText(updateTemplate.fields.template.value())}
				</p>
			</div>
		{/if}

		<div class="flex items-center">
			<label class="text-sm text-gray-700">
				<input
					{...updateTemplate.fields.is_default.as('checkbox')}
					class="text-svelte-600 focus:ring-svelte-500 mr-1.5 h-4 w-4 rounded border-gray-300"
				/>
				Set as default template for this content type and platform
			</label>
		</div>

		<!-- Actions -->
		<div class="flex justify-end space-x-3 border-t pt-4">
			<Button variant="secondary" href="/admin/social/templates">Cancel</Button>
			<Button type="submit" variant="primary">Save Changes</Button>
		</div>
	</form>
</div>
