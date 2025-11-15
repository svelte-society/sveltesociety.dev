<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'

	let { data } = $props()

	const form = superForm(data.form, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json'
	})

	const { form: formData, submitting } = form

	// Transform announcements into options format
	const announcementOptions = data.announcements.map((announcement) => ({
		value: announcement.id,
		label: announcement.title
	}))

	// Transform locations into options format
	const locationOptions = data.locations.map((location) => ({
		value: location.id,
		label: location.name
	}))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Announcement Placement"
		description="Update announcement placement settings"
		icon={Megaphone}
	/>

	<div class="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
		<Form {form}>
		<!-- Announcement Selection -->
		<Select
			name="content_id"
			label="Announcement"
			description="Select which announcement to display"
			options={announcementOptions}
			placeholder="Select an announcement"
		/>

		<!-- Placement Location -->
		<Select
			name="placement_location_id"
			label="Placement Location"
			description="Choose where the announcement should appear"
			options={locationOptions}
			placeholder="Select a location"
		/>

		<!-- Start Date -->
		<Input
			name="start_date"
			label="Start Date (Optional)"
			description="Leave empty to start immediately"
			type="datetime-local"
		/>

		<!-- End Date -->
		<Input
			name="end_date"
			label="End Date (Optional)"
			description="Leave empty to run indefinitely"
			type="datetime-local"
		/>

		<!-- Priority -->
		<Input
			name="priority"
			label="Priority"
			description="Higher priority announcements are shown first"
			type="number"
			placeholder="0"
		/>

		<!-- Active Status -->
		<div>
			<label class="flex items-center">
				<input
					type="checkbox"
					name="is_active"
					bind:checked={$formData.is_active}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<span class="ml-2 text-sm text-gray-700">Active</span>
			</label>
		</div>

			<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
				<Button type="submit" width="full" disabled={$submitting}>
					{$submitting ? 'Updating...' : 'Update Placement'}
				</Button>
				<Button href="/admin/announcements" variant="secondary">Cancel</Button>
			</div>
		</Form>
	</div>
</div>
