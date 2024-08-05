<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';

	let { data } = $props();
</script>

<h1>Collections</h1>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-800">Collections</h1>
		<a
			href="/admin/collections/new"
			class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
		>
			Create New Collection
		</a>
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow-md">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Title</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Status</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Created</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each data.collections as collection}
					<tr class="hover:bg-gray-50">
						<td class="whitespace-nowrap px-6 py-4">
							<div class="text-sm font-medium text-gray-900">{collection.title}</div>
							<div class="text-sm text-gray-500">{collection.slug}</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<span
								class="inline-flex rounded-full px-2 text-xs font-semibold leading-5
				  {collection.status === 'published'
									? 'bg-green-100 text-green-800'
									: collection.status === 'draft'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-red-100 text-red-800'}"
							>
								{collection.status}
							</span>
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
							{formatRelativeDate(collection.created_at)}
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
							<a
								href="/admin/collections/{collection.id}"
								class="mr-3 text-indigo-600 hover:text-indigo-900">Edit</a
							>
							<button class="text-red-600 hover:text-red-900">Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
