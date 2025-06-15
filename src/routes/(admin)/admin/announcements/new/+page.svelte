<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Button from '$lib/ui/Button.svelte'

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

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Add Announcement Placement</h1>

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
				<span class="ml-2 text-sm text-gray-700">Active immediately</span>
			</label>
		</div>

		<Button type="submit" primary disabled={$submitting}>
			{$submitting ? 'Creating...' : 'Create Placement'}
		</Button>
	</Form>
</div>