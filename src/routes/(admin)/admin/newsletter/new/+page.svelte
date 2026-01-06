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

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Campaign Details</p>
			</div>
		</div>

		<div class="p-8">
			<CampaignForm mode="create" form={createCampaign} />
		</div>
	</div>
</div>
