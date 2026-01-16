<script lang="ts">
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import ContentSection from './ContentSection.svelte'
	import CampaignTypeSelector from './CampaignTypeSelector.svelte'
	import AnnouncementEditor from './AnnouncementEditor.svelte'
	import JobsContentSection from './JobsContentSection.svelte'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { CampaignType, JobItemWithContent } from '$lib/types/newsletter'

	interface ContentItem {
		id: string
		title: string
		type: string
		custom_description?: string | null
	}

	interface Props {
		mode: 'create' | 'edit'
		form: RemoteForm<any, any>
		formId?: string
		campaignId?: string
		campaignType?: CampaignType
		initialItems?: ContentItem[]
		availableJobs?: JobItemWithContent[]
		initialJobIds?: string[]
	}

	let {
		mode,
		form,
		formId = 'campaign-form',
		campaignId,
		campaignType = $bindable('content_highlights'),
		initialItems = [],
		availableJobs = [],
		initialJobIds = []
	}: Props = $props()

	const isEditing = $derived(mode === 'edit')

	// Local state for content items (content_highlights)
	let contentItems = $state<ContentItem[]>([...initialItems])

	// Local state for job IDs (jobs_roundup)
	let selectedJobIds = $state<string[]>([...initialJobIds])

	function handleTypeChange(type: CampaignType) {
		campaignType = type
		// Reset type-specific state when type changes in create mode
		if (!isEditing) {
			contentItems = []
			selectedJobIds = []
		}
	}

	function handleJobSelectionChange(ids: string[]) {
		selectedJobIds = ids
	}

	// Get right panel title based on campaign type
	const rightPanelTitle = $derived(() => {
		switch (campaignType) {
			case 'content_highlights':
				return 'Campaign Content'
			case 'announcement':
				return 'Announcement Content'
			case 'jobs_roundup':
				return 'Select Jobs'
			default:
				return 'Content'
		}
	})
</script>

<form id={formId} {...form} class="flex flex-col gap-6">
	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Left Column: Campaign Details -->
		<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Campaign Details</p>
				</div>
			</div>
			<div class="space-y-6 p-8">
				{#if isEditing && campaignId}
					<input type="hidden" name="id" value={campaignId} />
				{/if}
				<input type="hidden" name="campaign_type" value={campaignType} />

				{#if !isEditing}
					<CampaignTypeSelector
						value={campaignType}
						onchange={handleTypeChange}
						disabled={isEditing}
					/>
				{/if}

				<Input
					{...form.fields.title.as('text')}
					label="Campaign Title"
					placeholder={campaignType === 'content_highlights'
						? 'Weekly Svelte Digest #42'
						: campaignType === 'announcement'
							? 'Important Community Update'
							: 'Svelte Jobs Roundup'}
					description="Internal title for this campaign"
					issues={form.fields.title.issues()}
					data-testid="input-title"
				/>

				<Input
					{...form.fields.subject.as('text')}
					label="Email Subject"
					placeholder={campaignType === 'content_highlights'
						? 'This week in Svelte: New features, libraries, and more!'
						: campaignType === 'announcement'
							? 'Announcing: Important Update from Svelte Society'
							: 'New Svelte Jobs This Week'}
					description="The subject line subscribers will see"
					issues={form.fields.subject.issues()}
					data-testid="input-subject"
				/>

				<!-- Intro text for content_highlights type -->
				{#if campaignType === 'content_highlights'}
					<TextArea
						{...form.fields.intro_text.as('text')}
						label="Introduction Text"
						placeholder="Welcome to this week's edition of the Svelte Society newsletter..."
						description="Optional introductory text shown before the content items"
						issues={form.fields.intro_text?.issues()}
						data-testid="textarea-intro-text"
						rows={4}
					/>
				{/if}
			</div>
		</div>

		<!-- Right Column: Type-Specific Content -->
		<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">{rightPanelTitle()}</p>
				</div>
			</div>
			<div class="p-8">
				{#if campaignType === 'content_highlights'}
					<ContentSection items={contentItems} field={form.fields.items} />
				{:else if campaignType === 'announcement'}
					<AnnouncementEditor
						bodyHtmlField={form.fields.body_html}
						ctaTextField={form.fields.cta_text}
						ctaUrlField={form.fields.cta_url}
					/>
				{:else if campaignType === 'jobs_roundup'}
					<JobsContentSection
						jobs={availableJobs}
						selectedIds={selectedJobIds}
						onSelectionChange={handleJobSelectionChange}
						introTextField={form.fields.jobs_intro_text}
					/>
					<!-- Hidden inputs for job IDs -->
					{#each selectedJobIds as jobId, i}
						<input type="hidden" name="job_ids[{i}]" value={jobId} />
					{/each}
				{/if}
			</div>
		</div>
	</div>
</form>
