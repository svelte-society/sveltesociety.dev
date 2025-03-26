<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import { enhance } from '$app/forms'
	import Avatar from '$lib/ui/Avatar.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import type { User } from '$lib/server/db/user'

	// Extended User interface to include created_at
	interface ExtendedUser extends User {
		created_at: string
	}

	let { data } = $props()

	// Ensure ID is a string for Actions component
	function ensureStringId(id: string | number): string {
		return id.toString()
	}
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Users Management</h1>
		<Button small primary icon_left="plus" href="/admin/users/new">New User</Button>
	</div>
	<Table action={true} data={data.users}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>User</th>
			<th scope="col" class={classes}>Email</th>
			<th scope="col" class={classes}>Location</th>
			<th scope="col" class={classes}>Twitter</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: ExtendedUser, classes)}
			<td class="whitespace-nowrap {classes} flex items-center font-medium text-gray-900">
				<Avatar src={item.avatar_url} name={item.username} size="sm" />
				<span class="ml-2">{item.username}</span>
			</td>
			<td class="{classes} truncate">{item.email ?? '-'}</td>
			<td class={classes}>{item.location ?? '-'}</td>
			<td class={classes}>{item.twitter ?? '-'}</td>
			<td class={classes}>
				{formatRelativeDate(item.created_at)}
			</td>
		{/snippet}
		{#snippet actionCell(item: ExtendedUser)}
			<Actions
				route="users"
				id={ensureStringId(item.id)}
				canDelete={true}
				canEdit={true}
				type="this user"
			/>
			<form action="?/clear_sessions" method="POST" use:enhance style="line-height: 0">
				<input type="hidden" name="id" value={item.id} />
				<button
					type="submit"
					class="group relative text-orange-600 hover:text-orange-900"
					aria-label="Clear user sessions"
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
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						></path>
					</svg>
					<span
						class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
					>
						Clear sessions
					</span>
				</button>
			</form>
		{/snippet}
	</Table>

	{#if data.pagination}
		<Pagination count={data.pagination.count} perPage={data.pagination.perPage} />
	{/if}
</div>
