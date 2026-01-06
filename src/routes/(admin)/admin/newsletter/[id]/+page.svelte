<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { toast } from 'svelte-sonner'
	import { invalidateAll } from '$app/navigation'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import ContentPicker from '$lib/ui/admin/ContentPicker.svelte'
	import Button from '$lib/ui/Button.svelte'
	import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import Trash from 'phosphor-svelte/lib/Trash'
	import Eye from 'phosphor-svelte/lib/Eye'
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt'
	import { initForm } from '$lib/utils/form.svelte'
	import CampaignForm from '../CampaignForm.svelte'
	import {
		updateCampaign,
		getCampaign,
		getCampaignItems,
		addContent,
		removeContent
	} from './data.remote'
	import { sendCampaign } from '../data.remote'

	const campaignId = page.params.id!

	let campaign = $state(await getCampaign(campaignId))
	let campaignItems = $state(await getCampaignItems(campaignId))
	let isSending = $state(false)

	initForm(updateCampaign, () => ({
		id: campaign.id,
		title: campaign.title,
		subject: campaign.subject,
		intro_text: campaign.intro_text || ''
	}))

	async function handleAddContent(content: { id: string; title: string; type: string }) {
		const addAction = addContent.for(campaignId)
		const formData = new FormData()
		formData.set('campaign_id', campaignId)
		formData.set('content_id', content.id)

		try {
			const response = await fetch(addAction.action, {
				method: 'POST',
				body: formData
			})
			const result = await response.json()

			if (result.success) {
				toast.success('Content added!')
				// Refresh campaign items
				campaignItems = await getCampaignItems(campaignId)
			} else {
				toast.error(result.text || 'Failed to add content')
			}
		} catch {
			toast.error('An error occurred')
		}
	}

	async function handleRemoveContent(itemId: string) {
		const removeAction = removeContent.for(itemId)
		const formData = new FormData()
		formData.set('item_id', itemId)

		try {
			const response = await fetch(removeAction.action, {
				method: 'POST',
				body: formData
			})
			const result = await response.json()

			if (result.success) {
				toast.success('Content removed!')
				// Refresh campaign items
				campaignItems = await getCampaignItems(campaignId)
			} else {
				toast.error(result.text || 'Failed to remove content')
			}
		} catch {
			toast.error('An error occurred')
		}
	}

	function getTypeColor(type: string) {
		switch (type) {
			case 'video':
				return 'bg-red-100 text-red-800'
			case 'library':
				return 'bg-purple-100 text-purple-800'
			case 'recipe':
				return 'bg-green-100 text-green-800'
			case 'resource':
				return 'bg-blue-100 text-blue-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	function handlePreview() {
		window.open(`/api/newsletter/preview/${campaignId}`, '_blank')
	}

	async function handleSendCampaign() {
		isSending = true
		const sendAction = sendCampaign.for(campaignId)
		const formData = new FormData()
		formData.set('campaign_id', campaignId)

		try {
			const response = await fetch(sendAction.action, {
				method: 'POST',
				body: formData
			})
			const result = await response.json()

			if (result.success) {
				toast.success('Campaign sent successfully!')
				await invalidateAll()
				goto('/admin/newsletter')
			} else {
				toast.error(result.text || 'Failed to send campaign')
			}
		} catch {
			toast.error('An error occurred while sending')
		} finally {
			isSending = false
		}
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader title="Edit Campaign" description="Update campaign details" icon={Newspaper} />

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Campaign Details -->
		<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Campaign Details</p>
				</div>
			</div>

			<div class="p-8">
				<CampaignForm mode="edit" form={updateCampaign} {campaignId} />
			</div>
		</div>

		<!-- Content Selection -->
		<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Campaign Content</p>
				</div>
			</div>

			<div class="space-y-6 p-8">
				<ContentPicker onSelect={handleAddContent} />

				<!-- Selected Content List -->
				<div class="space-y-2">
					<label class="text-xs font-medium">Selected Content ({campaignItems.length})</label>
					{#if campaignItems.length > 0}
						<ul class="space-y-2">
							{#each campaignItems as item (item.id)}
								<li
									class="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
								>
									<div class="min-w-0 flex-1">
										<div class="flex items-center gap-2">
											<span class="truncate text-sm font-medium text-slate-900">
												{item.content_title}
											</span>
											<span
												class={[
													'shrink-0 rounded px-1.5 py-0.5 text-xs font-medium capitalize',
													getTypeColor(item.content_type)
												]}
											>
												{item.content_type}
											</span>
										</div>
										{#if item.custom_description}
											<p class="mt-1 truncate text-xs text-slate-500">{item.custom_description}</p>
										{/if}
									</div>
									<button
										type="button"
										onclick={() => handleRemoveContent(item.id)}
										class="shrink-0 rounded p-1 text-red-500 hover:bg-red-50"
										title="Remove"
									>
										<Trash class="size-4" />
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="py-4 text-center text-sm text-slate-500">
							No content added yet. Search above to add content.
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex justify-end gap-4">
		<Button variant="secondary" onclick={handlePreview}>
			<Eye class="size-4" />
			Preview
		</Button>
		<ConfirmWithDialog
			title="Send Campaign"
			description="Are you sure you want to send this campaign to all subscribers? This action cannot be undone."
			onConfirm={handleSendCampaign}
		>
			<Button disabled={isSending || campaignItems.length === 0}>
				<PaperPlaneTilt class="size-4" />
				{isSending ? 'Sending...' : 'Send Campaign'}
			</Button>
		</ConfirmWithDialog>
	</div>
</div>
