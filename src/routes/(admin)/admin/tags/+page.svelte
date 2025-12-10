<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import { ADMIN_ROUTES } from '$lib/admin'
	import Tag from 'phosphor-svelte/lib/Tag'
	import Plus from 'phosphor-svelte/lib/Plus'
	import { getTags, deleteTag } from './tags.remote'
	import type { Tag as TagType } from '$lib/schema/tags'

	const tags = getTags()
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

	<Table action={true} data={await tags} testId="tags-table">
		{#snippet header(classes)}
			<th class={classes}>Name</th>
			<th class={classes}>Created</th>
		{/snippet}
		{#snippet row(tag: TagType, classes)}
			<td class={classes}>
				<div>{tag.name}</div>
				<div class="mt-1 text-xs text-gray-400">{tag.slug}</div>
			</td>
			<td class={classes}>{formatRelativeDate(tag.created_at)}</td>
		{/snippet}
		{#snippet actionCell(tag: TagType)}
			<Actions id={tag.id}>
				<Action.Edit href={`/admin/tags/${tag.id}`} />
				<Action.Delete
					form={deleteTag}
					confirm="Are you sure you want to delete this tag? This action cannot be undone."
				/>
			</Actions>
		{/snippet}
	</Table>
</div>
