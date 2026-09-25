<script lang="ts">
	import { page } from '$app/state'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Textarea from '$lib/ui/TextArea.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Trash from 'phosphor-svelte/lib/Trash'
	import Star from 'phosphor-svelte/lib/Star'
	import { getTemplate, updateTemplate, deleteTemplate } from '../../data.remote'

	const templateId = page.params.id!
	const template = $derived(await getTemplate({ id: templateId }))

	// Delete dialog state
	let deleteDialogOpen = $state(false)

	// Create isolated delete form instance
	const remove = deleteTemplate.for(templateId)

	// Form state (initialized from defaults, then synced by $effect)
	let name = $state('')
	let description = $state('')
	let twitterTemplate = $state('')
	let blueskyTemplate = $state('')
	let linkedinTemplate = $state('')
	let isDefault = $state(false)

	// Sync state when template changes
	$effect(() => {
		if (template) {
			name = template.name
			description = template.description ?? ''
			twitterTemplate = template.twitter_template
			blueskyTemplate = template.bluesky_template
			linkedinTemplate = template.linkedin_template
			isDefault = template.is_default
		}
	})

	const contentTypeLabels: Record<string, string> = {
		video: 'Video',
		library: 'Library',
		recipe: 'Recipe',
		resource: 'Resource',
		job: 'Job',
		sponsor: 'Sponsor',
		custom: 'Custom'
	}

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

{#if template}
	<div class="container mx-auto space-y-8 px-2 py-6">
		<PageHeader
			title="Edit Template"
			description={template.name}
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
			<!-- Main Form -->
			<form {...updateTemplate} class="space-y-6">
				<!-- Hidden fields -->
				<input type="hidden" name="id" value={templateId} />
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
							value={name}
							oninput={(e) => (name = e.currentTarget.value)}
							placeholder="e.g., New Video Announcement"
							data-testid="input-name"
							required
						/>
						<div class="flex items-center gap-3 self-end pb-2">
							<div class="rounded-lg bg-gray-50 px-4 py-2">
								<p class="text-sm font-medium text-gray-700">
									Content Type: <span class="text-svelte-600">{contentTypeLabels[template.content_type]}</span>
								</p>
							</div>
						</div>
					</div>
					<div class="mt-4">
						<Textarea
							label="Description"
							name="description"
							bind:value={description}
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
							<span class="text-sm text-gray-700">Set as default template for {contentTypeLabels[template.content_type]} content</span>
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
							bind:value={twitterTemplate}
							placeholder={twitterPlaceholder}
							rows={3}
							description="Max 280 characters"
						/>
						<Textarea
							label="Bluesky Template"
							name="bluesky_template"
							bind:value={blueskyTemplate}
							placeholder={blueskyPlaceholder}
							rows={3}
							description="Max 300 characters"
						/>
						<Textarea
							label="LinkedIn Template"
							name="linkedin_template"
							bind:value={linkedinTemplate}
							placeholder={linkedinPlaceholder}
							rows={4}
							description="Can be longer format"
						/>
					</div>
				</div>

				<!-- Error/Success Messages -->
				{#if updateTemplate.result?.success}
					<div class="rounded-lg bg-green-50 p-4 text-green-800">
						{updateTemplate.result.text}
					</div>
				{/if}
				{#if updateTemplate.result && !updateTemplate.result.success}
					<div class="rounded-lg bg-red-50 p-4 text-red-800">
						{updateTemplate.result.text}
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex gap-3">
					<Button type="submit" disabled={!!updateTemplate.pending} data-testid="save-button">
						{updateTemplate.pending ? 'Saving...' : 'Save Changes'}
					</Button>
					<a
						href="/admin/social/templates"
						class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</a>
				</div>
			</form>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Template Variables Reference -->
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

				<!-- Status Card -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 font-medium text-gray-900">Status</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-500">Default</span>
							{#if template.is_default}
								<span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
									<Star class="h-3 w-3" weight="fill" />
									Yes
								</span>
							{:else}
								<span class="text-gray-900">No</span>
							{/if}
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Created</span>
							<span class="text-gray-900">{new Date(template.created_at).toLocaleDateString()}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Updated</span>
							<span class="text-gray-900">{new Date(template.updated_at).toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				<!-- Delete Card -->
				<div class="rounded-2xl border border-red-200 bg-red-50 p-6">
					<h3 class="mb-2 font-medium text-red-900">Danger Zone</h3>
					<p class="mb-4 text-sm text-red-700">
						Deleting this template cannot be undone. Rules using this template will fall back to default templates.
					</p>
					<DialogTrigger onclick={() => (deleteDialogOpen = true)} variant="danger" data-testid="delete-button">
						<Trash class="mr-1 h-4 w-4" />
						Delete Template
					</DialogTrigger>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-2 py-12 text-center">
		<p class="text-gray-500">Template not found</p>
		<a href="/admin/social/templates" class="mt-4 inline-block text-svelte-500 hover:underline">
			Back to Templates
		</a>
	</div>
{/if}

{#snippet confirmDelete()}
	<form
		{...remove.enhance(async ({ submit }) => {
			await submit()
		})}
	>
		<Button type="submit" variant="danger" disabled={!!remove.pending} data-testid="confirm-delete-button">
			{remove.pending ? 'Deleting...' : 'Confirm Delete'}
		</Button>
	</form>
{/snippet}

<ConfirmDialog
	id="delete-template-dialog"
	bind:open={deleteDialogOpen}
	title="Delete Template"
	description="Are you sure you want to delete this template? This cannot be undone."
	confirm={confirmDelete}
/>
