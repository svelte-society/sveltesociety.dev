<script lang="ts">
	import { enhance } from '$app/forms';
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

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Moderation Queue</h1>

	<p class="mb-4">Total items: {totalItems}</p>

	<form method="POST" action="?/rejectSelected" use:enhance>
		{#each selectedIds as id}
			<input type="hidden" name="selectedIds" value={id} />
		{/each}
		<button
			class="mb-4 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={selectedIds.length === 0}
		>
			{#if selectedIds.length > 0}
				Reject {selectedIds.length} submission{selectedIds.length !== 1 ? 's' : ''}
			{:else}
				Select items to reject
			{/if}
		</button>
	</form>

	<table class="mb-4 w-full rounded bg-white shadow-md">
		<thead>
			<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
				<th class="px-6 py-3 text-left">Select</th>
				<th class="px-6 py-3 text-left">Type</th>
				<th class="px-6 py-3 text-left">Submitted At</th>
				<th class="px-6 py-3 text-center">Actions</th>
			</tr>
		</thead>
		<tbody class="text-sm font-light text-gray-600">
			{#each items as item (item.id)}
				<tr class="border-b border-gray-200 hover:bg-gray-100">
					<td class="px-6 py-3 text-left">
						<input
							type="checkbox"
							checked={selectedIds.includes(item.id)}
							on:change={() => toggleSelection(item.id)}
							class="form-checkbox h-5 w-5 text-blue-600"
						/>
					</td>
					<td class="whitespace-nowrap px-6 py-3 text-left">
						<span class="font-medium">{item.type}</span>
					</td>
					<td class="px-6 py-3 text-left">
						{new Date(item.submitted_at).toLocaleString()}
					</td>
					<td class="px-6 py-3 text-center">
						<div class="item-center flex justify-center">
							<a href="/admin/moderation/{item.id}" class="mr-4 text-blue-500 hover:text-blue-600"
								>View</a
							>
							<form method="POST" action="?/approve" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button class="mr-4 text-green-500 hover:text-green-600"> Approve </button>
							</form>
							<form method="POST" action="?/reject" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button class="text-red-500 hover:text-red-600"> Reject </button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex items-center justify-between">
		{#if getPageUrl(page - 1)}
			<a
				href={getPageUrl(page - 1)}
				class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>
				Previous
			</a>
		{:else}
			<span class="cursor-not-allowed rounded bg-gray-300 px-4 py-2 font-bold text-gray-500">
				Previous
			</span>
		{/if}

		<span>Page {page} of {totalPages}</span>

		{#if getPageUrl(page + 1)}
			<a
				href={getPageUrl(page + 1)}
				class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>
				Next
			</a>
		{:else}
			<span class="cursor-not-allowed rounded bg-gray-300 px-4 py-2 font-bold text-gray-500">
				Next
			</span>
		{/if}
	</div>
</div>
