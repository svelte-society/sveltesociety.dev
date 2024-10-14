<script lang="ts">
import Button from '$lib/ui/Button.svelte'
import type { PreviewContent } from '$lib/server/db/content'
import Table from '$lib/ui/admin/Table.svelte'
import Actions from '$lib/ui/admin/Actions.svelte'
import type { Role } from '$lib/server/db/role'
import Badge from '$lib/ui/admin/Badge.svelte'
let { data } = $props()

let colorMap = new Map([
	['active', 'success'],
	['inactive', 'danger']
])
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Roles Management</h1>
		<Button small primary icon_left="plus" href="/admin/roles/new">New Role</Button>
	</div>
	<Table action={true} data={data.roles}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Name</th>
			<th scope="col" class={classes}>Description</th>
			<th scope="col" class={classes}>Active</th>
		{/snippet}
		{#snippet row(item: Role, classes)}
			<td class="whitespace-nowrap {classes} font-medium text-gray-900">
				{item.name}
			</td>
			<td class="{classes} truncate">{item.description}</td>
			<td class="{classes} truncate"
				><Badge
					color={colorMap.get(item.active ? 'active' : 'inactive')}
					text={item.active ? 'Active' : 'Inactive'}
				/></td
			>
		{/snippet}
		{#snippet actionCell(item: PreviewContent)}
			<Actions
				route="roles"
				id={item.id}
				canDelete={true}
				canEdit={true}
				type="{item.title} role"
			/>
		{/snippet}
	</Table>
</div>
