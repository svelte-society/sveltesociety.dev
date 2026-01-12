<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Rows from 'phosphor-svelte/lib/Rows'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Power from 'phosphor-svelte/lib/Power'
	import { getFeedItems, toggleFeedItem, deleteFeedItem } from './data.remote'

	let feedItems = $derived(await getFeedItems())

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Not set'
		return new Date(dateString).toLocaleDateString()
	}

	function formatPosition(item: { position_type: string; position_fixed: number | null; position_range_min: number | null; position_range_max: number | null }) {
		if (item.position_type === 'fixed') {
			return `Fixed: ${item.position_fixed}`
		}
		return `Random: ${item.position_range_min}-${item.position_range_max}`
	}

	function getTypeColor(type: string): 'info' | 'success' | 'warning' | 'danger' | 'default' {
		const colorMap: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
			cta: 'info',
			ad: 'warning',
			featured: 'success'
		}
		return colorMap[type] || 'default'
	}

	function getDisplayTitle(item: { title: string | null; content_title: string | null }) {
		return item.title || item.content_title || 'Untitled'
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Feed Builder"
		description="Manage promotional items in the homepage content feed"
		icon={Rows}
	>
		{#snippet actions()}
			<a
				href="/admin/feed-builder/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				Add Feed Item
			</a>
		{/snippet}
	</PageHeader>

	<Table action={true} data={feedItems} emptyMessage="No feed items found." testId="feed-items-table">
		{#snippet header(classes)}
			<th class={classes}>Title</th>
			<th class={classes}>Type</th>
			<th class={classes}>Position</th>
			<th class={classes}>Start Date</th>
			<th class={classes}>End Date</th>
			<th class={classes}>Priority</th>
			<th class={classes}>Status</th>
		{/snippet}
		{#snippet row(item, classes)}
			<td class={classes}>{getDisplayTitle(item)}</td>
			<td class={classes}>
				<Badge color={getTypeColor(item.item_type)} text={item.item_type.toUpperCase()} />
			</td>
			<td class={classes}>{formatPosition(item)}</td>
			<td class={classes}>{formatDate(item.start_date)}</td>
			<td class={classes}>{formatDate(item.end_date)}</td>
			<td class={classes}>{item.priority}</td>
			<td class={classes}>
				<Badge color={item.is_active ? 'success' : 'default'} text={item.is_active ? 'Active' : 'Inactive'} />
			</td>
		{/snippet}
		{#snippet actionCell(item)}
			<Actions id={item.id}>
				<Action.Edit href={`/admin/feed-builder/${item.id}`} />
				<Action.Button
					icon={Power}
					form={toggleFeedItem}
					variant="info"
					tooltip={item.is_active ? 'Deactivate' : 'Activate'}
					testId="toggle-button"
				/>
				<Action.Delete
					form={deleteFeedItem}
					confirm="Are you sure you want to delete this feed item?"
				/>
			</Actions>
		{/snippet}
	</Table>
</div>
