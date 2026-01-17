<script lang="ts">
	import { page } from '$app/state'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Textarea from '$lib/ui/Textarea.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'
	import Robot from 'phosphor-svelte/lib/Robot'
	import Trash from 'phosphor-svelte/lib/Trash'
	import { getRule, updateRule, deleteRule, getTemplates } from '../../data.remote'
	import { PLATFORMS, PLATFORM_CONFIG } from '$lib/types/social'
	import type { SocialPlatform } from '$lib/types/social'

	const ruleId = page.params.id!
	const rule = $derived(await getRule({ id: ruleId }))
	const templates = $derived(await getTemplates())

	// Delete dialog state
	let deleteDialogOpen = $state(false)

	// Create isolated delete form instance for this rule
	const remove = deleteRule.for(ruleId)

	// Form state (initialized from defaults, then synced by $effect)
	let name = $state('')
	let description = $state('')
	let isActive = $state(true)
	let contentTypeFilter = $state('')
	let tagFilter = $state('')
	let selectedPlatforms = $state<SocialPlatform[]>(['twitter', 'bluesky', 'linkedin'])
	let templateId = $state('')
	let useAiGeneration = $state(false)
	let delayMinutes = $state(0)
	let addToQueue = $state(true)
	let createAsDraft = $state(true)

	// Sync state when rule changes
	$effect(() => {
		if (rule) {
			name = rule.name
			description = rule.description ?? ''
			isActive = rule.is_active
			contentTypeFilter = rule.content_type_filter ?? ''
			tagFilter = rule.tag_filter?.join(', ') ?? ''
			selectedPlatforms = [...rule.platforms]
			templateId = rule.template_id ?? ''
			useAiGeneration = rule.use_ai_generation
			delayMinutes = rule.delay_minutes
			addToQueue = rule.add_to_queue
			createAsDraft = rule.create_as_draft
		}
	})

	const triggerTypeLabels: Record<string, string> = {
		content_published: 'Content Published',
		sponsor_activated: 'Sponsor Activated',
		job_published: 'Job Published'
	}

	const contentTypeOptions = [
		{ value: '', label: 'All Content Types' },
		{ value: 'video', label: 'Videos' },
		{ value: 'library', label: 'Libraries' },
		{ value: 'recipe', label: 'Recipes' },
		{ value: 'resource', label: 'Resources' }
	]

	const delayOptions = [
		{ value: '0', label: 'Immediately' },
		{ value: '60', label: '1 hour later' },
		{ value: '1440', label: '1 day later' },
		{ value: '2880', label: '2 days later' },
		{ value: '10080', label: '1 week later' }
	]

	function togglePlatform(platform: SocialPlatform) {
		if (selectedPlatforms.includes(platform)) {
			selectedPlatforms = selectedPlatforms.filter((p) => p !== platform)
		} else {
			selectedPlatforms = [...selectedPlatforms, platform]
		}
	}

	// Build template options
	const templateOptions = $derived([
		{ value: '', label: 'Use Default Template' },
		...templates.map((t) => ({ value: t.id, label: `${t.name} (${t.content_type})` }))
	])
</script>

{#if rule}
	<div class="container mx-auto space-y-8 px-2 py-6">
		<PageHeader
			title="Edit Rule"
			description={rule.name}
			icon={Robot}
		>
			{#snippet actions()}
				<a
					href="/admin/social/rules"
					class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
					data-testid="back-button"
				>
					Back to Rules
				</a>
			{/snippet}
		</PageHeader>

		<div class="grid gap-6 lg:grid-cols-[1fr_300px]">
			<!-- Main Form -->
			<form {...updateRule} class="space-y-6">
				<!-- Hidden fields for form submission -->
				<input type="hidden" name="id" value={ruleId} />
				<input type="hidden" name="platforms" value={JSON.stringify(selectedPlatforms)} />
				<!-- Only include checkbox hidden inputs when checked (undefined/missing when unchecked) -->
				{#if isActive}
					<input type="hidden" name="is_active" value="on" />
				{/if}
				{#if useAiGeneration}
					<input type="hidden" name="use_ai_generation" value="on" />
				{/if}
				{#if addToQueue}
					<input type="hidden" name="add_to_queue" value="on" />
				{/if}
				{#if createAsDraft}
					<input type="hidden" name="create_as_draft" value="on" />
				{/if}

				<!-- Basic Info -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
					<div class="grid gap-4 sm:grid-cols-2">
						<Input
							label="Rule Name"
							name="name"
							bind:value={name}
							placeholder="e.g., Auto-post new videos"
							required
						/>
						<div class="flex items-center gap-3 self-end pb-2">
							<label class="relative inline-flex cursor-pointer items-center">
								<input
									type="checkbox"
									bind:checked={isActive}
									class="peer sr-only"
								/>
								<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-svelte-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
								<span class="ml-3 text-sm font-medium text-gray-700">
									{isActive ? 'Active' : 'Inactive'}
								</span>
							</label>
						</div>
					</div>
					<div class="mt-4">
						<Textarea
							label="Description"
							name="description"
							bind:value={description}
							placeholder="Describe what this rule does..."
							rows={2}
						/>
					</div>
				</div>

				<!-- Trigger Configuration -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Trigger</h2>
					<div class="mb-4 rounded-lg bg-gray-50 px-4 py-3">
						<p class="text-sm font-medium text-gray-700">
							Trigger Type: <span class="text-svelte-600">{triggerTypeLabels[rule.trigger_type]}</span>
						</p>
						<p class="mt-1 text-xs text-gray-500">Trigger type cannot be changed after creation.</p>
					</div>
					{#if rule.trigger_type === 'content_published'}
						<div class="grid gap-4 sm:grid-cols-2">
							<Select
								label="Content Type Filter"
								name="content_type_filter"
								options={contentTypeOptions}
								bind:value={contentTypeFilter}
							/>
							<Input
								label="Tag Filter (comma-separated)"
								name="tag_filter"
								bind:value={tagFilter}
								placeholder="e.g., featured, tutorial"
								description="Only trigger for content with these tags"
							/>
						</div>
					{/if}
				</div>

				<!-- Platform Selection -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Platforms</h2>
					<p class="mb-4 text-sm text-gray-600">Select which platforms to create posts for:</p>
					<div class="flex flex-wrap gap-3">
						{#each PLATFORMS as platform}
							<button
								type="button"
								onclick={() => togglePlatform(platform)}
								class="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all"
								class:border-svelte-500={selectedPlatforms.includes(platform)}
								class:bg-svelte-50={selectedPlatforms.includes(platform)}
								class:text-svelte-700={selectedPlatforms.includes(platform)}
								class:border-gray-200={!selectedPlatforms.includes(platform)}
								class:bg-white={!selectedPlatforms.includes(platform)}
								class:text-gray-700={!selectedPlatforms.includes(platform)}
								class:hover:border-gray-300={!selectedPlatforms.includes(platform)}
							>
								{PLATFORM_CONFIG[platform].label}
								{#if selectedPlatforms.includes(platform)}
									<span class="text-svelte-500">✓</span>
								{/if}
							</button>
						{/each}
					</div>
					{#if selectedPlatforms.length === 0}
						<p class="mt-2 text-sm text-red-600">At least one platform must be selected</p>
					{/if}
				</div>

				<!-- Post Configuration -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Post Configuration</h2>
					<div class="grid gap-4 sm:grid-cols-2">
						<Select
							label="Template"
							name="template_id"
							options={templateOptions}
							bind:value={templateId}
						/>
						<Select
							label="Delay After Trigger"
							name="delay_minutes"
							options={delayOptions}
							value={String(delayMinutes)}
							onchange={(e) => delayMinutes = parseInt((e.target as HTMLSelectElement).value)}
						/>
					</div>
					<div class="mt-4 space-y-3">
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={useAiGeneration}
								class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
							/>
							<span class="text-sm text-gray-700">Use AI to generate post text (experimental)</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={addToQueue}
								class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
							/>
							<span class="text-sm text-gray-700">Add to posting queue (uses optimal posting times)</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={createAsDraft}
								class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
							/>
							<span class="text-sm text-gray-700">Create as draft (requires manual approval)</span>
						</label>
					</div>
				</div>

				<!-- Error/Success Messages -->
				{#if updateRule.result?.success}
					<div class="rounded-lg bg-green-50 p-4 text-green-800">
						{updateRule.result.text}
					</div>
				{/if}
				{#if updateRule.result && !updateRule.result.success}
					<div class="rounded-lg bg-red-50 p-4 text-red-800">
						{updateRule.result.text}
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex gap-3">
					<Button type="submit" disabled={!!updateRule.pending || selectedPlatforms.length === 0} data-testid="save-button">
						{updateRule.pending ? 'Saving...' : 'Save Changes'}
					</Button>
					<a
						href="/admin/social/rules"
						class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</a>
				</div>
			</form>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Status Card -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 font-medium text-gray-900">Status</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-500">Status</span>
							<span
								class="rounded-full px-2 py-0.5 text-xs font-medium"
								class:bg-green-100={rule.is_active}
								class:text-green-800={rule.is_active}
								class:bg-gray-100={!rule.is_active}
								class:text-gray-600={!rule.is_active}
							>
								{rule.is_active ? 'Active' : 'Inactive'}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Created</span>
							<span class="text-gray-900">{new Date(rule.created_at).toLocaleDateString()}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Updated</span>
							<span class="text-gray-900">{new Date(rule.updated_at).toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				<!-- Delete Card -->
				<div class="rounded-2xl border border-red-200 bg-red-50 p-6">
					<h3 class="mb-2 font-medium text-red-900">Danger Zone</h3>
					<p class="mb-4 text-sm text-red-700">
						Deleting this rule cannot be undone. Posts already created by this rule will not be affected.
					</p>
					<DialogTrigger onclick={() => (deleteDialogOpen = true)} variant="danger" data-testid="delete-button">
						<Trash class="mr-1 h-4 w-4" />
						Delete Rule
					</DialogTrigger>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-2 py-12 text-center">
		<p class="text-gray-500">Rule not found</p>
		<a href="/admin/social/rules" class="mt-4 inline-block text-svelte-500 hover:underline">
			Back to Rules
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
	id="delete-rule-dialog"
	bind:open={deleteDialogOpen}
	title="Delete Rule"
	description="Are you sure you want to delete this rule? This cannot be undone."
	confirm={confirmDelete}
/>
