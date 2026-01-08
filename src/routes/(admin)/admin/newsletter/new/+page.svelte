<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import CampaignForm from '../CampaignForm.svelte'
	import { createCampaign } from './data.remote'
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="New Campaign"
		description="Create a new newsletter campaign"
		icon={Newspaper}
	/>

	<CampaignForm mode="create" form={createCampaign} />
</div>
