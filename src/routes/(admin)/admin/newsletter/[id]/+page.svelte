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
	import { updateCampaign, getCampaign, sendCampaign } from './data.remote'

	const campaignId = page.params.id!

	const campaign = await getCampaign(campaignId)
	let isSending = $state(false)

	// Form ref for send campaign
	let sendCampaignFormRef: HTMLFormElement

	// Form instance for send
	const sendCampaignAction = $derived(sendCampaign.for(campaignId))

	initForm(updateCampaign, () => ({
		id: campaign.id,
		title: campaign.title,
		subject: campaign.subject,
		intro_text: campaign.intro_text || '',
		items: campaign.items
	}))

	function handlePreview() {
		window.open(`/api/newsletter/preview/${campaignId}`, '_blank')
	}

	async function handleSendCampaign() {
		sendCampaignFormRef.requestSubmit()
	}
</script>

<!-- Hidden form for sending campaign -->
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

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader title="Edit Campaign" description="Update campaign details" icon={Newspaper} />

	<CampaignForm mode="edit" form={updateCampaign} {campaignId} initialItems={campaign.items} />

	<!-- Action Buttons -->
	<div class="flex justify-end gap-4">
		<Button variant="secondary" onclick={handlePreview}>
			<Eye class="size-4" />
			Preview
		</Button>
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
	</div>
</div>
