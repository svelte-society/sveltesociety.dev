<script lang="ts">
	import Dialog from '../Dialog.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
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
							>Avatar</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Username</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Email</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Location</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Twitter</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.users as user}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
								<Avatar src={user.avatar_url as string} name={user.username as string} />
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
								>{user.username}</td
							>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email || '-'}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.location}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.twitter}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
								<div class="flex space-x-2">
									<a
										href="/admin/users/{user.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit user"
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
									<Dialog
										title="Confirm Deletion"
										description="Are you sure you want to delete this user? This action cannot be undone."
										cancel="Cancel"
										confirm="Delete"
										id={user.id}
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
										</svg></Dialog
									>
									<form action="?/clear_sessions" method="POST" class="inline">
										<input type="hidden" name="id" value={user.id} />
										<button
											type="submit"
											class="text-yellow-600 hover:text-yellow-900"
											aria-label="Clear user sessions"
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
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
