<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'
	import Plus from 'phosphor-svelte/lib/Plus'
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple'
	import Power from 'phosphor-svelte/lib/Power'
	import Trash from 'phosphor-svelte/lib/Trash'
	import { getShortcuts, toggleShortcut, deleteShortcut } from './shortcuts.remote'

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

	{#if toggleShortcut.result || deleteShortcut.result}
		{@const message = toggleShortcut.result || deleteShortcut.result}
		<div
			class="rounded-md {message.success
				? 'border border-green-200 bg-green-50'
				: 'border border-red-200 bg-red-50'} p-4"
		>
			<div class="flex">
				<div class="ml-3">
					<p class="text-sm {message.success ? 'text-green-800' : 'text-red-800'}">
						{message.text}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="overflow-hidden bg-white shadow sm:rounded-md" data-testid="shortcuts-table">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Content
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Display Label
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Type
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Priority
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Status
					</th>
					<th class="relative px-6 py-3">
						<span class="sr-only">Actions</span>
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#await shortcuts}
					<tr>
						<td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
							Loading shortcuts...
						</td>
					</tr>
				{:then shortcutList}
					{#if shortcutList.length === 0}
						<tr>
							<td
								colspan="6"
								class="px-6 py-4 text-center text-sm text-gray-500"
								data-testid="no-shortcuts-message"
							>
								No sidebar shortcuts found. Add one to get started.
							</td>
						</tr>
					{/if}
					{#each shortcutList as shortcut}
						{@const toggle = toggleShortcut.for(shortcut.id)}
						{@const remove = deleteShortcut.for(shortcut.id)}
						<tr data-testid="shortcut-row">
							<td class="px-6 py-4 text-sm font-medium text-gray-900" data-testid="shortcut-title">
								{shortcut.title}
							</td>
							<td class="px-6 py-4 text-sm text-gray-500">
								{shortcut.label || '(uses title)'}
							</td>
							<td class="px-6 py-4 text-sm text-gray-500 capitalize">
								{shortcut.type}
							</td>
							<td class="px-6 py-4 text-sm text-gray-500">
								{shortcut.priority}
							</td>
							<td class="px-6 py-4 text-sm" data-testid="shortcut-status">
								<span
									class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {shortcut.is_active
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{shortcut.is_active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
								<div class="flex items-center justify-end gap-2">
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
											await submit().updates(shortcuts)
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
											await submit().updates(shortcuts)
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
								</div>
							</td>
						</tr>
					{/each}
				{/await}
			</tbody>
		</table>
	</div>
</div>
