<script lang="ts">
	import { page } from '$app/state'
	import Input from '$lib/ui/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'
	import ContentSelector from '../ContentSelector.svelte'
	import { initForm } from '$lib/utils/form.svelte'
	import { updateShortcut, getShortcutById } from '../shortcuts.remote'

	const shortcutId = page.params.id!

	const shortcut = await getShortcutById(shortcutId)

	initForm(updateShortcut, () => ({
		id: shortcut.id,
		content_id: shortcut.content_id,
		label: shortcut.label || '',
		priority: shortcut.priority,
		is_active: Boolean(shortcut.is_active)
	}))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Sidebar Shortcut"
		description="Update sidebar shortcut settings"
		icon={LinkSimple}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Shortcut Configuration</p>
			</div>
		</div>

		<div class="p-8">
			<form {...updateShortcut} class="flex flex-col gap-6">
				<input {...updateShortcut.fields.id.as('hidden', shortcutId)} />

				<div class="grid gap-6 lg:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-xs font-medium">Content</span>
						<ContentSelector
							{...updateShortcut.fields.content_id.as('text')}
							excludeShortcutId={shortcutId}
							placeholder="Search for content..."
							testId="select-content_id"
						/>
						{#each updateShortcut.fields.content_id.issues() as issue}
							<div class="text-xs text-red-600">{issue.message}</div>
						{:else}
							<div class="text-xs text-slate-500">Search and select which content to link to</div>
						{/each}
					</div>

					<Input
						{...updateShortcut.fields.label.as('text')}
						label="Display Label (Optional)"
						description="Override the display name. Leave empty to use content title."
						placeholder="Custom label"
						issues={updateShortcut.fields.label.issues()}
						data-testid="input-label"
					/>

					<Input
						{...updateShortcut.fields.priority.as('number')}
						label="Priority"
						description="Higher priority shortcuts are shown first"
						placeholder="0"
						issues={updateShortcut.fields.priority.issues()}
						data-testid="input-priority"
					/>

					<div class="lg:col-span-2">
						<label class="flex items-center">
							<input
								{...updateShortcut.fields.is_active.as('checkbox')}
								data-testid="checkbox-is_active"
								class="h-4 w-4 rounded border-gray-300 text-svelte-600 focus:ring-svelte-500"
							/>
							<span class="ml-2 text-sm text-gray-700">Active</span>
						</label>
					</div>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button
						type="submit"
						width="full"
						disabled={!!updateShortcut.pending}
						data-testid="submit-shortcut-button"
					>
						{updateShortcut.pending ? 'Updating...' : 'Update Shortcut'}
					</Button>
					<Button href="/admin/shortcuts" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
