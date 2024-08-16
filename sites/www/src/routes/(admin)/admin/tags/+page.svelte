<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import Table from '$lib/ui/admin/Table.svelte';
	import Actions from '$lib/ui/admin/Actions.svelte';
	import type { Tag } from '$lib/server/db/tags';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Tags Management</h1>
		<Button small primary icon_left="plus" href="/admin/tags/new">New Tag</Button>
	</div>
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
</div>
