<script lang="ts">
	import Dialog from '../Dialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	const { data } = $props();
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-md">
	<div class="p-6">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Title</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Author</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Content Count</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Created At</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.collections as collection}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
								{collection.title}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{collection.author?.name || 'Unknown'}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{collection.contentCount}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{new Date(collection.created_at).toLocaleDateString()}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
								<div class="flex space-x-2">
									<a
										href="/admin/collections/{collection.id}"
										class="text-indigo-600 hover:text-indigo-900"
									>
										Edit
									</a>
									<Dialog
										trigger="Delete"
										title="Confirm Deletion"
										description="Are you sure you want to delete this collection? This action cannot be undone."
										cancel="Cancel"
										confirm="Delete"
										id={collection.id}
									/>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
<div class="mt-6">
	<Button primary href="/admin/collections/new">Create New Collection</Button>
</div>
