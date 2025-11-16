<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Table from '$lib/ui/admin/Table.svelte'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import type { Tag as TagType } from '$lib/types/tags'
	import { ADMIN_ROUTES } from '$lib/admin'
	import Tag from 'phosphor-svelte/lib/Tag'
	import Plus from 'phosphor-svelte/lib/Plus'

	let { data } = $props()
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Tags Management"
		description="Organize and manage content categories"
		icon={Tag}
	>
		{#snippet actions()}
			<a
				href={ADMIN_ROUTES.tags.new}
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Tag
			</a>
		{/snippet}
	</PageHeader>

	<Table action={true} data={data.tags ?? []}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Name</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: TagType, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				<div>{item.name}</div>
				<div class="mt-1 text-xs text-gray-400">{item.slug}</div>
			</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: TagType)}
			<Actions route="tags" id={item.id} canDelete={true} canEdit={true} type={item.name} />
		{/snippet}
	</Table>

	{#if data.count && data.count > 0}
		<Pagination count={data.count} perPage={data.perPage} />
	{/if}
</div>
