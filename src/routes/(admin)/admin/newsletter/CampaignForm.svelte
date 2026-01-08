<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import ContentSection from './ContentSection.svelte'
	import type { RemoteForm } from '@sveltejs/kit'

	interface ContentItem {
		id: string
		title: string
		type: string
		custom_description?: string | null
	}

	interface Props {
		mode: 'create' | 'edit'
		form: RemoteForm<any, any>
		campaignId?: string
		initialItems?: ContentItem[]
	}

	let { mode, form, campaignId, initialItems = [] }: Props = $props()

	const isEditing = $derived(mode === 'edit')

	// Local state for content items - uses bindable in ContentSection
	let contentItems = $state<ContentItem[]>([...initialItems])

	const successMessage = $derived(
		isEditing ? 'Campaign updated successfully!' : 'Campaign created successfully!'
	)
	const errorMessage = $derived(
		isEditing ? 'Failed to update campaign' : 'Failed to create campaign'
	)
	const submitLabel = $derived(
		form.pending
			? isEditing
				? 'Saving...'
				: 'Creating...'
			: isEditing
				? 'Update Campaign'
				: 'Create Campaign'
	)
</script>

<!-- Two-column layout for both create and edit modes -->
<form
	{...form.enhance(async ({ submit }) => {
		try {
			await submit()
			if (form.result?.success === true) {
				toast.success(successMessage)
			} else if (form.result?.success === false) {
				toast.error(form.result?.text || errorMessage)
			}
		} catch {
			// Redirects may throw, which is expected
		}
	})}
	class="flex flex-col gap-6"
>
	<div class="grid gap-8 lg:grid-cols-2">
		<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Campaign Details</p>
				</div>
			</div>
			<div class="p-8">
				{#if isEditing && campaignId}
					<input type="hidden" name="id" value={campaignId} />
				{/if}

				<Input
					{...form.fields.title.as('text')}
					label="Campaign Title"
					placeholder="Weekly Svelte Digest #42"
					description="Internal title for this campaign"
					issues={form.fields.title.issues()}
					data-testid="input-title"
				/>

				<Input
					{...form.fields.subject.as('text')}
					label="Email Subject"
					placeholder="This week in Svelte: New features, libraries, and more!"
					description="The subject line subscribers will see"
					issues={form.fields.subject.issues()}
					data-testid="input-subject"
				/>

				<TextArea
					{...form.fields.intro_text.as('text')}
					label="Introduction Text"
					placeholder="Welcome to this week's edition of the Svelte Society newsletter..."
					description="Optional introductory text shown before the content items"
					issues={form.fields.intro_text?.issues()}
					data-testid="textarea-intro-text"
					rows={4}
				/>

				<div class="mt-6 flex gap-4">
					<Button type="submit" width="full" disabled={!!form.pending}>
						{submitLabel}
					</Button>
					<Button href="/admin/newsletter" variant="secondary">Cancel</Button>
				</div>
			</div>
		</div>
		<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Campaign Content</p>
				</div>
			</div>
			<div class="p-8">
				<ContentSection items={contentItems} field={form.fields.items} />
			</div>
		</div>
	</div>
</form>
