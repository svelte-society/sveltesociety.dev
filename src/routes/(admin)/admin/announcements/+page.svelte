<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Power from 'phosphor-svelte/lib/Power'
	import { getPlacements, togglePlacement, deletePlacement } from './announcements.remote'

	const placements = getPlacements()

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Not set'
		return new Date(dateString).toLocaleDateString()
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Announcement Placements"
		description="Manage and schedule community announcements"
		icon={Megaphone}
	>
		{#snippet actions()}
			<a
				href="/admin/announcements/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				Add Placement
			</a>
		{/snippet}
	</PageHeader>

	<Table action={true} data={await placements} testId="announcements-table">
		{#snippet header(classes)}
			<th class={classes}>Announcement</th>
			<th class={classes}>Placement</th>
			<th class={classes}>Start Date</th>
			<th class={classes}>End Date</th>
			<th class={classes}>Priority</th>
			<th class={classes}>Status</th>
		{/snippet}
		{#snippet row(placement, classes)}
			<td class={classes}>{placement.title}</td>
			<td class={classes}>{placement.placement_name}</td>
			<td class={classes}>{formatDate(placement.start_date)}</td>
			<td class={classes}>{formatDate(placement.end_date)}</td>
			<td class={classes}>{placement.priority}</td>
			<td class={classes}>
				<span
					class={[
						'inline-flex rounded-full px-2 text-xs leading-5 font-semibold',
						placement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
					]}
				>
					{placement.is_active ? 'Active' : 'Inactive'}
				</span>
			</td>
		{/snippet}
		{#snippet actionCell(placement)}
			<Actions id={placement.id}>
				<Action.Edit href={`/admin/announcements/${placement.id}`} />
				<Action.Button
					icon={Power}
					form={togglePlacement}
					variant="info"
					tooltip={placement.is_active ? 'Deactivate' : 'Activate'}
				/>
				<Action.Delete
					form={deletePlacement}
					confirm="Are you sure you want to delete this placement?"
				/>
			</Actions>
		{/snippet}
	</Table>
</div>
