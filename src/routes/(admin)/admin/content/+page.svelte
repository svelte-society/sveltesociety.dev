<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import type { PreviewContent } from '$lib/server/services/content'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'

	let { data } = $props()

	let colorMap = new Map([
		['draft', 'warning'],
		['published', 'success'],
		['archived', 'danger']
	])

	// Helper function to get color with fallback
	function getStatusColor(status: string): string {
		return colorMap.get(status) || 'default' // Default to 'default' for unknown statuses
	}
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Content Management</h1>
		<Button small primary icon_left="plus" href="/admin/content/new">New Content</Button>
	</div>
	<Table action={true} data={data.content}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Title</th>
			<th scope="col" class={classes}>Status</th>
			<th scope="col" class={classes}>Type</th>
			<th scope="col" class={classes}>Description</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: PreviewContent, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				<div>{item.title}</div>
				<div class="mt-1 text-xs text-gray-400">{item.slug}</div>
			</td>
			<td class={classes}><Badge color={getStatusColor(item.status)} text={item.status} /></td>
			<td class={classes}>{item.type}</td>
			<td class={classes}>{item.description}</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: PreviewContent)}
			<Actions route="content" id={item.id} canDelete={true} canEdit={true} type={item.title} />
		{/snippet}
	</Table>

	{#if data.pagination}
		<Pagination count={data.pagination.count} perPage={data.pagination.perPage} />
	{/if}
</div>
