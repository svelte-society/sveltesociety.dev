<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Content Management</h1>
		<Button small primary icon_left="plus" href="/admin/content/new">New Content</Button>
	</div>
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 z-20 min-w-[180px] bg-gray-50 px-3 py-2">Title</th>
						<th scope="col" class="min-w-[80px] px-3 py-2">Type</th>
						<th scope="col" class="min-w-[180px] px-3 py-2">Description</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Created</th>
						<th scope="col" class="sticky right-0 z-20 min-w-[70px] bg-gray-50 px-3 py-2">
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
					{#each data.content as content_item}
						<tr class="hover:bg-gray-50">
							<td
								class="sticky left-0 z-10 min-w-[180px] whitespace-nowrap bg-white px-3 py-2 font-medium text-gray-900 group-hover:bg-gray-50"
							>
								<div>{content_item.title}</div>
								<div class="mt-1 text-xs text-gray-400">{content_item.slug}</div>
							</td>
							<td class="min-w-[80px] px-3 py-2">{content_item.type}</td>
							<td class="min-w-[180px] truncate px-3 py-2">{content_item.description}</td>
							<td class="min-w-[120px] px-3 py-2">
								{formatRelativeDate(content_item.created_at)}
							</td>
							<td class="sticky right-0 z-10 min-w-[70px] bg-white px-3 py-2">
								<div class="flex justify-center space-x-1">
									<a
										href="/admin/content/{content_item.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit content"
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
	</div>
</div>
