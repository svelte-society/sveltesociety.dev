<script lang="ts">
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
	import { enhance } from '$app/forms'
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import X from 'phosphor-svelte/lib/X'
	import Eye from 'phosphor-svelte/lib/Eye'
	import Table from '$lib/ui/admin/Table.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import ClockClockwise from 'phosphor-svelte/lib/ClockClockwise'

	import type { Type as ContentType } from '$lib/types/content'

	interface PendingContentItem {
		id: string
		title: string
		type: ContentType
		status: string
		submitted_at: string
		submitted_by: string | null
		submitter_name: string
		submitter_username: string | null
	}

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

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Moderation Queue"
		description="Review and approve pending content submissions"
		icon={ClockClockwise}
	/>

	<div class="mb-6">
		<p class="text-sm font-medium text-gray-900" data-testid="moderation-queue-count">
			Total items: {data.totalItems}
		</p>
	</div>
	<div class="mb-4 flex items-center justify-end">

		{#if selectedIds.length > 0}
			<form method="POST" action="?/bulk_reject" use:enhance>
				<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
				<Button size="sm" type="submit">
					<X weight="bold" />Reject {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}
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
		{#snippet row(item: PendingContentItem, classes)}
			<td class={classes}>
				<input
					type="checkbox"
					checked={selectedIds.includes(item.id)}
					onchange={() => toggleSelection(item.id)}
					class="form-checkbox h-4 w-4 text-svelte-500 focus:ring-svelte-500"
					data-testid="moderation-queue-checkbox"
				/>
			</td>
			<td class="{classes} font-medium text-gray-900" data-testid="moderation-queue-item-title">{item.title}</td>
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
		{#snippet actionCell(item: PendingContentItem)}
			<div class="flex space-x-2">
				<a
					href="/admin/moderation/{item.id}"
					class="group relative inline-flex items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-900 hover:shadow-sm"
					aria-label="Inspect submission"
					data-testid="moderation-inspect-button"
				>
					<Eye class="h-5 w-5" weight="bold" />
					<span
						class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						Inspect
					</span>
				</a>
			</div>
		{/snippet}
	</Table>

	<div class="mt-4 flex items-center justify-between">
		{#if data.page > 1}
			<a
				href="?page={data.page - 1}"
				class="rounded-lg bg-svelte-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-svelte-600 transition-colors"
			>
				Previous
			</a>
		{:else}
			<span
				class="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-500"
			>
				Previous
			</span>
		{/if}
		<span class="text-sm font-medium text-gray-700">Page {data.page} of {Math.max(1, data.totalPages)}</span>
		{#if data.page < data.totalPages}
			<a
				href="?page={data.page + 1}"
				class="rounded-lg bg-svelte-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-svelte-600 transition-colors"
			>
				Next
			</a>
		{:else}
			<span
				class="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-500"
			>
				Next
			</span>
		{/if}
	</div>
</div>
