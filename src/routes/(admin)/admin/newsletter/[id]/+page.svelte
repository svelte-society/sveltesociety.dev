<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { toast } from 'svelte-sonner'
	import { invalidateAll } from '$app/navigation'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import Eye from 'phosphor-svelte/lib/Eye'
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt'
	import ChartLine from 'phosphor-svelte/lib/ChartLine'
	import Copy from 'phosphor-svelte/lib/Copy'
	import { initForm } from '$lib/utils/form.svelte'
	import CampaignForm from '../CampaignForm.svelte'
	import { createCampaign, updateCampaign, getCampaign, sendCampaign, copyCampaign } from './data.remote'

	const campaignId = page.params.id!
	const isNew = campaignId === 'new'

	// Only fetch campaign if editing
	const campaign = isNew ? null : await getCampaign(campaignId)
	let isSending = $state(false)
	let isCopying = $state(false)

	// Check if campaign has been sent
	const isSent = campaign?.status === 'sent'

	// Form ref for send campaign
	let sendCampaignFormRef = $state<HTMLFormElement>()
	let copyCampaignFormRef = $state<HTMLFormElement>()

	// Form instance for send (only used in edit mode)
	const sendCampaignAction = $derived(isNew ? null : sendCampaign.for(campaignId))
	const copyCampaignAction = $derived(isNew ? null : copyCampaign.for(campaignId))

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

	const currentForm = isNew ? createCampaign : updateCampaign

	function handlePreview() {
		window.open(`/api/newsletter/preview/${campaignId}`, '_blank')
	}

	async function handleSendCampaign() {
		sendCampaignFormRef?.requestSubmit()
	}

	async function handleCopyCampaign() {
		copyCampaignFormRef?.requestSubmit()
	}
</script>

<!-- Hidden form for sending campaign (only in edit mode, not sent) -->
{#if !isNew && !isSent && sendCampaignAction}
	<form
		bind:this={sendCampaignFormRef}
		class="hidden"
		{...sendCampaignAction.enhance(async ({ submit }) => {
			isSending = true
			try {
				await submit()
				if (sendCampaignAction.result?.success) {
					toast.success('Campaign sent successfully!')
					await invalidateAll()
					goto('/admin/newsletter')
				} else {
					toast.error(sendCampaignAction.result?.text || 'Failed to send campaign')
				}
			} catch {
				toast.error('An error occurred while sending')
			} finally {
				isSending = false
			}
		})}
	>
		<input {...sendCampaignAction.fields.id.as('hidden', campaignId)} />
	</form>
{/if}

<!-- Hidden form for copying campaign -->
{#if !isNew && copyCampaignAction}
	<form
		bind:this={copyCampaignFormRef}
		class="hidden"
		{...copyCampaignAction.enhance(async ({ submit }) => {
			isCopying = true
			try {
				await submit()
				// copyCampaign redirects on success, so we only handle errors
				if (copyCampaignAction.result?.success === false) {
					toast.error(copyCampaignAction.result?.text || 'Failed to copy campaign')
				}
			} catch {
				// Redirect throws, which is expected on success
			} finally {
				isCopying = false
			}
		})}
	>
		<input {...copyCampaignAction.fields.id.as('hidden', campaignId)} />
	</form>
{/if}

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
					variant="secondary"
					href="https://next-app.useplunk.com/campaigns/{campaign.plunk_campaign_id}"
				>
					<ChartLine class="size-4" />
					View Analytics
				</Button>
			{/if}
			<Button onclick={handleCopyCampaign} disabled={isCopying}>
				<Copy class="size-4" />
				{isCopying ? 'Copying...' : 'Copy Campaign'}
			</Button>
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
				<Button variant="secondary" onclick={handleCopyCampaign} disabled={isCopying}>
					<Copy class="size-4" />
					{isCopying ? 'Copying...' : 'Copy Campaign'}
				</Button>
			{/if}
			<Button type="submit" form="campaign-form" disabled={!!currentForm.pending}>
				{#if currentForm.pending}
					{isNew ? 'Creating...' : 'Saving...'}
				{:else}
					{isNew ? 'Create Campaign' : 'Update Campaign'}
				{/if}
			</Button>
			{#if !isNew && campaign}
				<ConfirmWithDialog
					title="Send Campaign"
					description="Are you sure you want to send this campaign to all subscribers? This action cannot be undone."
					onConfirm={handleSendCampaign}
				>
					<Button disabled={isSending || campaign.items.length === 0}>
						<PaperPlaneTilt class="size-4" />
						{isSending ? 'Sending...' : 'Send Campaign'}
					</Button>
				</ConfirmWithDialog>
			{/if}
		</div>
	{/if}
</div>
