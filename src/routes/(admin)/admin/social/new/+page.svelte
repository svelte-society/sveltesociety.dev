<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import { createPost, getContentItems, getSponsors, getJobs } from '../data.remote'
	import { PLATFORM_CONFIG } from '$lib/types/social'
	import type { SocialPostType } from '$lib/types/social'

	// Form state
	let postType: SocialPostType = $state('custom')
	let selectedContentId = $state('')
	let selectedSponsorId = $state('')
	let selectedJobId = $state('')

	// Platform enables
	let enableTwitter = $state(true)
	let enableBluesky = $state(true)
	let enableLinkedin = $state(true)

	// Platform text
	let twitterText = $state('')
	let blueskyText = $state('')
	let linkedinText = $state('')

	// Character counts
	const twitterCount = $derived(twitterText.length)
	const blueskyCount = $derived(blueskyText.length)
	const linkedinCount = $derived(linkedinText.length)

	// Fetch linked items
	const contentItems = await getContentItems({ limit: 100 })
	const sponsors = await getSponsors({})
	const jobs = await getJobs({})

	const postTypeOptions = [
		{ value: 'custom', label: 'Custom Post' },
		{ value: 'content', label: 'Content Post' },
		{ value: 'sponsor', label: 'Sponsor Post' },
		{ value: 'job', label: 'Job Post' }
	]

	const contentOptions = $derived([
		{ value: '', label: 'Select content...' },
		...contentItems.map((c) => ({ value: c.id, label: `${c.title} (${c.type})` }))
	])

	const sponsorOptions = $derived([
		{ value: '', label: 'Select sponsor...' },
		...sponsors.map((s) => ({ value: s.id, label: s.company_name }))
	])

	const jobOptions = $derived([
		{ value: '', label: 'Select job...' },
		...jobs.map((j) => ({ value: j.id, label: `${j.title}${j.company ? ` at ${j.company}` : ''}` }))
	])

	function copyToAllPlatforms() {
		// Copy the longest text to all platforms
		const sourceText = twitterText || blueskyText || linkedinText
		twitterText = sourceText.slice(0, PLATFORM_CONFIG.twitter.maxChars)
		blueskyText = sourceText.slice(0, PLATFORM_CONFIG.bluesky.maxChars)
		linkedinText = sourceText
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader title="New Social Post" description="Create a new post for social media" icon={Plus} />

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Post Details</p>
			</div>
		</div>

		<div class="p-8">
			<form {...createPost} class="space-y-6">
				<!-- Title -->
				<Input
					label="Title"
					description="Internal reference name for this post"
					{...createPost.fields.title.as('text')}
					issues={createPost.fields.title.issues()}
					placeholder="e.g., New library announcement"
					data-testid="input-title"
				/>

				<!-- Post Type -->
				<Select
					label="Post Type"
					description="What type of content are you sharing?"
					name="post_type"
					options={postTypeOptions}
					bind:value={postType}
				/>

				<!-- Content Selector (for content posts) -->
				{#if postType === 'content'}
					<Select
						label="Linked Content"
						description="Select the content item to share"
						name="content_id"
						options={contentOptions}
						bind:value={selectedContentId}
					/>
				{/if}

				<!-- Sponsor Selector (for sponsor posts) -->
				{#if postType === 'sponsor'}
					<Select
						label="Linked Sponsor"
						description="Select the sponsor to promote"
						name="sponsor_id"
						options={sponsorOptions}
						bind:value={selectedSponsorId}
					/>
				{/if}

				<!-- Job Selector (for job posts) -->
				{#if postType === 'job'}
					<Select
						label="Linked Job"
						description="Select the job listing to share"
						name="job_id"
						options={jobOptions}
						bind:value={selectedJobId}
					/>
				{/if}

				<!-- Link URL -->
				<Input
					label="Link URL"
					description="The URL to include in the post (optional for linked content)"
					{...createPost.fields.link_url.as('url')}
					issues={createPost.fields.link_url.issues()}
					placeholder="https://sveltesociety.dev/..."
				/>

				<!-- Platform Section -->
				<div class="space-y-4 rounded-lg border border-gray-200 p-6">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium text-gray-900">Platform Content</h3>
						<button
							type="button"
							class="text-sm text-svelte-500 hover:underline"
							onclick={copyToAllPlatforms}
						>
							Copy to all platforms
						</button>
					</div>

					<!-- Twitter/X -->
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<input
								type="checkbox"
								id="enable_twitter"
								name="enable_twitter"
								bind:checked={enableTwitter}
								class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
							/>
							<label for="enable_twitter" class="font-medium text-gray-700">
								Twitter/X
								<span class="ml-2 text-sm font-normal text-gray-500">
									({twitterCount}/{PLATFORM_CONFIG.twitter.maxChars})
								</span>
							</label>
						</div>
						{#if enableTwitter}
							<textarea
								name="twitter_text"
								rows={3}
								placeholder="Write your Twitter/X post..."
								bind:value={twitterText}
								maxlength={PLATFORM_CONFIG.twitter.maxChars}
								class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200"
								data-testid="textarea-twitter"
							></textarea>
						{/if}
					</div>

					<!-- Bluesky -->
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<input
								type="checkbox"
								id="enable_bluesky"
								name="enable_bluesky"
								bind:checked={enableBluesky}
								class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
							/>
							<label for="enable_bluesky" class="font-medium text-gray-700">
								Bluesky
								<span class="ml-2 text-sm font-normal text-gray-500">
									({blueskyCount}/{PLATFORM_CONFIG.bluesky.maxChars})
								</span>
							</label>
						</div>
						{#if enableBluesky}
							<textarea
								name="bluesky_text"
								rows={3}
								placeholder="Write your Bluesky post..."
								bind:value={blueskyText}
								maxlength={PLATFORM_CONFIG.bluesky.maxChars}
								class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200"
								data-testid="textarea-bluesky"
							></textarea>
						{/if}
					</div>

					<!-- LinkedIn -->
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<input
								type="checkbox"
								id="enable_linkedin"
								name="enable_linkedin"
								bind:checked={enableLinkedin}
								class="h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
							/>
							<label for="enable_linkedin" class="font-medium text-gray-700">
								LinkedIn
								<span class="ml-2 text-sm font-normal text-gray-500">
									({linkedinCount}/{PLATFORM_CONFIG.linkedin.maxChars})
								</span>
							</label>
						</div>
						{#if enableLinkedin}
							<textarea
								name="linkedin_text"
								rows={4}
								placeholder="Write your LinkedIn post..."
								bind:value={linkedinText}
								maxlength={PLATFORM_CONFIG.linkedin.maxChars}
								class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200"
								data-testid="textarea-linkedin"
							></textarea>
						{/if}
					</div>
				</div>

				{#if createPost.result && !createPost.result.success}
					<div class="rounded-lg bg-red-50 p-4 text-red-800">
						{createPost.result.text}
					</div>
				{/if}

				<div class="flex justify-end gap-3 border-t pt-6">
					<Button variant="secondary" href="/admin/social" data-testid="cancel-button">Cancel</Button>
					<Button type="submit" disabled={!!createPost.pending} data-testid="submit-button">
						{createPost.pending ? 'Creating...' : 'Create Post'}
					</Button>
				</div>
			</form>
		</div>
	</div>
</div>
