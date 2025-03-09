<script lang="ts">
import { enhance } from '$app/forms'
import { formatRelativeDate } from '$lib/utils/date'
import Button from '$lib/ui/Button.svelte'
import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
import Table from '$lib/ui/admin/Table.svelte'
import type { PreviewModerationQueueItem } from '$lib/server/db/moderation'

let { data } = $props()

let selectedIds: number[] = $state([])

// Convert string ID to number
function toNumberId(id: string | number): number {
	return typeof id === 'string' ? parseInt(id, 10) : id;
}

function toggleSelection(id: string | number) {
	const numId = toNumberId(id);
	if (selectedIds.includes(numId)) {
		selectedIds = selectedIds.filter((item) => item !== numId)
	} else {
		selectedIds = [...selectedIds, numId]
	}
}

function getPageUrl(pageNum: number) {
	if (pageNum < 1 || pageNum > data.totalPages) {
		return null
	}
	return `?page=${pageNum}`
}
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Moderation Queue</h1>
		<form method="POST" action="?/rejectSelected" use:enhance>
			{#each selectedIds as id}
				<input type="hidden" name="selectedIds" value={id} />
			{/each}
			<Button small primary={selectedIds.length > 0} disabled type="submit" icon_left="x-circle">
				{#if selectedIds.length > 0}
					Reject {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}
				{:else}
					Reject Selected
				{/if}
			</Button>
		</form>
	</div>

	<div class="mb-4">
		<p class="text-sm text-gray-600">Total items: {data.totalItems}</p>
	</div>

	<Table action={true} data={data.items}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>
				<span class="sr-only">Select</span>
			</th>
			<th scope="col" class={classes}>Title</th>
			<th scope="col" class={classes}>Type</th>
			<th scope="col" class={classes}>Submitted At</th>
		{/snippet}
		{#snippet row(item: PreviewModerationQueueItem, classes)}
			<td class={classes}>
				<input
					type="checkbox"
					checked={selectedIds.includes(toNumberId(item.id))}
					onchange={() => toggleSelection(item.id)}
					class="form-checkbox h-4 w-4 text-indigo-600"
				/>
			</td>
			<td class="{classes} font-medium text-gray-900">{item.title}</td>
			<td class={classes}>{item.type}</td>
			<td class={classes}>{formatRelativeDate(item.submitted_at)}</td>
		{/snippet}
		{#snippet actionCell(item: PreviewModerationQueueItem)}
			<div class="flex space-x-2">
				<form method="POST" action="?/approve" use:enhance>
					<input type="hidden" name="id" value={item.id} />
					<Button small primary icon_left="check">Approve</Button>
				</form>
				<ConfirmWithDialog
					title="Reject Item"
					description="Are you sure you want to reject this item? This action cannot be undone."
					action="?/reject"
					confirmButtonText="Reject"
					cancelButtonText="Cancel"
					id={toNumberId(item.id)}
				/>
			</div>
		{/snippet}
	</Table>

	<div class="mt-4 flex items-center justify-between">
		{#if getPageUrl(data.page - 1)}
			<a
				href={getPageUrl(data.page - 1)}
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
		{#if getPageUrl(data.page + 1)}
			<a
				href={getPageUrl(data.page + 1)}
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
</div>
