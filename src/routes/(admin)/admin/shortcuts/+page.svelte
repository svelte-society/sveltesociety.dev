<script lang="ts">
	import { toast } from 'svelte-sonner'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'
	import Plus from 'phosphor-svelte/lib/Plus'
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple'
	import Power from 'phosphor-svelte/lib/Power'
	import Trash from 'phosphor-svelte/lib/Trash'
	import { getShortcuts, toggleShortcut, deleteShortcut } from './shortcuts.remote'
	import type { SidebarShortcutWithContent } from '$lib/server/services/ShortcutService'

	function confirmDelete() {
		return confirm('Are you sure you want to delete this shortcut?')
	}

	const shortcuts = getShortcuts()
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

	<Table action={true} data={await shortcuts} testId="shortcuts-table">
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
				<span
					class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {shortcut.is_active
						? 'bg-green-100 text-green-800'
						: 'bg-gray-100 text-gray-800'}"
				>
					{shortcut.is_active ? 'Active' : 'Inactive'}
				</span>
			</td>
		{/snippet}
		{#snippet actionCell(shortcut: SidebarShortcutWithContent)}
			{@const toggle = toggleShortcut.for(shortcut.id)}
			{@const remove = deleteShortcut.for(shortcut.id)}
			<a
				href="/admin/shortcuts/{shortcut.id}"
				data-testid="edit-shortcut-button"
				class="inline-flex items-center justify-center rounded-lg bg-svelte-50 p-2 text-svelte-500 transition-all hover:bg-svelte-100 hover:text-svelte-900 hover:shadow-sm"
				aria-label="Edit {shortcut.title}"
			>
				<PencilSimple class="h-5 w-5" weight="bold" />
			</a>

			<form
				{...toggle.enhance(async ({ submit }) => {
					const result = await submit().updates(shortcuts)
					if (result) {
						result.success ? toast.success(result.text) : toast.error(result.text)
					}
				})}
			>
				<input {...toggle.fields.id.as('hidden', shortcut.id)} />
				<button
					type="submit"
					disabled={!!toggle.pending}
					data-testid="toggle-shortcut-button"
					class="inline-flex items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="{shortcut.is_active ? 'Deactivate' : 'Activate'} {shortcut.title}"
				>
					<Power class="h-5 w-5" weight="bold" />
				</button>
			</form>

			<form
				{...remove.enhance(async ({ submit }) => {
					if (!confirmDelete()) return
					const result = await submit().updates(shortcuts)
					if (result) {
						result.success ? toast.success(result.text) : toast.error(result.text)
					}
				})}
			>
				<input {...remove.fields.id.as('hidden', shortcut.id)} />
				<button
					type="submit"
					disabled={!!remove.pending}
					data-testid="delete-shortcut-button"
					class="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Delete {shortcut.title}"
				>
					<Trash class="h-5 w-5" weight="bold" />
				</button>
			</form>
		{/snippet}
	</Table>
</div>
