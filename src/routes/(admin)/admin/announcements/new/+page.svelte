<script lang="ts">
	import Input from '$lib/ui/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import { createPlacement, getAnnouncements, getLocations } from '../announcements.remote'

	const announcementOptions = await getAnnouncements()
	const locationOptions = await getLocations()
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Add Announcement Placement"
		description="Schedule an announcement to appear on your site"
		icon={Megaphone}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Placement Configuration</p>
			</div>
		</div>

		<div class="p-8">
			<form {...createPlacement} class="flex flex-col gap-6">
				<div class="grid gap-6 lg:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label for="content_id" class="text-xs font-medium">Announcement</label>
						<select
							{...createPlacement.fields.content_id.as('select')}
							id="content_id"
							class={[
								'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
								'focus:outline-2 focus:outline-sky-200',
								(createPlacement.fields.content_id.issues() ?? []).length > 0
									? 'border-red-300 bg-red-50 text-red-600'
									: 'border-transparent'
							]}
							data-testid="select-content_id"
						>
							<option value="">Select an announcement</option>
							{#each announcementOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						{#each createPlacement.fields.content_id.issues() ?? [] as issue, i (i)}
							<p class="text-xs text-red-600">{issue.message}</p>
						{:else}
							<p class="text-xs text-slate-500">Select which announcement to display</p>
						{/each}
					</div>

					<div class="flex flex-col gap-2">
						<label for="placement_location_id" class="text-xs font-medium">Placement Location</label>
						<select
							{...createPlacement.fields.placement_location_id.as('select')}
							id="placement_location_id"
							class={[
								'w-full rounded-md border-2 bg-slate-100 px-3 py-1.5 text-sm',
								'focus:outline-2 focus:outline-sky-200',
								(createPlacement.fields.placement_location_id.issues() ?? []).length > 0
									? 'border-red-300 bg-red-50 text-red-600'
									: 'border-transparent'
							]}
							data-testid="select-placement_location_id"
						>
							<option value="">Select a location</option>
							{#each locationOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						{#each createPlacement.fields.placement_location_id.issues() ?? [] as issue, i (i)}
							<p class="text-xs text-red-600">{issue.message}</p>
						{:else}
							<p class="text-xs text-slate-500">Choose where the announcement should appear</p>
						{/each}
					</div>

					<Input
						{...createPlacement.fields.start_date.as('datetime-local')}
						label="Start Date (Optional)"
						description="Leave empty to start immediately"
						issues={createPlacement.fields.start_date.issues()}
						data-testid="input-start_date"
					/>

					<Input
						{...createPlacement.fields.end_date.as('datetime-local')}
						label="End Date (Optional)"
						description="Leave empty to run indefinitely"
						issues={createPlacement.fields.end_date.issues()}
						data-testid="input-end_date"
					/>

					<Input
						{...createPlacement.fields.priority.as('number')}
						label="Priority"
						description="Higher priority announcements are shown first"
						placeholder="0"
						issues={createPlacement.fields.priority.issues()}
						data-testid="input-priority"
					/>

					<div class="lg:col-span-2">
						<label class="flex items-center">
							<input
								{...createPlacement.fields.is_active.as('checkbox')}
								data-testid="checkbox-is_active"
								class="h-4 w-4 rounded border-gray-300 text-svelte-600 focus:ring-svelte-500"
							/>
							<span class="ml-2 text-sm text-gray-700">Active immediately</span>
						</label>
					</div>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button type="submit" width="full" disabled={!!createPlacement.pending}>
						{createPlacement.pending ? 'Creating...' : 'Create Placement'}
					</Button>
					<Button href="/admin/announcements" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
