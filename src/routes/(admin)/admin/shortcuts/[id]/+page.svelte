<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import LinkSimple from 'phosphor-svelte/lib/LinkSimple'

	let { data } = $props()

	const form = superForm(data.form, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json'
	})

	const { form: formData, submitting } = form

	// Transform content into options format
	const contentOptions = data.availableContent.map((content) => ({
		value: content.id,
		label: `${content.title} (${content.type})`
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
			<Form {form}>
				<div class="grid gap-6 lg:grid-cols-2">
					<!-- Content Selection -->
					<Select
						name="content_id"
						label="Content"
						description="Select which content to link to"
						options={contentOptions}
						placeholder="Select content"
						data-testid="select-content_id"
					/>

					<!-- Label Override -->
					<Input
						name="label"
						label="Display Label (Optional)"
						description="Override the display name. Leave empty to use content title."
						placeholder="Custom label"
						data-testid="input-label"
					/>

					<!-- Priority -->
					<Input
						name="priority"
						label="Priority"
						description="Higher priority shortcuts are shown first"
						type="number"
						placeholder="0"
						data-testid="input-priority"
					/>

					<!-- Active Status -->
					<div class="lg:col-span-2">
						<label class="flex items-center">
							<input
								type="checkbox"
								name="is_active"
								bind:checked={$formData.is_active}
								data-testid="checkbox-is_active"
								class="h-4 w-4 rounded border-gray-300 text-svelte-600 focus:ring-svelte-500"
							/>
							<span class="ml-2 text-sm text-gray-700">Active</span>
						</label>
					</div>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button type="submit" width="full" disabled={$submitting} data-testid="submit-shortcut-button">
						{$submitting ? 'Updating...' : 'Update Shortcut'}
					</Button>
					<Button href="/admin/shortcuts" variant="secondary">Cancel</Button>
				</div>
			</Form>
		</div>
	</div>
</div>
