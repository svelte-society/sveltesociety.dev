<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';

	export let data;
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Content Management</h1>

	<table class="w-full">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>Title</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>Type</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>Description</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>Slug</th
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
			{#each data.content as content_item}
				<tr>
					<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
						>{content_item.title}</td
					>
					<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{content_item.type}</td>
					<td class="px-6 py-4 text-sm text-gray-500">{content_item.description}</td>
					<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{content_item.slug}</td>
					<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
						{formatRelativeDate(content_item.created_at)}
					</td>
					<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
						<div class="flex space-x-2">
							<a
								href="/admin/content/{content_item.id}"
								class="text-indigo-600 hover:text-indigo-900"
								aria-label="Edit content"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									></path>
								</svg>
							</a>
							<form action="?/delete" method="POST" use:enhance>
								<input type="hidden" name="id" value={content_item.id} />
								<button
									type="submit"
									class="text-red-600 hover:text-red-900"
									aria-label="Delete content"
								>
									<svg
										class="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										></path>
									</svg>
								</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="mt-6">
	<Button primary href="/admin/content/new">New Content</Button>
</div>
