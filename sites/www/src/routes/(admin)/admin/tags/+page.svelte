<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Tags Management</h1>
		<Button small primary icon_left="plus" href="/admin/tags/new">New Tag</Button>
	</div>
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 min-w-[180px] bg-gray-50 px-3 py-2">Name</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Slug</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Created</th>
						<th scope="col" class="sticky right-0 min-w-[70px] bg-gray-50 px-3 py-2">
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
					{#each data.tags as tag}
						<tr class="hover:bg-gray-50">
							<td
								class="sticky left-0 min-w-[180px] whitespace-nowrap px-3 py-2 font-medium text-gray-900 group-hover:bg-gray-50"
							>
								{tag.name}
							</td>
							<td class="min-w-[120px] px-3 py-2">{tag.slug}</td>
							<td class="min-w-[120px] px-3 py-2">
								{formatRelativeDate(tag.created_at)}
							</td>
							<td class="sticky right-0 min-w-[70px] px-3 py-2">
								<div class="flex justify-center space-x-1">
									<a
										href="/admin/tags/{tag.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit tag"
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
									<ConfirmWithDialog
										title="Are you sure you want to delete {tag.name}?"
										description="This action cannot be undone."
										action="?/delete"
										confirmButtonText="Delete"
										cancelButtonText="Cancel"
										id={tag.id}
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
