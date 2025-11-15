<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Button from '$lib/ui/Button.svelte'
	import { enhance } from '$app/forms'
	import Avatar from '$lib/ui/Avatar.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import Actions from '$lib/ui/admin/Actions.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import type { User } from '$lib/server/services/user'
	import Users from 'phosphor-svelte/lib/Users'

	// Extended User interface to include created_at and role_name
	interface ExtendedUser extends User {
		created_at: string
		role_name: string
	}

	let { data } = $props()

	// Ensure ID is a string for Actions component
	function ensureStringId(id: string | number): string {
		return id.toString()
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<!-- Hero Header -->
	<div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-svelte-500 via-svelte-300 to-svelte-100 p-8 shadow-lg">
		<div class="relative z-10">
			<div class="flex items-center gap-3">
				<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
					<Users class="h-7 w-7 text-svelte-500" weight="duotone" />
				</div>
				<div>
					<h1 class="text-3xl font-bold text-white">Users Management</h1>
					<p class="mt-1 text-sm text-white/90">
						Manage user accounts, roles, and permissions
					</p>
				</div>
			</div>
		</div>
		<div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
	</div>
	<Table action={true} data={data.users} testId="users-table">
		{#snippet header(classes)}
			<th scope="col" class={classes}>User</th>
			<th scope="col" class={classes}>Email</th>
			<th scope="col" class={classes}>Role</th>
			<th scope="col" class={classes}>Location</th>
			<th scope="col" class={classes}>Twitter</th>
			<th scope="col" class={classes}>Created</th>
		{/snippet}
		{#snippet row(item: ExtendedUser, classes)}
			<td class="whitespace-nowrap {classes} flex items-center font-medium text-gray-900">
				<Avatar src={item.avatar_url} name={item.username} />
				<span class="ml-2" data-testid="user-username">{item.username}</span>
			</td>
			<td class="{classes} truncate">{item.email ?? '-'}</td>
			<td class={classes} data-testid="user-role">{item.role_name}</td>
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
					class="group relative text-svelte-500 hover:text-svelte-900"
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
