<script lang="ts">
	import { page } from '$app/state'
	import { getTags, deleteTag } from './data.remote'
	import { formatRelativeDate } from '$lib/utils/date'
	import Table from '$lib/ui/admin/Table.svelte'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import type { Tag } from '$lib/types/tags'
	import { ADMIN_ROUTES } from '$lib/admin'

	const currentPage = $derived(parseInt(page.url.searchParams.get('page') || '1'))
	const data = $derived(await getTags({ page: currentPage }))
</script>

<AdminList title="Tags Management" newHref={ADMIN_ROUTES.tags.new} newLabel="New Tag">
	<Table action={true} data={data.tags ?? []} testId="tags-table">
		{#snippet header(classes)}
			<th scope="col" class={classes}>Name</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: Tag, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				<div data-testid="tag-name">{item.name}</div>
				<div class="mt-1 text-xs text-gray-400" data-testid="tag-slug">{item.slug}</div>
			</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: Tag)}
			<Actions
				route="tags"
				id={item.id}
				canDelete={true}
				canEdit={true}
				type={item.name}
				deleteForm={deleteTag}
			/>
		{/snippet}
	</Table>

	{#if data.pagination.count && data.pagination.count > 0}
		<Pagination count={data.pagination.count} perPage={data.pagination.perPage} />
	{/if}
</AdminList>
