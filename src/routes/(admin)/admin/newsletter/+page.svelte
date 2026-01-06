<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import Plus from 'phosphor-svelte/lib/Plus'
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt'
	import { getCampaigns, deleteCampaign, sendCampaign } from './data.remote'

	const campaigns = getCampaigns()

	function formatDate(dateString: string | null) {
		if (!dateString) return '-'
		return new Date(dateString).toLocaleDateString()
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'draft':
				return 'bg-gray-100 text-gray-800'
			case 'scheduled':
				return 'bg-blue-100 text-blue-800'
			case 'sent':
				return 'bg-green-100 text-green-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Newsletter Campaigns"
		description="Create and manage newsletter campaigns"
		icon={Newspaper}
	>
		{#snippet actions()}
			<a
				href="/admin/newsletter/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
				data-testid="new-campaign-button"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Campaign
			</a>
		{/snippet}
	</PageHeader>

	<Table action={true} data={await campaigns} testId="campaigns-table">
		{#snippet header(classes)}
			<th class={classes}>Title</th>
			<th class={classes}>Subject</th>
			<th class={classes}>Status</th>
			<th class={classes}>Created</th>
			<th class={classes}>Sent</th>
		{/snippet}
		{#snippet row(campaign, classes)}
			<td class={classes}>{campaign.title}</td>
			<td class={classes}>{campaign.subject}</td>
			<td class={classes}>
				<span
					class={[
						'inline-flex rounded-full px-2 text-xs leading-5 font-semibold capitalize',
						getStatusColor(campaign.status)
					]}
				>
					{campaign.status}
				</span>
			</td>
			<td class={classes}>{formatDate(campaign.created_at)}</td>
			<td class={classes}>{formatDate(campaign.sent_at)}</td>
		{/snippet}
		{#snippet actionCell(campaign)}
			<Actions id={campaign.id}>
				<Action.Edit href={`/admin/newsletter/${campaign.id}`} />
				{#if campaign.status === 'draft'}
					<Action.Button
						icon={PaperPlaneTilt}
						form={sendCampaign}
						variant="success"
						tooltip="Send Campaign"
						confirm="Are you sure you want to send this campaign to all subscribers?"
					/>
				{/if}
				<Action.Delete
					form={deleteCampaign}
					confirm="Are you sure you want to delete this campaign?"
				/>
			</Actions>
		{/snippet}
	</Table>
</div>
