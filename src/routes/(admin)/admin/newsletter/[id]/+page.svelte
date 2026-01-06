<script lang="ts">
	import { page } from '$app/state'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import { initForm } from '$lib/utils/form.svelte'
	import CampaignForm from '../CampaignForm.svelte'
	import { updateCampaign, getCampaign } from './data.remote'

	const campaignId = page.params.id!

	const campaign = await getCampaign(campaignId)

	initForm(updateCampaign, () => ({
		id: campaign.id,
		title: campaign.title,
		subject: campaign.subject,
		intro_text: campaign.intro_text || ''
	}))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Campaign"
		description="Update campaign details"
		icon={Newspaper}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Campaign Details</p>
			</div>
		</div>

		<div class="p-8">
			<CampaignForm mode="edit" form={updateCampaign} campaignId={campaignId} />
		</div>
	</div>
</div>
