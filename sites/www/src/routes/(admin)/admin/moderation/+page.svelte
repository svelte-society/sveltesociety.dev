<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ items, page, totalPages, totalItems } = data);

	let selectedIds: number[] = [];

	function toggleSelection(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	function getPageUrl(pageNum: number) {
		if (pageNum < 1 || pageNum > totalPages) {
			return null;
		}
		return `?page=${pageNum}`;
	}
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Moderation Queue</h1>
		<form method="POST" action="?/rejectSelected" use:enhance>
			{#each selectedIds as id}
				<input type="hidden" name="selectedIds" value={id} />
			{/each}
			<Button small error disabled={selectedIds.length === 0} type="submit" icon_left="x-circle">
				{#if selectedIds.length > 0}
					Reject {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}
				{:else}
					Reject Selected
				{/if}
			</Button>
		</form>
	</div>

	<div class="mb-4">
		<p class="text-sm text-gray-600">Total items: {totalItems}</p>
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 w-10 px-3 py-2">
							<span class="sr-only">Select</span>
						</th>
						<th scope="col" class="min-w-[200px] px-3 py-2">Title</th>
						<th scope="col" class="min-w-[100px] px-3 py-2">Type</th>
						<th scope="col" class="min-w-[150px] px-3 py-2">Submitted At</th>
						<th scope="col" class="sticky right-0 min-w-[140px] px-3 py-2">
							<span class="sr-only">Actions</span>
							<svg
								class="mx-auto h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each items as item (item.id)}
						<tr class="hover:bg-gray-50">
							<td class="sticky left-0 w-10 px-3 py-2">
								<input
									type="checkbox"
									checked={selectedIds.includes(item.id)}
									on:change={() => toggleSelection(item.id)}
									class="form-checkbox h-4 w-4 text-indigo-600"
								/>
							</td>
							<td class="min-w-[200px] px-3 py-2 font-medium text-gray-900">
								{item.title}
							</td>
							<td class="min-w-[100px] px-3 py-2">
								{item.type}
							</td>
							<td class="min-w-[150px] px-3 py-2">
								{formatRelativeDate(item.submitted_at)}
							</td>
							<td class="sticky right-0 min-w-[140px] px-3 py-2">
								<div class="flex justify-center space-x-2">
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
										<button
											type="submit"
											class="text-green-600 hover:text-green-900"
											aria-label="Approve item"
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
													d="M5 13l4 4L19 7"
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
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="mt-4 flex items-center justify-between">
		{#if getPageUrl(page - 1)}
			<a
				href={getPageUrl(page - 1)}
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
		<span class="text-sm text-gray-700">Page {page} of {totalPages}</span>
		{#if getPageUrl(page + 1)}
			<a
				href={getPageUrl(page + 1)}
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
