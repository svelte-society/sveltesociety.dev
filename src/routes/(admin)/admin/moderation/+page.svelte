<script lang="ts">
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
	import { enhance } from '$app/forms'
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import type { PreviewModerationQueueItem } from '$lib/server/services/moderation'

	let { data } = $props()

	let selectedIds: string[] = $state([])

	function toggleSelection(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((item) => item !== id)
		} else {
			selectedIds = [...selectedIds, id]
		}
	}
</script>

<AdminList title="Moderation Queue">
	<div class="mb-4 flex items-center justify-between">
		<p class="text-sm text-gray-600">Total items: {data.totalItems}</p>

		{#if selectedIds.length > 0}
			<form method="POST" action="?/bulk_reject" use:enhance>
				<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
				<Button small type="submit" icon_left="x-circle">
					Reject {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}
				</Button>
			</form>
		{/if}
	</div>

	<Table action={true} data={data.items}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>
				<span class="sr-only">Select</span>
			</th>
			<th scope="col" class={classes}>Title</th>
			<th scope="col" class={[classes, 'text-center']}>Type</th>
			<th scope="col" class={classes}>Submitted</th>
		{/snippet}
		{#snippet row(item: PreviewModerationQueueItem, classes)}
			<td class={classes}>
				<input
					type="checkbox"
					checked={selectedIds.includes(item.id)}
					onchange={() => toggleSelection(item.id)}
					class="form-checkbox h-4 w-4 text-indigo-600"
				/>
			</td>
			<td class="{classes} font-medium text-gray-900">{item.title || 'Untitled'}</td>
			<td class={classes}>
				<div class="group relative flex items-center justify-center">
					<div class="type-icon-wrapper text-gray-600">
						<TypeIcon type={item.type} size={24} />
					</div>
					<div
						class="pointer-events-none absolute bottom-full mb-2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white capitalize opacity-0 transition-opacity group-hover:opacity-100"
					>
						{item.type}
					</div>
				</div>
			</td>
			<td class={classes}>{formatRelativeDate(item.submitted_at)}</td>
		{/snippet}
		{#snippet actionCell(item: PreviewModerationQueueItem)}
			<div class="flex space-x-2">
				<Button small href="/admin/moderation/{item.id}" icon_left="eye">Inspect</Button>
			</div>
		{/snippet}
	</Table>

	<div class="mt-4 flex items-center justify-between">
		{#if data.page > 1}
			<a
				href="?page={data.page - 1}"
				class="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
			>
				Previous
			</a>
		{:else}
			<span
				class="cursor-not-allowed rounded bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-500"
			>
				Previous
			</span>
		{/if}
		<span class="text-sm text-gray-700">Page {data.page} of {Math.max(1, data.totalPages)}</span>
		{#if data.page < data.totalPages}
			<a
				href="?page={data.page + 1}"
				class="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
			>
				Next
			</a>
		{:else}
			<span
				class="cursor-not-allowed rounded bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-500"
			>
				Next
			</span>
		{/if}
	</div>
</AdminList>
