<script lang="ts">
	import { page } from '$app/state'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'
	import { initForm } from '$lib/utils/form.svelte'
	import ShareNetwork from 'phosphor-svelte/lib/ShareNetwork'
	import {
		getPost,
		updatePost,
		deletePost,
		schedulePost,
		unschedulePost,
		updatePlatformText
	} from '../data.remote'
	import {
		PLATFORM_CONFIG,
		POST_STATUS_CONFIG,
		POST_TYPE_CONFIG
	} from '$lib/types/social'
	import type { SocialPlatform } from '$lib/types/social'

	const postId = page.params.id!
	const post = $derived(await getPost({ id: postId }))

	// Initialize form with post data
	initForm(updatePost, () => ({
		id: postId,
		title: post?.title ?? '',
		link_url: post?.link_url ?? '',
		utm_source: post?.utm_source ?? '',
		utm_medium: post?.utm_medium ?? 'social',
		utm_campaign: post?.utm_campaign ?? '',
		twitter_text: post?.platforms.find((p) => p.platform === 'twitter')?.text ?? '',
		bluesky_text: post?.platforms.find((p) => p.platform === 'bluesky')?.text ?? '',
		linkedin_text: post?.platforms.find((p) => p.platform === 'linkedin')?.text ?? ''
	}))

	// Schedule form state
	let scheduleDate = $state('')
	let scheduleTime = $state('')

	// Delete dialog state
	let deleteDialogOpen = $state(false)

	// Create isolated delete form instance for this post
	const remove = deletePost.for(postId)

	function getPlatformText(platform: SocialPlatform): string {
		return post?.platforms.find((p) => p.platform === platform)?.text ?? ''
	}

	function getCharacterCount(platform: SocialPlatform): number {
		return getPlatformText(platform).length
	}

	function getStatusColor(status: string): string {
		return POST_STATUS_CONFIG[status as keyof typeof POST_STATUS_CONFIG]?.color || 'default'
	}

	function getTypeColor(type: string): string {
		return POST_TYPE_CONFIG[type as keyof typeof POST_TYPE_CONFIG]?.color || 'default'
	}

	function formatScheduleDateTime(): string {
		if (!scheduleDate || !scheduleTime) return ''
		return `${scheduleDate}T${scheduleTime}:00`
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Social Post"
		description={post?.title || 'Loading...'}
		icon={ShareNetwork}
	/>

	{#if post}
		<div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
			<!-- Main Form -->
			<div class="space-y-6">
				<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
						<div class="flex items-center gap-3">
							<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
							<p class="text-sm font-medium text-gray-600">Post Details</p>
						</div>
					</div>

					<div class="p-8">
						<form {...updatePost} class="space-y-6">
							<input {...updatePost.fields.id.as('hidden', postId)} />

							<!-- Title -->
							<Input
								label="Title"
								description="Internal reference name for this post"
								{...updatePost.fields.title.as('text')}
								issues={updatePost.fields.title.issues()}
								data-testid="input-title"
							/>

							<!-- Link URL -->
							<Input
								label="Link URL"
								description="The URL included in the post"
								{...updatePost.fields.link_url.as('url')}
								issues={updatePost.fields.link_url.issues()}
							/>

							<!-- UTM Parameters -->
							<div class="grid gap-4 sm:grid-cols-3">
								<Input
									label="UTM Source"
									{...updatePost.fields.utm_source.as('text')}
									placeholder="e.g., twitter"
								/>
								<Input
									label="UTM Medium"
									{...updatePost.fields.utm_medium.as('text')}
									placeholder="e.g., social"
								/>
								<Input
									label="UTM Campaign"
									{...updatePost.fields.utm_campaign.as('text')}
									placeholder="e.g., launch"
								/>
							</div>

							<!-- Platform Content -->
							<div class="space-y-4 rounded-lg border border-gray-200 p-6">
								<h3 class="text-lg font-medium text-gray-900">Platform Content</h3>

								{#each post.platforms as platform}
									<div class="space-y-2">
										<div class="flex items-center justify-between">
											<label class="font-medium text-gray-700">
												{PLATFORM_CONFIG[platform.platform]?.label || platform.platform}
												<span class="ml-2 text-sm font-normal text-gray-500">
													({platform.text.length}/{PLATFORM_CONFIG[platform.platform]?.maxChars})
												</span>
											</label>
											{#if platform.status !== 'pending'}
												<Badge
													color={platform.status === 'published' ? 'success' : 'danger'}
													text={platform.status}
												/>
											{/if}
										</div>
										<textarea
											name="{platform.platform}_text"
											rows={platform.platform === 'linkedin' ? 4 : 3}
											value={platform.text}
											maxlength={PLATFORM_CONFIG[platform.platform]?.maxChars}
											class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200"
										></textarea>
										{#if platform.external_post_id}
											<p class="text-xs text-gray-500">
												External ID: {platform.external_post_id}
											</p>
										{/if}
										{#if platform.error_message}
											<p class="text-xs text-red-600">
												Error: {platform.error_message}
											</p>
										{/if}
									</div>
								{/each}
							</div>

							{#if updatePost.result?.success}
								<div class="rounded-lg bg-green-50 p-4 text-green-800">
									Changes saved successfully!
								</div>
							{/if}

							{#if updatePost.result && !updatePost.result.success}
								<div class="rounded-lg bg-red-50 p-4 text-red-800">
									{updatePost.result.text}
								</div>
							{/if}

							<div class="flex justify-between border-t pt-6">
								<!-- Delete Button -->
								<DialogTrigger onclick={() => (deleteDialogOpen = true)} variant="danger" data-testid="delete-button">
									Delete
								</DialogTrigger>

								<div class="flex gap-3">
									<Button variant="secondary" href="/admin/social" data-testid="back-button">Back</Button>
									<Button type="submit" disabled={!!updatePost.pending} data-testid="save-button">
										{updatePost.pending ? 'Saving...' : 'Save Changes'}
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Status Card -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-medium text-gray-900">Status</h3>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Status</span>
							<Badge color={getStatusColor(post.status)} text={POST_STATUS_CONFIG[post.status]?.label || post.status} />
						</div>

						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Type</span>
							<Badge color={getTypeColor(post.post_type)} text={POST_TYPE_CONFIG[post.post_type]?.label || post.post_type} />
						</div>

						{#if post.scheduled_at}
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Scheduled</span>
								<span class="text-sm font-medium">
									{new Date(post.scheduled_at).toLocaleString()}
								</span>
							</div>
						{/if}

						{#if post.published_at}
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Published</span>
								<span class="text-sm font-medium">
									{new Date(post.published_at).toLocaleString()}
								</span>
							</div>
						{/if}

						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Created</span>
							<span class="text-sm font-medium">
								{new Date(post.created_at).toLocaleString()}
							</span>
						</div>

						{#if post.creator_name}
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Created by</span>
								<span class="text-sm font-medium">{post.creator_name}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Scheduling Card -->
				{#if post.status === 'draft'}
					<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h3 class="mb-4 text-lg font-medium text-gray-900">Schedule Post</h3>

						<form {...schedulePost} class="space-y-4">
							<input type="hidden" name="id" value={postId} />

							<div class="grid gap-3 sm:grid-cols-2">
								<div>
									<label for="schedule_date" class="mb-1 block text-sm font-medium text-gray-700">
										Date
									</label>
									<input
										type="date"
										id="schedule_date"
										bind:value={scheduleDate}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-svelte-500 focus:ring-svelte-500"
									/>
								</div>
								<div>
									<label for="schedule_time" class="mb-1 block text-sm font-medium text-gray-700">
										Time
									</label>
									<input
										type="time"
										id="schedule_time"
										bind:value={scheduleTime}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-svelte-500 focus:ring-svelte-500"
									/>
								</div>
							</div>

							<input type="hidden" name="scheduled_at" value={formatScheduleDateTime()} />

							{#if schedulePost.result && !schedulePost.result.success}
								<p class="text-sm text-red-600">{schedulePost.result.text}</p>
							{/if}

							<Button
								type="submit"
								class="w-full"
								disabled={!scheduleDate || !scheduleTime || !!schedulePost.pending}
							>
								{schedulePost.pending ? 'Scheduling...' : 'Schedule Post'}
							</Button>
						</form>
					</div>
				{/if}

				<!-- Unschedule Card -->
				{#if post.status === 'scheduled'}
					<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h3 class="mb-4 text-lg font-medium text-gray-900">Scheduling</h3>

						<p class="mb-4 text-sm text-gray-600">
							This post is scheduled for {new Date(post.scheduled_at!).toLocaleString()}
						</p>

						<form {...unschedulePost}>
							<input type="hidden" name="id" value={postId} />
							<Button type="submit" variant="secondary" class="w-full">
								{unschedulePost.pending ? 'Unscheduling...' : 'Unschedule (Back to Draft)'}
							</Button>
						</form>
					</div>
				{/if}

				<!-- Linked Content Card -->
				{#if post.content_title || post.sponsor_name || post.job_title}
					<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h3 class="mb-4 text-lg font-medium text-gray-900">Linked Item</h3>

						{#if post.content_title}
							<div class="space-y-2">
								<p class="text-sm text-gray-600">Content</p>
								<p class="font-medium">{post.content_title}</p>
								{#if post.content_type}
									<Badge color="default" text={post.content_type} />
								{/if}
								{#if post.content_slug}
									<a
										href="/{post.content_type}/{post.content_slug}"
										class="block text-sm text-svelte-500 hover:underline"
										target="_blank"
									>
										View content →
									</a>
								{/if}
							</div>
						{/if}

						{#if post.sponsor_name}
							<div class="space-y-2">
								<p class="text-sm text-gray-600">Sponsor</p>
								<div class="flex items-center gap-3">
									{#if post.sponsor_logo}
										<img
											src={post.sponsor_logo}
											alt={post.sponsor_name}
											class="h-10 w-10 rounded-lg object-contain"
										/>
									{/if}
									<p class="font-medium">{post.sponsor_name}</p>
								</div>
							</div>
						{/if}

						{#if post.job_title}
							<div class="space-y-2">
								<p class="text-sm text-gray-600">Job</p>
								<p class="font-medium">{post.job_title}</p>
								{#if post.job_company}
									<p class="text-sm text-gray-500">at {post.job_company}</p>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
			<p class="text-gray-500">Post not found</p>
			<Button variant="secondary" href="/admin/social" class="mt-4">Back to Posts</Button>
		</div>
	{/if}
</div>

{#snippet confirmDelete()}
	<form
		{...remove.enhance(async ({ submit }) => {
			await submit()
		})}
	>
		<Button type="submit" variant="danger" disabled={!!remove.pending} data-testid="confirm-delete-button">
			{remove.pending ? 'Deleting...' : 'Confirm Delete'}
		</Button>
	</form>
{/snippet}

<ConfirmDialog
	id="delete-post-dialog"
	bind:open={deleteDialogOpen}
	title="Delete Post"
	description="Are you sure you want to delete this post? This cannot be undone."
	confirm={confirmDelete}
/>
