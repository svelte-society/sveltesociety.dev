<script lang="ts">
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import Eye from 'phosphor-svelte/lib/Eye'
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt'
	import ChartLine from 'phosphor-svelte/lib/ChartLine'
	import Copy from 'phosphor-svelte/lib/Copy'
	import { initForm } from '$lib/utils/form.svelte'
	import CampaignForm from '../CampaignForm.svelte'
	import {
		createCampaign,
		updateCampaign,
		getCampaign,
		sendCampaign,
		copyCampaign,
		getAvailableJobs
	} from './data.remote'
	import {
		CAMPAIGN_TYPE_CONFIG,
		type CampaignType,
		type ContentHighlightsCampaignWithItems,
		type AnnouncementCampaign,
		type JobsRoundupCampaignWithItems
	} from '$lib/types/newsletter'

	const campaignId = page.params.id!
	const isNew = campaignId === 'new'
	const sendDialogId = `send-confirm-${campaignId}`
	let sendDialogOpen = $state(false)

	// State for new campaign type selection
	let selectedCampaignType = $state<CampaignType>('content_highlights')

	// Only fetch campaign if editing
	const campaign = $derived(isNew ? null : await getCampaign(campaignId))

	// Always fetch available jobs (needed for jobs_roundup type)
	const availableJobs = $derived(await getAvailableJobs())

	// Check if campaign has been sent
	const isSent = $derived(campaign?.status === 'sent')

	// Get campaign type
	const campaignType = $derived(campaign?.campaign_type ?? selectedCampaignType)

	// Get type config for display
	const typeConfig = $derived(CAMPAIGN_TYPE_CONFIG[campaignType])

	// Determine if send button should be disabled
	const cannotSend = $derived(() => {
		if (!campaign) return true
		if (sendCampaign.pending) return true

		switch (campaign.campaign_type) {
			case 'content_highlights': {
				const c = campaign as ContentHighlightsCampaignWithItems
				return c.type_data.items.length === 0
			}
			case 'announcement': {
				const c = campaign as AnnouncementCampaign
				return !c.type_data.body_html
			}
			case 'jobs_roundup': {
				const c = campaign as JobsRoundupCampaignWithItems
				return c.type_data.jobs.length === 0
			}
		}
	})

	// Initialize the appropriate form (only for non-sent campaigns)
	if (isNew) {
		initForm(createCampaign, () => ({
			title: '',
			subject: '',
			campaign_type: selectedCampaignType,
			// Content highlights fields
			intro_text: '',
			items: [],
			// Announcement fields
			body_html: '',
			cta_text: '',
			cta_url: '',
			// Jobs roundup fields
			jobs_intro_text: '',
			job_ids: []
		}))
	} else if (!isSent && campaign) {
		initForm(updateCampaign, () => {
			const base = {
				id: campaign.id,
				title: campaign.title,
				subject: campaign.subject,
				campaign_type: campaign.campaign_type
			}

			switch (campaign.campaign_type) {
				case 'content_highlights': {
					const c = campaign as ContentHighlightsCampaignWithItems
					return {
						...base,
						intro_text: c.type_data.intro_text || '',
						items: c.type_data.items
					}
				}
				case 'announcement': {
					const c = campaign as AnnouncementCampaign
					return {
						...base,
						body_html: c.type_data.body_html || '',
						cta_text: c.type_data.cta_text || '',
						cta_url: c.type_data.cta_url || ''
					}
				}
				case 'jobs_roundup': {
					const c = campaign as JobsRoundupCampaignWithItems
					return {
						...base,
						jobs_intro_text: c.type_data.intro_text || '',
						job_ids: c.type_data.jobs.map((j) => j.id)
					}
				}
			}
		})
	}

	const currentForm = $derived(isNew ? createCampaign : updateCampaign)

	// Extract initial items for content_highlights
	const initialItems = $derived(() => {
		if (!campaign || campaign.campaign_type !== 'content_highlights') return []
		const c = campaign as ContentHighlightsCampaignWithItems
		return c.type_data.items.map((item) => ({
			id: item.id,
			title: item.title,
			type: item.type,
			custom_description: item.custom_description
		}))
	})

	// Extract initial job IDs for jobs_roundup
	const initialJobIds = $derived(() => {
		if (!campaign || campaign.campaign_type !== 'jobs_roundup') return []
		const c = campaign as JobsRoundupCampaignWithItems
		return c.type_data.jobs.map((j) => j.id)
	})
</script>

<!-- Send confirmation dialog -->
{#snippet confirmSend()}
	<form>
		<Button
			{...sendCampaign.for(campaignId).buttonProps.enhance(async ({ submit }) => {
				try {
					await submit()
					toast.success('Successfully sent campaign.')
					sendDialogOpen = false
				} catch {
					toast.error('Something went wrong when trying to send the campaign.')
				}
			})}>Confirm</Button
		>
	</form>
{/snippet}

<ConfirmDialog
	id={sendDialogId}
	bind:open={sendDialogOpen}
	title="Send Campaign"
	description="Are you sure you want to send this campaign to all subscribers? This action cannot be undone."
	confirm={confirmSend}
/>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title={isNew ? 'New Campaign' : isSent ? campaign!.title : 'Edit Campaign'}
		description={isNew
			? 'Create a new newsletter campaign'
			: isSent
				? `Sent on ${new Date(campaign!.sent_at!).toLocaleDateString()}`
				: 'Update campaign details'}
		icon={Newspaper}
	>
		{#snippet actions()}
			{#if !isNew && campaign}
				<Badge color={typeConfig.color} text={typeConfig.label} />
			{/if}
		{/snippet}
	</PageHeader>

	{#if isSent && campaign}
		<!-- Sent campaign: read-only view -->
		<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
			<div class="space-y-6">
				<div>
					<h3 class="text-sm font-medium text-gray-500">Subject</h3>
					<p class="mt-1 text-lg text-gray-900">{campaign.subject}</p>
				</div>

				{#if campaign.campaign_type === 'content_highlights'}
					{@const c = campaign as ContentHighlightsCampaignWithItems}
					{#if c.type_data.intro_text}
						<div>
							<h3 class="text-sm font-medium text-gray-500">Introduction</h3>
							<p class="mt-1 text-gray-700">{c.type_data.intro_text}</p>
						</div>
					{/if}
					<div>
						<h3 class="text-sm font-medium text-gray-500">Content Items</h3>
						<ul class="mt-2 space-y-2">
							{#each c.type_data.items as item}
								<li class="flex items-center gap-2 text-gray-700">
									<span
										class="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-600"
										>{item.type}</span
									>
									{item.title}
								</li>
							{/each}
						</ul>
					</div>
				{:else if campaign.campaign_type === 'announcement'}
					{@const c = campaign as AnnouncementCampaign}
					<div>
						<h3 class="text-sm font-medium text-gray-500">Content</h3>
						<!-- SECURITY: body_html is trusted admin-authored content (see announcement-campaign.svelte) -->
						<div class="prose prose-sm mt-1 max-w-none text-gray-700">
							{@html c.type_data.body_html}
						</div>
					</div>
					{#if c.type_data.cta_text && c.type_data.cta_url}
						<div>
							<h3 class="text-sm font-medium text-gray-500">Call-to-Action</h3>
							<p class="mt-1 text-gray-700">
								<a href={c.type_data.cta_url} class="text-svelte-600 hover:underline">
									{c.type_data.cta_text}
								</a>
							</p>
						</div>
					{/if}
				{:else if campaign.campaign_type === 'jobs_roundup'}
					{@const c = campaign as JobsRoundupCampaignWithItems}
					{#if c.type_data.intro_text}
						<div>
							<h3 class="text-sm font-medium text-gray-500">Introduction</h3>
							<p class="mt-1 text-gray-700">{c.type_data.intro_text}</p>
						</div>
					{/if}
					<div>
						<h3 class="text-sm font-medium text-gray-500">Jobs</h3>
						<ul class="mt-2 space-y-2">
							{#each c.type_data.jobs as job}
								<li class="flex items-center gap-2 text-gray-700">
									<span
										class="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
									>
										{job.metadata?.company_name || 'Job'}
									</span>
									{job.title}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sent campaign action buttons -->
		<div class="flex justify-end gap-4">
			<Button href="/admin/newsletter" variant="secondary">Back to List</Button>
			<Button variant="secondary" href="/api/newsletter/preview/{campaignId}">
				<Eye class="size-4" />
				Preview
			</Button>
			{#if campaign.plunk_campaign_id}
				<Button
					variant="info"
					href="https://next-app.useplunk.com/campaigns/{campaign.plunk_campaign_id}"
				>
					<ChartLine class="size-4" />
					View Analytics
				</Button>
			{/if}

			<form>
				<Button
					variant="secondary"
					disabled={!!copyCampaign.pending}
					{...copyCampaign.for(campaignId).buttonProps}
				>
					<Copy class="size-4" />
					{!!copyCampaign.pending ? 'Copying...' : 'Copy Campaign'}
				</Button>
			</form>
		</div>
	{:else}
		<!-- New or draft campaign: show edit form -->
		<CampaignForm
			mode={isNew ? 'create' : 'edit'}
			form={currentForm}
			campaignId={isNew ? undefined : campaignId}
			campaignType={campaign?.campaign_type ?? selectedCampaignType}
			initialItems={initialItems()}
			{availableJobs}
			initialJobIds={initialJobIds()}
		/>

		<!-- Draft campaign action buttons -->
		<div class="flex justify-end gap-4">
			<Button href="/admin/newsletter" variant="secondary">Cancel</Button>
			{#if !isNew}
				<Button variant="secondary" href="/api/newsletter/preview/{campaignId}">
					<Eye class="size-4" />
					Preview
				</Button>
				<form>
					<Button
						variant="secondary"
						{...copyCampaign.for(campaignId).buttonProps}
						disabled={!!copyCampaign.pending}
					>
						<Copy class="size-4" />
						{!!copyCampaign.pending ? 'Copying...' : 'Copy Campaign'}
					</Button>
				</form>
			{/if}
			<Button type="submit" form="campaign-form" disabled={!!currentForm.pending}>
				{#if currentForm.pending}
					{isNew ? 'Creating...' : 'Saving...'}
				{:else}
					{isNew ? 'Create Campaign' : 'Update Campaign'}
				{/if}
			</Button>
			{#if !isNew && campaign}
				<DialogTrigger onclick={() => (sendDialogOpen = true)} disabled={cannotSend()}>
					<PaperPlaneTilt class="size-4" />
					{!!sendCampaign.pending ? 'Sending...' : 'Send Campaign'}
				</DialogTrigger>
			{/if}
		</div>
	{/if}
</div>
