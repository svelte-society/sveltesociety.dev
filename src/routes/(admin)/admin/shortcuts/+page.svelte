<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Power from 'phosphor-svelte/lib/Power'
	import { getShortcuts, toggleShortcut, deleteShortcut } from './shortcuts.remote'
	import type { SidebarShortcutWithContent } from '$lib/server/services/ShortcutService'

	let shortcuts = $derived(await getShortcuts())
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Sidebar Shortcuts"
		description="Manage content shortcuts that appear in the sidebar"
		icon={LinkSimple}
	>
		{#snippet actions()}
			<a
				href="/admin/shortcuts/new"
				data-testid="add-shortcut-button"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				Add Shortcut
			</a>
		{/snippet}
	</PageHeader>

	<Table action={true} data={shortcuts} testId="shortcuts-table">
		{#snippet header(classes)}
			<th class={classes}>Content</th>
			<th class={classes}>Display Label</th>
			<th class={classes}>Type</th>
			<th class={classes}>Priority</th>
			<th class={classes}>Status</th>
		{/snippet}
		{#snippet row(shortcut: SidebarShortcutWithContent, classes)}
			<td class={classes} data-testid="shortcut-title">{shortcut.title}</td>
			<td class={classes}>{shortcut.label || '(uses title)'}</td>
			<td class="{classes} capitalize">{shortcut.type}</td>
			<td class={classes}>{shortcut.priority}</td>
			<td class={classes} data-testid="shortcut-status">
				<Badge color={shortcut.is_active ? 'success' : 'default'} text={shortcut.is_active ? 'Active' : 'Inactive'} />
			</td>
		{/snippet}
		{#snippet actionCell(shortcut: SidebarShortcutWithContent)}
			<Actions id={shortcut.id}>
				<Action.Edit href={`/admin/shortcuts/${shortcut.id}`} />
				<Action.Button
					icon={Power}
					form={toggleShortcut}
					variant="info"
					tooltip={shortcut.is_active ? 'Deactivate' : 'Activate'}
					testId="toggle-button"
				/>
				<Action.Delete
					form={deleteShortcut}
					confirm="Are you sure you want to delete this shortcut?"
				/>
			</Actions>
		{/snippet}
	</Table>

	{#if shortcuts.length === 0}
		<div class="mt-8 text-center">
			<p class="text-gray-500">No shortcuts found.</p>
		</div>
	{/if}
</div>
