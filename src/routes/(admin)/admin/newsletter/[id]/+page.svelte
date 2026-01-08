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
	import { initForm } from '$lib/utils/form.svelte'
	import CampaignForm from '../CampaignForm.svelte'
	import { createCampaign, updateCampaign, getCampaign, sendCampaign } from './data.remote'

	const campaignId = page.params.id!
	const isNew = campaignId === 'new'

	// Only fetch campaign if editing
	const campaign = isNew ? null : await getCampaign(campaignId)
	let isSending = $state(false)

	// Form ref for send campaign
	let sendCampaignFormRef = $state<HTMLFormElement>()

	// Form instance for send (only used in edit mode)
	const sendCampaignAction = $derived(isNew ? null : sendCampaign.for(campaignId))

	// Initialize the appropriate form
	if (isNew) {
		initForm(createCampaign, () => ({
			title: '',
			subject: '',
			intro_text: '',
			items: []
		}))
	} else {
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
</script>

<!-- Hidden form for sending campaign (only in edit mode) -->
{#if !isNew && sendCampaignAction}
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

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title={isNew ? 'New Campaign' : 'Edit Campaign'}
		description={isNew ? 'Create a new newsletter campaign' : 'Update campaign details'}
		icon={Newspaper}
	/>

	<CampaignForm
		mode={isNew ? 'create' : 'edit'}
		form={currentForm}
		campaignId={isNew ? undefined : campaignId}
		initialItems={campaign?.items ?? []}
	/>

	<!-- Action Buttons -->
	<div class="flex justify-end gap-4">
		<Button href="/admin/newsletter" variant="secondary">Cancel</Button>
		{#if !isNew}
			<Button variant="secondary" href="/api/newsletter/preview/{campaignId}">
				<Eye class="size-4" />
				Preview
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
</div>
