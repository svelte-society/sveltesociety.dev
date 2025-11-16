<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/ui/Button.svelte'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import { formatRelativeDate } from '$lib/utils/date'
	import { superForm } from 'sveltekit-superforms/client'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import CloudArrowDown from 'phosphor-svelte/lib/CloudArrowDown'
	import VideoCamera from 'phosphor-svelte/lib/VideoCamera'
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import Warning from 'phosphor-svelte/lib/Warning'
	import Clock from 'phosphor-svelte/lib/Clock'
	import Sparkle from 'phosphor-svelte/lib/Sparkle'

	let { data, form: actionForm } = $props()

	let deletingId = $state('')

	// Initialize unified import form
	const importFormInstance = superForm(data.importForm || { url: '' }, {
		resetForm: true
	})

	const { form: importForm, submitting } = importFormInstance

	// Helper to detect content type from URL
	function detectContentType(url: string): 'youtube' | 'github' | null {
		const youtubePattern =
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
		const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
		const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

		if (youtubePattern.test(url) || videoIdPattern.test(url)) {
			return 'youtube'
		}
		if (githubPattern.test(url) || repoPattern.test(url)) {
			return 'github'
		}
		return null
	}

	const detectedType = $derived(detectContentType($importForm.url))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="External Content Hub"
		description="Seamlessly import from YouTube and GitHub"
		icon={CloudArrowDown}
	/>

	<!-- Status Messages -->
	{#if actionForm?.error}
		<div class="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm">
			<Warning class="h-5 w-5 shrink-0 text-red-600" weight="fill" />
			<div class="text-sm text-red-800">{actionForm.error}</div>
		</div>
	{/if}

	{#if actionForm?.success}
		<div class="flex items-start gap-3 rounded-xl border border-green-300 bg-green-50 p-4 shadow-sm">
			<CheckCircle class="h-5 w-5 shrink-0 text-green-600" weight="fill" />
			<div>
				<p class="text-sm font-semibold text-green-800">Import completed successfully!</p>
				{#if actionForm.stats}
					<p class="mt-1 text-xs text-green-700">
						Created: {actionForm.stats.created} • Updated: {actionForm.stats.updated} • Deleted: {actionForm.stats.deleted}
					</p>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Two Column Layout -->
	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Left Column - Import Form (2/3) -->
		<div class="lg:col-span-2">
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-6 flex items-center gap-3">
					<Sparkle class="h-6 w-6 text-svelte-500" weight="duotone" />
					<h2 class="text-xl font-bold text-gray-900">Quick Import</h2>
				</div>

				<Form form={importFormInstance} action="?/import">
					<div class="space-y-5">
						<Input
							name="url"
							label="Content URL"
							placeholder="Paste YouTube video URL, GitHub repo URL, or monorepo package path..."
							description="Supports multiple formats - we'll auto-detect the source"
						/>

						<!-- Detection Badge -->
						{#if detectedType}
							<div class="rounded-xl border-2 {detectedType === 'youtube' ? 'border-red-200 bg-red-50' : 'border-gray-800 bg-gray-50'} p-4 transition-all">
								<div class="flex items-center gap-3">
									{#if detectedType === 'youtube'}
										<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
											<VideoCamera class="h-5 w-5 text-white" weight="fill" />
										</div>
										<div>
											<p class="font-semibold text-red-900">YouTube Video</p>
											<p class="text-xs text-red-700">Ready to import video content</p>
										</div>
									{:else if detectedType === 'github'}
										<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
											<GithubLogo class="h-5 w-5 text-white" weight="fill" />
										</div>
										<div>
											<p class="font-semibold text-gray-900">GitHub Repository</p>
											<p class="text-xs text-gray-700">Ready to import repository or package</p>
										</div>
									{/if}
								</div>
							</div>
						{/if}

						<div class="flex justify-end">
							<Button
								type="submit"
								primary
								disabled={$submitting || !detectedType}
							>
								{#if $submitting}
									<Clock class="h-4 w-4 animate-spin" />
									Importing...
								{:else}
									<CloudArrowDown class="h-4 w-4" weight="bold" />
									Import Content
								{/if}
							</Button>
						</div>
					</div>
				</Form>

				<!-- Import Tips -->
				<div class="mt-8 grid gap-3 sm:grid-cols-2">
					<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
						<div class="mb-1 flex items-center gap-2">
							<VideoCamera class="h-4 w-4 text-yellow-700" weight="bold" />
							<p class="text-xs font-semibold uppercase tracking-wide text-yellow-900">YouTube</p>
						</div>
						<p class="text-xs text-yellow-800">
							Requires <code class="rounded bg-yellow-200 px-1 py-0.5 font-mono text-[10px]">YOUTUBE_API_KEY</code>
						</p>
					</div>
					<div class="rounded-lg border border-gray-300 bg-gray-50 p-3">
						<div class="mb-1 flex items-center gap-2">
							<GithubLogo class="h-4 w-4 text-gray-700" weight="bold" />
							<p class="text-xs font-semibold uppercase tracking-wide text-gray-900">GitHub</p>
						</div>
						<p class="text-xs text-gray-700">
							Optional <code class="rounded bg-gray-200 px-1 py-0.5 font-mono text-[10px]">GITHUB_TOKEN</code> for rate limits
						</p>
					</div>
				</div>

				<!-- Supported Formats -->
				<div class="mt-4 rounded-lg border border-svelte-200 bg-svelte-50 p-4">
					<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-svelte-900">Supported Formats</p>
					<ul class="space-y-1.5 text-xs text-gray-700">
						<li class="flex items-start gap-2">
							<span class="text-svelte-500">•</span>
							<span><strong>YouTube:</strong> Full URLs, short URLs (youtu.be), or 11-char video IDs</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-svelte-500">•</span>
							<span><strong>GitHub:</strong> Full URLs, owner/repo format, or owner/repo/path for monorepos</span>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Right Column - Stats Cards (1/3) -->
		<div class="space-y-4">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Import Sources</h3>
			{#each data.sources as source}
				<div class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-svelte-300 hover:shadow-md">
					<div class="relative z-10">
						<div class="flex items-start justify-between">
							<div>
								<h4 class="font-semibold text-gray-900">{source.name}</h4>
								<p class="mt-1 text-2xl font-bold text-svelte-500">{source.count}</p>
								<p class="text-xs text-gray-500">total items</p>
							</div>
							{#if source.name.toLowerCase().includes('youtube')}
								<VideoCamera class="h-8 w-8 text-red-500/20" weight="duotone" />
							{:else if source.name.toLowerCase().includes('github')}
								<GithubLogo class="h-8 w-8 text-gray-900/20" weight="duotone" />
							{/if}
						</div>
						{#if source.lastSync}
							<div class="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
								<Clock class="h-3.5 w-3.5" />
								<span>Last sync {formatRelativeDate(source.lastSync)}</span>
							</div>
						{/if}
					</div>
					<div class="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-svelte-50/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Recent Imports -->
	{#if data.recentImports.length > 0}
		<section class="mt-8">
			<div class="mb-4 flex items-center gap-3">
				<Clock class="h-5 w-5 text-gray-500" weight="duotone" />
				<h2 class="text-xl font-bold text-gray-900">Recent Imports</h2>
			</div>
			<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
							<tr>
								<th scope="col" class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Content</th>
								<th scope="col" class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Type</th>
								<th scope="col" class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Source</th>
								<th scope="col" class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Imported</th>
								<th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 bg-white">
							{#each data.recentImports as item}
								<tr class="group transition-colors hover:bg-svelte-50/30">
									<td class="px-6 py-4">
										<div class="font-medium text-gray-900">{item.title}</div>
									</td>
									<td class="px-6 py-4">
										<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 capitalize">
											{item.type}
										</span>
									</td>
									<td class="px-6 py-4 text-gray-700">
										{item.metadata?.externalSource?.source || 'Unknown'}
									</td>
									<td class="px-6 py-4 text-gray-500">{formatRelativeDate(item.created_at)}</td>
									<td class="px-6 py-4">
										<div class="flex items-center justify-end gap-3">
											<a href="/admin/content/{item.id}" class="text-sm font-medium text-svelte-500 transition-colors hover:text-svelte-700">
												Edit
											</a>
											<form
												method="POST"
												action="?/deleteContent"
												use:enhance={() => {
													if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
														return ({ cancel }) => cancel()
													}
													deletingId = item.id
													return async ({ update }) => {
														await update()
														deletingId = ''
													}
												}}
											>
												<button
													type="submit"
													class="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
													disabled={deletingId === item.id}
													name="contentId"
													value={item.id}
												>
													{deletingId === item.id ? 'Deleting...' : 'Delete'}
												</button>
											</form>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	code {
		font-family: 'Courier New', monospace;
	}
</style>
