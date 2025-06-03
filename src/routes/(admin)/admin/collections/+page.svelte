<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import { ADMIN_ROUTES, STATUS_BADGE_VARIANTS } from '$lib/admin'
	import { truncate } from '$lib/admin'

	// Collection type - matches what the server returns
	interface Collection {
		id: string
		title: string
		slug: string
		description: string | null
		status: string
		created_at: string
		type?: string
		published_at?: string | null
		updated_at?: string
	}

	let { data }: { data: { collections: Collection[]; totalCollections: number; perPage: number } } =
		$props()
</script>

<AdminList
	title="Collections Management"
	newHref={ADMIN_ROUTES.collections.new}
	newLabel="New Collection"
>
	<Table action={true} data={data.collections}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Title</th>
			<th scope="col" class={classes}>Description</th>
			<th scope="col" class={classes}>Status</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: Collection, classes)}
			<td class="{classes} font-medium text-gray-900">
				<div>{truncate(item.title, 50)}</div>
				<div class="mt-1 text-xs text-gray-500">{truncate(item.slug, 50)}</div>
			</td>
			<td class={classes}>
				<div class="line-clamp-2">
					{item.description || ''}
				</div>
			</td>
			<td class={classes}>
				<Badge
					variant={STATUS_BADGE_VARIANTS[item.status as keyof typeof STATUS_BADGE_VARIANTS] ||
						'default'}
				>
					{item.status}
				</Badge>
			</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: Collection)}
			<Actions
				route="collections"
				id={String(item.id)}
				canDelete={true}
				canEdit={true}
				type={item.title}
			/>
		{/snippet}
	</Table>

	<Pagination count={data.totalCollections} perPage={data.perPage} preserveParams={true} />
</AdminList>
