<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	const { data } = $props();
</script>

<table class="mb-4 w-full border-collapse items-center bg-transparent">
	<thead>
		<tr>
			<th
				class="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase"
			>
				Name
			</th>
			<th
				class="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase"
			>
				Description
			</th>
			<th
				class="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase"
			>
				Actions
			</th>
		</tr>
	</thead>

	<tbody>
		{#each data.roles as role}
			<tr>
				<th
					class="text-blueGray-700 whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs"
				>
					{role.name}
				</th>
				<td
					class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
				>
					{role.description}
				</td>
				<td
					class="align-center flex gap-2 whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-xs"
				>
					<a
						class="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
						href="/admin/roles/{role.id}">Edit</a
					>
					<div>
						<div class="bg-grey-400 p-4" popover="auto" id="confirm-delete-role-{role.id}">
							<div class="grid gap-2">
								<span class="text-md">Are you sure you want to delete this role?</span>
								<div class="flex gap-2">
									<form
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													invalidateAll();
													await applyAction(result);
												}
												const popover = document.getElementById('confirm-delete-role-' + role.id);
												popover?.hidePopover();
											};
										}}
										method="POST"
									>
										<input type="hidden" name="id" value={role.id} />
										<button
											type="submit"
											class="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
											>Delete</button
										>
									</form>
									<button
										popovertarget="confirm-delete-role-{role.id}"
										popovertargetaction="hide"
										class="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
										>Cancel</button
									>
								</div>
							</div>
						</div>
						<button
							type="button"
							popovertarget="confirm-delete-role-{role.id}"
							class="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
							>Delete</button
						>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
<Button primary href="/admin/roles/new">Create New Role</Button>

<style>
	[popover]:popover-open {
		opacity: 1;
		transform: scaleX(1);
	}

	[popover] {
		@apply flex flex-col gap-2 rounded-md bg-white p-4 opacity-0 shadow-md;

		transition:
			opacity 0.2s,
			overlay 0.2s allow-discrete,
			display 0.2s allow-discrete;
	}
	@starting-style {
		[popover]:popover-open {
			opacity: 0;
		}
	}

	[popover]::backdrop {
		background-color: rgb(0 0 0 / 0%);
		transition:
			display 0.3s allow-discrete,
			overlay 0.3s allow-discrete,
			background-color 0.3s;
	}

	[popover]:popover-open::backdrop {
		background-color: rgb(0 0 0 / 25%);
	}

	@starting-style {
		[popover]:popover-open::backdrop {
			background-color: rgb(0 0 0 / 0%);
		}
	}
</style>
