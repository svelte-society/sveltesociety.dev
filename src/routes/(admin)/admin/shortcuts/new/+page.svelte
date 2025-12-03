<script lang="ts">
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'
	import { createShortcut, getAvailableContent } from '../shortcuts.remote'

	const contentOptions = $derived(
		(await getAvailableContent({})).map((content) => ({
			value: content.id,
			label: `${content.title} (${content.type})`
		}))
	)
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Add Sidebar Shortcut"
		description="Create a new shortcut to display in the sidebar"
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
			<form {...createShortcut} class="flex flex-col gap-6">
				<div class="grid gap-6 lg:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-xs font-medium">Content</span>
						<Select
							{...createShortcut.fields.content_id.as('select')}
							options={contentOptions}
							props={{ placeholder: 'Select content' }}
							testId="select-content_id"
						/>
						{#each createShortcut.fields.content_id.issues() as issue}
							<div class="text-xs text-red-600">{issue.message}</div>
						{:else}
							<div class="text-xs text-slate-500">Select which content to link to</div>
						{/each}
					</div>

					<Input
						{...createShortcut.fields.label.as('text')}
						label="Display Label (Optional)"
						description="Override the display name. Leave empty to use content title."
						placeholder="Custom label"
						issues={createShortcut.fields.label.issues()}
						data-testid="input-label"
					/>

					<Input
						{...createShortcut.fields.priority.as('number')}
						label="Priority"
						description="Higher priority shortcuts are shown first"
						placeholder="0"
						issues={createShortcut.fields.priority.issues()}
						data-testid="input-priority"
					/>

					<div class="lg:col-span-2">
						<label class="flex items-center">
							<input
								{...createShortcut.fields.is_active.as('checkbox')}
								data-testid="checkbox-is_active"
								class="h-4 w-4 rounded border-gray-300 text-svelte-600 focus:ring-svelte-500"
							/>
							<span class="ml-2 text-sm text-gray-700">Active immediately</span>
						</label>
					</div>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button
						type="submit"
						width="full"
						disabled={!!createShortcut.pending}
						data-testid="submit-shortcut-button"
					>
						{createShortcut.pending ? 'Creating...' : 'Create Shortcut'}
					</Button>
					<Button href="/admin/shortcuts" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
