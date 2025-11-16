<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import Plus from 'phosphor-svelte/lib/Plus'

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

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Not set'
		return new Date(dateString).toLocaleDateString()
	}

	function confirmDelete() {
		return confirm('Are you sure you want to delete this placement?')
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Announcement Placements"
		description="Manage and schedule community announcements"
		icon={Megaphone}
	>
		{#snippet actions()}
			<a
				href="/admin/announcements/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				Add Placement
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

	<div class="overflow-hidden bg-white shadow sm:rounded-md">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Announcement
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Placement
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Start Date
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						End Date
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
				{#if data.placements.length === 0}
					<tr>
						<td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
							No announcement placements found
						</td>
					</tr>
				{/if}
				{#each data.placements as placement}
					<tr>
						<td class="px-6 py-4 text-sm font-medium text-gray-900">
							{placement.title}
						</td>
						<td class="px-6 py-4 text-sm text-gray-500">
							{placement.placement_name}
						</td>
						<td class="px-6 py-4 text-sm text-gray-500">
							{formatDate(placement.start_date)}
						</td>
						<td class="px-6 py-4 text-sm text-gray-500">
							{formatDate(placement.end_date)}
						</td>
						<td class="px-6 py-4 text-sm text-gray-500">
							{placement.priority}
						</td>
						<td class="px-6 py-4 text-sm">
							<span
								class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {placement.is_active
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-800'}"
							>
								{placement.is_active ? 'Active' : 'Inactive'}
							</span>
						</td>
						<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
							<div class="flex items-center justify-end gap-2">
								<Button href="/admin/announcements/{placement.id}" variant="secondary" size="sm">
									Edit
								</Button>

								<Form form={toggleForm} action="?/toggle" class="inline">
									<input type="hidden" name="id" value={placement.id} />
									<Button type="submit" variant="secondary" size="sm" disabled={$toggleSubmitting}>
										{placement.is_active ? 'Deactivate' : 'Activate'}
									</Button>
								</Form>

								<Form form={deleteForm} action="?/delete" onsubmit={confirmDelete}>
									<input type="hidden" name="id" value={placement.id} />
									<Button type="submit" variant="error" size="sm" disabled={$deleteSubmitting}>
										Delete
									</Button>
								</Form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
