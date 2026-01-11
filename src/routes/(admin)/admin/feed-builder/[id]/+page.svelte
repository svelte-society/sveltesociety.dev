<script lang="ts">
	import { page } from '$app/state'
	import Input from '$lib/ui/Input.svelte'
	import Textarea from '$lib/ui/TextArea.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Select from '$lib/ui/Select.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Rows from 'phosphor-svelte/lib/Rows'
	import { initForm } from '$lib/utils/form.svelte'
	import { updateFeedItem, getFeedItemById, getPublishedContent } from '../data.remote'

	const feedItemId = page.params.id!

	const feedItem = await getFeedItemById({ id: feedItemId })
	const contentOptions = await getPublishedContent()

	// Determine initial content mode based on existing data
	let contentMode = $state<'content' | 'custom'>(feedItem.content_id ? 'content' : 'custom')
	let positionType = $state<'fixed' | 'random'>(feedItem.position_type as 'fixed' | 'random')

	initForm(updateFeedItem, () => ({
		id: feedItem.id,
		content_id: feedItem.content_id || '',
		item_type: feedItem.item_type,
		title: feedItem.title || '',
		description: feedItem.description || '',
		button_text: feedItem.button_text || '',
		button_href: feedItem.button_href || '',
		position_type: feedItem.position_type,
		position_fixed: feedItem.position_fixed ?? 5,
		position_range_min: feedItem.position_range_min ?? 3,
		position_range_max: feedItem.position_range_max ?? 7,
		start_date: feedItem.start_date || '',
		end_date: feedItem.end_date || '',
		priority: feedItem.priority,
		is_active: Boolean(feedItem.is_active)
	}))

	const itemTypeOptions = [
		{ value: 'cta', label: 'CTA (Call to Action)' },
		{ value: 'ad', label: 'Advertisement' },
		{ value: 'featured', label: 'Featured Content' }
	]

	const positionTypeOptions = [
		{ value: 'random', label: 'Random Position' },
		{ value: 'fixed', label: 'Fixed Position' }
	]
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Feed Item"
		description="Update feed item settings"
		icon={Rows}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Feed Item Configuration</p>
			</div>
		</div>

		<div class="p-8">
			<form {...updateFeedItem} class="flex flex-col gap-6">
				<input {...updateFeedItem.fields.id.as('hidden', feedItemId)} />

				<div class="grid gap-6 lg:grid-cols-2">
					<!-- Item Type -->
					<div class="flex flex-col gap-2">
						<label for="item_type" class="text-xs font-medium">Item Type</label>
						<Select
							{...updateFeedItem.fields.item_type.as('select')}
							options={itemTypeOptions}
							data-testid="select-item_type"
						/>
						{#each updateFeedItem.fields.item_type.issues() ?? [] as issue, i (i)}
							<p class="text-xs text-red-600">{issue.message}</p>
						{:else}
							<p class="text-xs text-slate-500">Choose the type of feed item</p>
						{/each}
					</div>

					<!-- Content Mode Toggle -->
					<div class="flex flex-col gap-2">
						<span class="text-xs font-medium">Content Source</span>
						<div class="flex gap-4">
							<label class="flex items-center">
								<input
									type="radio"
									id="content_mode_custom"
									name="content_mode"
									value="custom"
									checked={contentMode === 'custom'}
									onchange={() => (contentMode = 'custom')}
									class="h-4 w-4 border-gray-300 text-svelte-600 focus:ring-svelte-500"
								/>
								<span class="ml-2 text-sm text-gray-700">Custom Content</span>
							</label>
							<label class="flex items-center">
								<input
									type="radio"
									id="content_mode_content"
									name="content_mode"
									value="content"
									checked={contentMode === 'content'}
									onchange={() => (contentMode = 'content')}
									class="h-4 w-4 border-gray-300 text-svelte-600 focus:ring-svelte-500"
								/>
								<span class="ml-2 text-sm text-gray-700">Link to Content</span>
							</label>
						</div>
					</div>
				</div>

				{#if contentMode === 'content'}
					<!-- Content Picker -->
					<div class="flex flex-col gap-2">
						<label for="content_id" class="text-xs font-medium">Select Content</label>
						<Select
							{...updateFeedItem.fields.content_id.as('select')}
							options={[{ value: '', label: 'Select content to feature' }, ...contentOptions]}
							data-testid="select-content_id"
						/>
						<p class="text-xs text-slate-500">Choose existing content to feature in the feed</p>
					</div>
				{:else}
					<!-- Custom Content Fields -->
					<div class="grid gap-6 lg:grid-cols-2">
						<Input
							{...updateFeedItem.fields.title.as('text')}
							label="Title"
							description="Display title for the feed item"
							placeholder="e.g., Hiring Svelte Developers?"
							issues={updateFeedItem.fields.title.issues()}
							data-testid="input-title"
						/>

						<Input
							{...updateFeedItem.fields.button_text.as('text')}
							label="Button Text"
							description="Text for the call-to-action button"
							placeholder="e.g., Post a Job"
							issues={updateFeedItem.fields.button_text.issues()}
							data-testid="input-button_text"
						/>
					</div>

					<Textarea
						{...updateFeedItem.fields.description.as('text')}
						label="Description"
						description="Supporting text for the feed item"
						placeholder="e.g., Reach thousands of Svelte developers..."
						rows={3}
						issues={updateFeedItem.fields.description.issues()}
						data-testid="textarea-description"
					/>

					<Input
						{...updateFeedItem.fields.button_href.as('text')}
						label="Button URL"
						description="Where the button should link to"
						placeholder="e.g., /jobs/submit"
						issues={updateFeedItem.fields.button_href.issues()}
						data-testid="input-button_href"
					/>
				{/if}

				<!-- Position Configuration -->
				<div class="border-t border-gray-200 pt-6">
					<h3 class="mb-4 text-sm font-medium text-gray-900">Position Settings</h3>
					<div class="grid gap-6 lg:grid-cols-2">
						<div class="flex flex-col gap-2">
							<label for="position_type" class="text-xs font-medium">Position Type</label>
							<Select
								{...updateFeedItem.fields.position_type.as('select')}
								options={positionTypeOptions}
								onchange={(e) => (positionType = (e.target as HTMLSelectElement).value as 'fixed' | 'random')}
								data-testid="select-position_type"
							/>
							<p class="text-xs text-slate-500">How the item should be positioned in the feed</p>
						</div>

						{#if positionType === 'fixed'}
							<Input
								{...updateFeedItem.fields.position_fixed.as('number')}
								label="Fixed Position"
								description="Position in the feed (0 = first)"
								placeholder="5"
								issues={updateFeedItem.fields.position_fixed.issues()}
								data-testid="input-position_fixed"
							/>
						{:else}
							<div class="grid grid-cols-2 gap-4">
								<Input
									{...updateFeedItem.fields.position_range_min.as('number')}
									label="Min Position"
									description="Minimum position"
									placeholder="3"
									issues={updateFeedItem.fields.position_range_min.issues()}
									data-testid="input-position_range_min"
								/>
								<Input
									{...updateFeedItem.fields.position_range_max.as('number')}
									label="Max Position"
									description="Maximum position"
									placeholder="7"
									issues={updateFeedItem.fields.position_range_max.issues()}
									data-testid="input-position_range_max"
								/>
							</div>
						{/if}
					</div>
				</div>

				<!-- Scheduling -->
				<div class="border-t border-gray-200 pt-6">
					<h3 class="mb-4 text-sm font-medium text-gray-900">Scheduling</h3>
					<div class="grid gap-6 lg:grid-cols-2">
						<Input
							{...updateFeedItem.fields.start_date.as('datetime-local')}
							label="Start Date (Optional)"
							description="Leave empty to start immediately"
							issues={updateFeedItem.fields.start_date.issues()}
							data-testid="input-start_date"
						/>

						<Input
							{...updateFeedItem.fields.end_date.as('datetime-local')}
							label="End Date (Optional)"
							description="Leave empty to run indefinitely"
							issues={updateFeedItem.fields.end_date.issues()}
							data-testid="input-end_date"
						/>

						<Input
							{...updateFeedItem.fields.priority.as('number')}
							label="Priority"
							description="Higher priority items are shown first"
							placeholder="0"
							issues={updateFeedItem.fields.priority.issues()}
							data-testid="input-priority"
						/>

						<div class="flex items-end">
							<label class="flex items-center">
								<input
									{...updateFeedItem.fields.is_active.as('checkbox')}
									data-testid="checkbox-is_active"
									class="h-4 w-4 rounded border-gray-300 text-svelte-600 focus:ring-svelte-500"
								/>
								<span class="ml-2 text-sm text-gray-700">Active</span>
							</label>
						</div>
					</div>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button type="submit" width="full" disabled={!!updateFeedItem.pending}>
						{updateFeedItem.pending ? 'Updating...' : 'Update Feed Item'}
					</Button>
					<Button href="/admin/feed-builder" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
