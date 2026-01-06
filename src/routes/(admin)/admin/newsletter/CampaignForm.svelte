<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import type { RemoteForm } from '@sveltejs/kit'

	interface Props {
		mode: 'create' | 'edit'
		form: RemoteForm<any, any>
		campaignId?: string
	}

	let { mode, form, campaignId }: Props = $props()

	const isEditing = $derived(mode === 'edit')

	const successMessage = $derived(
		isEditing ? 'Campaign updated successfully!' : 'Campaign created successfully!'
	)
	const errorMessage = $derived(isEditing ? 'Failed to update campaign' : 'Failed to create campaign')
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

<form
	{...form.enhance(async ({ submit }) => {
		try {
			await submit()
			// If we get here without redirect, check result
			if (form.result?.success === true) {
				toast.success(successMessage)
			} else if (form.result?.success === false) {
				// Only show error if explicitly failed (not on redirect)
				toast.error(form.result?.text || errorMessage)
			}
		} catch {
			// Redirects may throw, which is expected - don't show error
		}
	})}
	class="flex flex-col gap-4"
>
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
</form>
