<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Textarea from '$lib/ui/TextArea.svelte'
	import Robot from 'phosphor-svelte/lib/Robot'
	import { createRule, getTemplates } from '../../data.remote'
	import { PLATFORMS, PLATFORM_CONFIG } from '$lib/types/social'
	import type { SocialPlatform } from '$lib/types/social'

	// Get templates for selection
	const templates = await getTemplates()

	// Form state - only for UI controls not handled by field helpers
	let triggerType = $state<'content_published' | 'sponsor_activated' | 'job_published'>('content_published')
	let selectedPlatforms = $state<SocialPlatform[]>(['twitter', 'bluesky', 'linkedin'])
	let isActive = $state(true)
	let useAiGeneration = $state(false)
	let addToQueue = $state(true)
	let createAsDraft = $state(true)

	const triggerOptions = [
		{ value: 'content_published', label: 'Content Published' },
		{ value: 'sponsor_activated', label: 'Sponsor Activated' },
		{ value: 'job_published', label: 'Job Published' }
	]

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

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="New Auto-Posting Rule"
		description="Create a rule to automatically generate posts"
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

	<form {...createRule} class="space-y-6">
		<!-- Hidden fields for values managed by UI state -->
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
					placeholder="e.g., Auto-post new videos"
					data-testid="input-name"
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
					placeholder="Describe what this rule does..."
					rows={2}
				/>
			</div>
		</div>

		<!-- Trigger Configuration -->
		<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Trigger</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<Select
					label="When to Trigger"
					name="trigger_type"
					options={triggerOptions}
					bind:value={triggerType}
				/>
				{#if triggerType === 'content_published'}
					<Select
						label="Content Type Filter"
						name="content_type_filter"
						options={contentTypeOptions}
					/>
				{/if}
			</div>
			{#if triggerType === 'content_published'}
				<div class="mt-4">
					<Input
						label="Tag Filter (comma-separated)"
						name="tag_filter"
						placeholder="e.g., featured, tutorial"
						description="Only trigger for content with these tags. Leave empty for all tags."
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
				/>
				<Select
					label="Delay After Trigger"
					name="delay_minutes"
					options={delayOptions}
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
		{#if createRule.result && !createRule.result.success}
			<div class="rounded-lg bg-red-50 p-4 text-red-800">
				{createRule.result.text}
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex gap-3">
			<Button type="submit" disabled={!!createRule.pending || selectedPlatforms.length === 0} data-testid="submit-button">
				{createRule.pending ? 'Creating...' : 'Create Rule'}
			</Button>
			<a
				href="/admin/social/rules"
				class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				data-testid="cancel-button"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
