<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import type { ContentWithAuthor } from '$lib/types/content'
	import type { SocialAccount, Platform } from '$lib/schema/social'
	import type { RemoteForm } from '$app/server'

	interface Props {
		form: RemoteForm<any, unknown>
		publishedContent: ContentWithAuthor[]
		accounts: SocialAccount[]
		onGeneratePreview: (contentId: string, platform: Platform) => Promise<string | null>
	}

	let { form, publishedContent, accounts, onGeneratePreview }: Props = $props()

	// Form state
	let selectedContentId = $state('')
	let selectedPlatform = $state<Platform | ''>('')
	let selectedAccountId = $state('')
	let isGeneratingPreview = $state(false)

	// Get available platforms from connected accounts
	const availablePlatforms = $derived(
		Array.from(new Set(accounts.map((a) => a.platform)))
	)

	// Get selected content
	const selectedContent = $derived(
		publishedContent.find((c) => c.id === selectedContentId) || null
	)

	// Filter accounts by selected platform
	const platformAccounts = $derived(
		selectedPlatform ? accounts.filter((a) => a.platform === selectedPlatform) : []
	)

	// Get default account for platform
	const defaultAccount = $derived(
		platformAccounts.find((a) => a.is_default) || platformAccounts[0] || null
	)

	// Character limits per platform
	const characterLimit = $derived.by(() => {
		switch (selectedPlatform) {
			case 'bluesky':
				return 300
			case 'nostr':
				return 280
			case 'linkedin':
				return 3000
			default:
				return 5000
		}
	})

	const postText = $derived(form.fields.post_text.value() || '')
	const characterCount = $derived(postText.length)
	const isOverLimit = $derived(characterCount > characterLimit)

	// Handle generating preview
	async function handleGeneratePreview() {
		if (!selectedContentId || !selectedPlatform) return

		isGeneratingPreview = true
		try {
			const preview = await onGeneratePreview(selectedContentId, selectedPlatform)
			if (preview) {
				form.fields.post_text.set(preview)
			}
		} finally {
			isGeneratingPreview = false
		}
	}

	// Handle platform change
	function handlePlatformChange() {
		// Reset account selection and select default if available
		selectedAccountId = defaultAccount?.id || ''
		handleGeneratePreview()
	}

	// Handle account change - update form fields
	function handleAccountChange() {
		if (!selectedAccountId) return

		form.fields.account_id.set(selectedAccountId)
		const account = accounts.find((a) => a.id === selectedAccountId)
		if (account) {
			form.fields.platform.set(account.platform)
		}
	}

	// Handle content change
	function handleContentChange() {
		form.fields.content_id.set(selectedContentId)
		handleGeneratePreview()
	}
</script>

<div class="space-y-6">
	<!-- Content Selection -->
	<div>
		<label for="content" class="block text-sm font-medium text-gray-700">
			Select Content
		</label>
		{#each form.fields.content_id.issues() as issue, i (i)}
			<p class="mt-1 text-sm text-red-600">{issue.message}</p>
		{/each}
		<select
			id="content"
			bind:value={selectedContentId}
			onchange={handleContentChange}
			class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 focus:outline-none"
		>
			<option value="">Select content to post...</option>
			{#each publishedContent as content (content.id)}
				<option value={content.id}>
					{content.title} ({content.type})
				</option>
			{/each}
		</select>
		{#if selectedContent}
			<p class="mt-2 text-sm text-gray-500">
				{selectedContent.description || 'No description'}
			</p>
		{/if}
	</div>

	<!-- Platform Selection -->
	<div>
		<label for="platform" class="block text-sm font-medium text-gray-700">Platform</label>
		{#each form.fields.platform.issues() as issue, i (i)}
			<p class="mt-1 text-sm text-red-600">{issue.message}</p>
		{/each}
		<select
			id="platform"
			bind:value={selectedPlatform}
			onchange={handlePlatformChange}
			class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 focus:outline-none"
		>
			<option value="">Select platform...</option>
			{#each availablePlatforms as platform (platform)}
				<option value={platform}>{platform}</option>
			{/each}
		</select>
	</div>

	<!-- Account Selection -->
	{#if selectedPlatform && platformAccounts.length > 0}
		<div>
			<label for="account" class="block text-sm font-medium text-gray-700">Account</label>
			{#each form.fields.account_id.issues() as issue, i (i)}
				<p class="mt-1 text-sm text-red-600">{issue.message}</p>
			{/each}
			<select
				id="account"
				bind:value={selectedAccountId}
				onchange={handleAccountChange}
				class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 focus:outline-none"
			>
				{#each platformAccounts as account (account.id)}
					<option value={account.id}>
						{account.account_name} (@{account.account_handle})
						{#if account.is_default}(Default){/if}
					</option>
				{/each}
			</select>
		</div>
	{/if}

	<!-- Post Text -->
	{#if selectedContentId && selectedPlatform}
		<div>
			<div class="mb-2 flex items-center justify-between">
				<label for="post-text" class="block text-sm font-medium text-gray-700">
					Post Text
				</label>
				<Button
					size="sm"
					variant="secondary"
					onclick={handleGeneratePreview}
					disabled={isGeneratingPreview}
				>
					{isGeneratingPreview ? 'Generating...' : 'Regenerate'}
				</Button>
			</div>
			{#each form.fields.post_text.issues() as issue, i (i)}
				<p class="mt-1 text-sm text-red-600">{issue.message}</p>
			{/each}
			<textarea
				{...form.fields.post_text.as('text')}
				id="post-text"
				rows="8"
				class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-none"
				placeholder="Post text will be auto-generated..."
			></textarea>
			<div class="mt-1 flex justify-between text-sm">
				<span class={isOverLimit ? 'text-red-600' : 'text-gray-500'}>
					{characterCount} / {characterLimit} characters
				</span>
				{#if isOverLimit}
					<span class="text-red-600">Character limit exceeded!</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Scheduled Time (Optional) -->
	{#if selectedContentId && selectedPlatform}
		<div>
			<label for="scheduled-at" class="block text-sm font-medium text-gray-700">
				Schedule Post (Optional)
			</label>
			<p class="mt-1 text-xs text-gray-500">
				Leave empty to save as draft. Set a time to schedule for automatic posting.
			</p>
			{#each form.fields.scheduled_at.issues() as issue, i (i)}
				<p class="mt-1 text-sm text-red-600">{issue.message}</p>
			{/each}
			<input
				{...form.fields.scheduled_at.as('datetime-local')}
				id="scheduled-at"
				type="datetime-local"
				class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-none"
			/>
		</div>
	{/if}

	<!-- Actions -->
	<div class="flex justify-end space-x-3 border-t pt-4">
		<Button variant="secondary" href="/admin/social">Cancel</Button>
		<Button
			type="submit"
			variant="primary"
			disabled={!!form.pending ||
				!selectedContentId ||
				!selectedPlatform ||
				!selectedAccountId ||
				isOverLimit}
		>
			{form.pending ? 'Creating...' : 'Create Post'}
		</Button>
	</div>
</div>
