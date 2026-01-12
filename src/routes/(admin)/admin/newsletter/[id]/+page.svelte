<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { toast } from 'svelte-sonner'
	import { invalidateAll } from '$app/navigation'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
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
		copyCampaign
	} from './data.remote'

	const campaignId = page.params.id!
	const isNew = campaignId === 'new'
	const sendDialogId = `send-confirm-${campaignId}`

	// Only fetch campaign if editing
	const campaign = $derived(isNew ? null : await getCampaign(campaignId))

	// Check if campaign has been sent
	const isSent = $derived(campaign?.status === 'sent')

	// Initialize the appropriate form (only for non-sent campaigns)
	if (isNew) {
		initForm(createCampaign, () => ({
			title: '',
			subject: '',
			intro_text: '',
			items: []
		}))
	} else if (!isSent) {
		initForm(updateCampaign, () => ({
			id: campaign!.id,
			title: campaign!.title,
			subject: campaign!.subject,
			intro_text: campaign!.intro_text || '',
			items: campaign!.items
		}))
	}

	const currentForm = $derived(isNew ? createCampaign : updateCampaign)
</script>

<!-- Send confirmation dialog -->
{#snippet confirmSend()}
	<form>
		<Button
			{...sendCampaign.for(campaignId).buttonProps.enhance(async ({ submit }) => {
				try {
					await submit()
					toast.success('Successfully sent campaign.')
					;(document.getElementById(sendDialogId) as HTMLDialogElement)?.close()
				} catch {
					toast.error('Something went wrong when trying to send the campaign.')
				}
			})}>Confirm</Button
		>
	</form>
{/snippet}

<ConfirmDialog
	id={sendDialogId}
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
	/>

	{#if isSent && campaign}
		<!-- Sent campaign: read-only view -->
		<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
			<div class="space-y-6">
				<div>
					<h3 class="text-sm font-medium text-gray-500">Subject</h3>
					<p class="mt-1 text-lg text-gray-900">{campaign.subject}</p>
				</div>
				{#if campaign.intro_text}
					<div>
						<h3 class="text-sm font-medium text-gray-500">Introduction</h3>
						<p class="mt-1 text-gray-700">{campaign.intro_text}</p>
					</div>
				{/if}
				<div>
					<h3 class="text-sm font-medium text-gray-500">Content Items</h3>
					<ul class="mt-2 space-y-2">
						{#each campaign.items as item}
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
			initialItems={campaign?.items ?? []}
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
				<DialogTrigger
					target={sendDialogId}
					disabled={!!sendCampaign.pending || campaign.items.length === 0}
				>
					<PaperPlaneTilt class="size-4" />
					{!!sendCampaign.pending ? 'Sending...' : 'Send Campaign'}
				</DialogTrigger>
			{/if}
		</div>
	{/if}
</div>
