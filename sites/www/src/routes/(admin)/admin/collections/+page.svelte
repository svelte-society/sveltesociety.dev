<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import Table from "$lib/ui/admin/Table.svelte";
	import type {Collection} from "$lib/server/db/collections";
	import Actions from "$lib/ui/admin/Actions.svelte";
	let { data } = $props();
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
			<td
					class="{classes} font-medium text-gray-900"
			>
				<div>{item.title}</div>
				<div class="mt-1 text-xs text-gray-500">{item.slug}</div>
			</td>
			<td class={classes}>
								<span
										class="inline-flex rounded-full px-2 text-xs font-semibold leading-5
									{item.status === 'published'
										? 'bg-green-100 text-green-800'
										: item.status === 'draft'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'}"
								>
									{item.status}
								</span>
			</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: Collection)}
			<Actions route="collections" id={item.id} canDelete={true} canEdit={true} type={item.title} />
		{/snippet}
	</Table>
</div>
