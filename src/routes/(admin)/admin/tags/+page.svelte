<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Table from '$lib/ui/admin/Table.svelte'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import type { Tag } from '$lib/types/tags'
	import { ADMIN_ROUTES } from '$lib/admin'

	let { data } = $props()
</script>

<AdminList title="Tags Management" newHref={ADMIN_ROUTES.tags.new} newLabel="New Tag">
	<Table action={true} data={data.tags ?? []}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Name</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: Tag, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				<div>{item.name}</div>
				<div class="mt-1 text-xs text-gray-400">{item.slug}</div>
			</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: Tag)}
			<Actions route="tags" id={item.id} canDelete={true} canEdit={true} type={item.name} />
		{/snippet}
	</Table>

	{#if data.count && data.count > 0}
		<Pagination count={data.count} perPage={data.perPage} />
	{/if}
</AdminList>
