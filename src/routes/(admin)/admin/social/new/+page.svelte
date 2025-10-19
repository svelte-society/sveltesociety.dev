<script lang="ts">
	import PostForm from '$lib/ui/admin/social/PostForm.svelte'
	import {
		createPost,
		getPublishedContent,
		getActiveAccounts,
		generatePostPreview
	} from './data.remote'
	import type { Platform } from '$lib/schema/social'

	const publishedContent = $derived(await getPublishedContent())
	const accounts = $derived(await getActiveAccounts())

	// Available platforms based on connected accounts
	const availablePlatforms = $derived(
		Array.from(new Set(accounts.map((a) => a.platform)))
	)

	async function handleGeneratePreview(contentId: string, platform: Platform): Promise<string | null> {
		try {
			const preview = await generatePostPreview({ contentId, platform })
			return preview?.postText || null
		} catch (error) {
			console.error('Failed to generate preview:', error)
			return null
		}
	}
</script>

<div class="mx-auto max-w-4xl p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Create Social Media Post</h1>
		<p class="mt-1 text-sm text-gray-600">
			Generate and customize a social media post for published content
		</p>
	</div>

	{#if availablePlatforms.length === 0}
		<div class="rounded-md bg-yellow-50 p-4">
			<p class="text-sm text-yellow-700">
				No social media accounts connected. Please <a
					href="/admin/social/accounts/new"
					class="font-medium underline">connect an account</a
				> first.
			</p>
		</div>
	{:else}
		<form {...createPost}>
			<PostForm
				form={createPost}
				{publishedContent}
				{accounts}
				onGeneratePreview={handleGeneratePreview}
			/>
		</form>
	{/if}
</div>
