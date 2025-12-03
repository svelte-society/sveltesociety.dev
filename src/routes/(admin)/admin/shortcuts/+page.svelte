<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'
	import Plus from 'phosphor-svelte/lib/Plus'
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple'
	import Power from 'phosphor-svelte/lib/Power'
	import Trash from 'phosphor-svelte/lib/Trash'

	let { data }: { data: PageData } = $props()

	const toggleForm = superForm(data.toggleForm, {
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll()
			}
		}
	})

	const deleteForm = superForm(data.deleteForm, {
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll()
			}
		}
	})

	const { submitting: toggleSubmitting, message: toggleMessage } = toggleForm
	const { submitting: deleteSubmitting, message: deleteMessage } = deleteForm

	function confirmDelete() {
		return confirm('Are you sure you want to delete this shortcut?')
	}
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

	{#if $toggleMessage || $deleteMessage}
		{@const message = $toggleMessage || $deleteMessage}
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
				{#if data.shortcuts.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500" data-testid="no-shortcuts-message">
							No sidebar shortcuts found. Add one to get started.
						</td>
					</tr>
				{/if}
				{#each data.shortcuts as shortcut}
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

								<Form form={toggleForm} action="?/toggle" class="inline">
									<input type="hidden" name="id" value={shortcut.id} />
									<button
										type="submit"
										disabled={$toggleSubmitting}
										data-testid="toggle-shortcut-button"
										class="inline-flex items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-900 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="{shortcut.is_active ? 'Deactivate' : 'Activate'} {shortcut.title}"
									>
										<Power class="h-5 w-5" weight="bold" />
									</button>
								</Form>

								<Form form={deleteForm} action="?/delete" onsubmit={confirmDelete}>
									<input type="hidden" name="id" value={shortcut.id} />
									<button
										type="submit"
										disabled={$deleteSubmitting}
										data-testid="delete-shortcut-button"
										class="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-900 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="Delete {shortcut.title}"
									>
										<Trash class="h-5 w-5" weight="bold" />
									</button>
								</Form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
