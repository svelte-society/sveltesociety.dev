<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/ui/Avatar.svelte';
	const { data } = $props();
</script>

<table class="mb-4 w-full border-collapse items-center bg-transparent">
	<thead>
		<tr>
			<th
				class="whitespace-nowrap border border-l-0 border-r-0 border-solid border-blue-100 bg-blue-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-blue-500"
			>
				Avatar
			</th>
			<th
				class="whitespace-nowrap border border-l-0 border-r-0 border-solid border-blue-100 bg-blue-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-blue-500"
			>
				Username
			</th>
			<th
				class="whitespace-nowrap border border-l-0 border-r-0 border-solid border-blue-100 bg-blue-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-blue-500"
			>
				Email
			</th>
			<th
				class="whitespace-nowrap border border-l-0 border-r-0 border-solid border-blue-100 bg-blue-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-blue-500"
			>
				Location
			</th>
			<th
				class="whitespace-nowrap border border-l-0 border-r-0 border-solid border-blue-100 bg-blue-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-blue-500"
			>
				Twitter
			</th>
			<th
				class="whitespace-nowrap border border-l-0 border-r-0 border-solid border-blue-100 bg-blue-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-blue-500"
			>
				Actions
			</th>
		</tr>
	</thead>

	<tbody>
		{#each data.users as user}
			<tr>
				<th
					class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs text-blue-700"
				>
					<Avatar src={user.avatar_url as string} name={user.username as string} />
				</th>
				<th
					class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs text-blue-700"
				>
					{user.username}
				</th>
				<td
					class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
				>
					{user.email || '-'}
				</td>
				<td
					class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
				>
					{user.location}
				</td>
				<td
					class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
				>
					{user.twitter}
				</td>
				<td
					class="align-center flex gap-2 whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-xs"
				>
					<a
						class="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
						href="/admin/users/{user.id}">Edit</a
					>
					<div class="grid gap-2">
						<div class="bg-grey-400 p-4" popover="auto" id="confirm-delete-role-{user.id}">
							<div class="grid gap-2">
								<span class="text-md">Are you sure you want to delete this role?</span>
								<div class="flex gap-2">
									<form use:enhance method="POST">
										<input type="hidden" name="id" value={user.id} />
										<button
											type="submit"
											class="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
											>Delete</button
										>
									</form>
									<button
										popovertarget="confirm-delete-role-{user.id}"
										popovertargetaction="hide"
										class="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
										>Cancel</button
									>
								</div>
							</div>
						</div>
						<button
							type="button"
							popovertarget="confirm-delete-role-{user.id}"
							class="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
							>Delete</button
						>
						<form action="?/clear_sessions" method="POST">
							<input type="hidden" name="id" value={user.id} />
						</form>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
