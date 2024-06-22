<script lang="ts">
	import Dialog from '../Dialog.svelte';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
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
							>Name</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Description</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Active</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.roles as role}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
								>{role.name}</td
							>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{role.description}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								<span
									class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {role.active
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'}"
								>
									{role.active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
								<div class="flex space-x-2">
									<a href="/admin/roles/{role.id}" class="text-indigo-600 hover:text-indigo-900"
										>Edit</a
									>
									<Dialog
										trigger="Delete"
										title="Confirm Deletion"
										description="Are you sure you want to delete this item? This action cannot be undone."
										cancel="Cancel"
										confirm="Delete"
										id={role.id}
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
	<Button primary href="/admin/roles/new">Create New Role</Button>
</div>
