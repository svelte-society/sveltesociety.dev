<script lang="ts">
import { enhance } from '$app/forms'
import { formatRelativeDate } from '$lib/utils/date'
import Button from '$lib/ui/Button.svelte'
import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
import Table from '$lib/ui/admin/Table.svelte'
import type { PreviewModerationQueueItem } from '$lib/server/db/moderation'

let { data } = $props()

let selectedIds: number[] = $state([])

function toggleSelection(id: number) {
	if (selectedIds.includes(id)) {
		selectedIds = selectedIds.filter((item) => item !== id)
	} else {
		selectedIds = [...selectedIds, id]
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
					checked={selectedIds.includes(item.id)}
					onchange={() => toggleSelection(item.id)}
					class="form-checkbox h-4 w-4 text-indigo-600"
				/>
			</td>
			<td class="{classes} font-medium text-gray-900">{item.title}</td>
			<td class={classes}>{item.type}</td>
			<td class={classes}>{formatRelativeDate(item.submitted_at)}</td>
		{/snippet}
		{#snippet actionCell(item: PreviewModerationQueueItem)}
			<a
				href="/admin/moderation/{item.id}"
				class="text-indigo-600 hover:text-indigo-900"
				aria-label="View item"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					></path>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					></path>
				</svg>
			</a>
			<form method="POST" action="?/approve" use:enhance>
				<input type="hidden" name="id" value={item.id} />
				<button type="submit" class="text-green-600 hover:text-green-900" aria-label="Approve item">
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
				</button>
			</form>
			<ConfirmWithDialog
				title="Are you sure you want to reject this item?"
				description="This action cannot be undone."
				action="?/reject"
				confirmButtonText="Reject"
				cancelButtonText="Cancel"
				id={item.id}
			/>
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
