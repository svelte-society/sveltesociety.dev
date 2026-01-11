<script lang="ts">
	import { page } from '$app/state'
	import { formatRelativeDate } from '$lib/utils/date'
	import Avatar from '$lib/ui/Avatar.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import type { User } from '$lib/server/services/user'
	import Users from 'phosphor-svelte/lib/Users'
	import SignOut from 'phosphor-svelte/lib/SignOut'
	import { getUsers, deleteUser, clearUserSessions } from './users.remote'

	// Extended User interface to include created_at and role_name
	interface ExtendedUser extends User {
		created_at: string
		role_name: string
	}

	const currentPage = $derived(parseInt(page.url.searchParams.get('page') || '1', 10))
	const perPage = 25

	const data = $derived(await getUsers({ page: currentPage, perPage }))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Users Management"
		description="Manage user accounts, roles, and permissions"
		icon={Users}
	/>

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
			<Actions id={item.id}>
				<Action.Edit href={`/admin/users/${item.id}`} />
				<Action.Button
					icon={SignOut}
					form={clearUserSessions}
					confirm="Clear all sessions for this user?"
					variant="warning"
					tooltip="Clear sessions"
				/>
				<Action.Delete form={deleteUser} confirm="Delete this user?" />
			</Actions>
		{/snippet}
	</Table>

	{#if data.users.length === 0}
		<div class="mt-8 text-center">
			<p class="text-gray-500">No users found.</p>
		</div>
	{/if}

	{#if data.pagination}
		<Pagination count={data.pagination.count} perPage={data.pagination.perPage} />
	{/if}
</div>
