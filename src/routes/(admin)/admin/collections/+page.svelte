<script lang="ts">
import { formatRelativeDate } from '$lib/utils/date'
import Button from '$lib/ui/Button.svelte'
import Table from '$lib/ui/admin/Table.svelte'
import type { Collection } from '$lib/server/db/collections'
import Actions from '$lib/ui/admin/Actions.svelte'
import Badge from '$lib/ui/admin/Badge.svelte'
import Pagination from '$lib/ui/Pagination.svelte'
let { data } = $props()

let colorMap = new Map([
	['draft', 'warning'],
	['published', 'success'],
	['archived', 'danger']
])
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Collections Management</h1>
		<Button small primary icon_left="plus" href="/admin/collections/new">New Collection</Button>
	</div>
	<Table action={true} data={data.collections}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Title</th>
			<th scope="col" class={classes}>Status</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: Collection, classes)}
			<td class="{classes} font-medium text-gray-900">
				<div>{item.title}</div>
				<div class="mt-1 text-xs text-gray-500">{item.slug}</div>
			</td>
			<td class={classes}>
				<Badge color={colorMap.get(item.status)} text={item.status} />
			</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: Collection)}
			<Actions route="collections" id={item.id} canDelete={true} canEdit={true} type={item.title} />
		{/snippet}
	</Table>
	
	<Pagination 
		count={data.totalCollections} 
		perPage={data.perPage} 
		preserveParams={true}
	/>
</div>
