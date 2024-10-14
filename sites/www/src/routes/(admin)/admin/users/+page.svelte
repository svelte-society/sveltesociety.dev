<script lang="ts">
import { formatRelativeDate } from '$lib/utils/date'
import Button from '$lib/ui/Button.svelte'
import { enhance } from '$app/forms'
import Avatar from '$lib/ui/Avatar.svelte'
import Table from '$lib/ui/admin/Table.svelte'
import Actions from '$lib/ui/admin/Actions.svelte'
import type { User } from '$lib/server/db/user'
let { data } = $props()
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
		{#snippet row(item: User, classes)}
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
		{#snippet actionCell(item: User)}
			<Actions route="users" id={item.id} canDelete={true} canEdit={true} type="this user" />
			<form action="?/clear_sessions" method="POST" use:enhance style="line-height: 0">
				<input type="hidden" name="id" value={item.id} />
				<button
					type="submit"
					class="text-yellow-600 hover:text-yellow-900"
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
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</button>
			</form>
		{/snippet}
	</Table>
</div>
