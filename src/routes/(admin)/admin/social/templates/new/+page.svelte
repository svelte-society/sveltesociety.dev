<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Textarea from '$lib/ui/TextArea.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import { createTemplate } from '../../data.remote'

	// Form state for checkboxes
	let isDefault = $state(false)

	const contentTypeOptions = [
		{ value: 'video', label: 'Video' },
		{ value: 'library', label: 'Library' },
		{ value: 'recipe', label: 'Recipe' },
		{ value: 'resource', label: 'Resource' },
		{ value: 'job', label: 'Job' },
		{ value: 'sponsor', label: 'Sponsor' },
		{ value: 'custom', label: 'Custom' }
	]

	// Placeholder examples for template fields (defined as strings to avoid Svelte interpolation)
	const twitterPlaceholder = '{{title}} - Check it out! {{url}} {{tags}}'
	const blueskyPlaceholder = '{{title}} - Check it out! {{url}} {{tags}}'
	const linkedinPlaceholder = '{{title}}\n\n{{description}}\n\n{{url}}'

	// Template variable reference
	const templateVariables = [
		{ name: '{{title}}', description: 'Content/job/sponsor title' },
		{ name: '{{description}}', description: 'Content description or sponsor tagline' },
		{ name: '{{url}}', description: 'Link URL' },
		{ name: '{{author}}', description: 'Content author name' },
		{ name: '{{tags}}', description: 'Hashtags from content tags' },
		{ name: '{{company}}', description: 'Job company or sponsor name' },
		{ name: '{{location}}', description: 'Job location' }
	]
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="New Template"
		description="Create a template for social media posts"
		icon={FileText}
	>
		{#snippet actions()}
			<a
				href="/admin/social/templates"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="back-button"
			>
				Back to Templates
			</a>
		{/snippet}
	</PageHeader>

	<div class="grid gap-6 lg:grid-cols-[1fr_300px]">
		<form {...createTemplate} class="space-y-6">
			<!-- Hidden fields for checkbox values -->
			{#if isDefault}
				<input type="hidden" name="is_default" value="on" />
			{/if}

			<!-- Basic Info -->
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					<Input
						label="Template Name"
						name="name"
						placeholder="e.g., New Video Announcement"
						data-testid="input-name"
						required
					/>
					<Select
						label="Content Type"
						name="content_type"
						options={contentTypeOptions}
						data-testid="select-content-type"
					/>
				</div>
				<div class="mt-4">
					<Textarea
						label="Description"
						name="description"
						placeholder="What is this template for?"
						rows={2}
					/>
				</div>
				<div class="mt-4">
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							bind:checked={isDefault}
							class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
						/>
						<span class="text-sm text-gray-700">Set as default template for this content type</span>
					</label>
				</div>
			</div>

			<!-- Platform Templates -->
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Platform Templates</h2>
				<p class="mb-4 text-sm text-gray-600">
					Use template variables like <code class="rounded bg-gray-100 px-1 py-0.5 text-xs">{'{{title}}'}</code> to insert dynamic content.
				</p>
				<div class="space-y-4">
					<Textarea
						label="Twitter/X Template"
						name="twitter_template"
						placeholder={twitterPlaceholder}
						rows={3}
						description="Max 280 characters"
						data-testid="textarea-twitter"
					/>
					<Textarea
						label="Bluesky Template"
						name="bluesky_template"
						placeholder={blueskyPlaceholder}
						rows={3}
						description="Max 300 characters"
						data-testid="textarea-bluesky"
					/>
					<Textarea
						label="LinkedIn Template"
						name="linkedin_template"
						placeholder={linkedinPlaceholder}
						rows={4}
						description="Can be longer format"
						data-testid="textarea-linkedin"
					/>
				</div>
			</div>

			<!-- Error/Success Messages -->
			{#if createTemplate.result && !createTemplate.result.success}
				<div class="rounded-lg bg-red-50 p-4 text-red-800">
					{createTemplate.result.text}
				</div>
			{/if}

			<!-- Actions -->
			<div class="flex gap-3">
				<Button type="submit" disabled={!!createTemplate.pending} data-testid="submit-button">
					{createTemplate.pending ? 'Creating...' : 'Create Template'}
				</Button>
				<a
					href="/admin/social/templates"
					class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					data-testid="cancel-button"
				>
					Cancel
				</a>
			</div>
		</form>

		<!-- Sidebar - Template Variables Reference -->
		<div class="space-y-6">
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-medium text-gray-900">Template Variables</h3>
				<div class="space-y-3">
					{#each templateVariables as variable}
						<div class="text-sm">
							<code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-svelte-600">
								{variable.name}
							</code>
							<p class="mt-1 text-gray-500">{variable.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
