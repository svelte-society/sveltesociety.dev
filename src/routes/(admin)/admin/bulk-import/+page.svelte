<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Stack from 'phosphor-svelte/lib/Stack'
	import Lightning from 'phosphor-svelte/lib/Lightning'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import VideoCamera from 'phosphor-svelte/lib/VideoCamera'
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo'
	import TrendUp from 'phosphor-svelte/lib/TrendUp'
	import Package from 'phosphor-svelte/lib/Package'
	import Info from 'phosphor-svelte/lib/Info'
	import { bulkImport, type BulkImportResult } from './bulk-import.remote'

	// State for import results
	let importResults = $state<BulkImportResult | null>(null)

	// Get current URL value for counting
	const urlsValue = $derived(String(bulkImport.fields.urls.value() ?? ''))

	// Count URLs in textarea
	const urlCount = $derived(
		urlsValue
			.trim()
			.split('\n')
			.filter((line) => line.trim()).length
	)
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Bulk Import"
		description="Import multiple items at once for maximum efficiency"
		icon={Stack}
	/>

	<!-- Info Banner -->
	<div
		class="rounded-xl border border-svelte-200 bg-gradient-to-br from-svelte-50 to-white p-6 shadow-sm"
	>
		<div class="flex items-start gap-4">
			<div
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-svelte-100"
			>
				<Package class="h-5 w-5 text-svelte-700" weight="duotone" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold text-gray-900">Monorepo Package Support</h3>
				<p class="mt-1 text-sm text-gray-700">
					Import individual packages from monorepos by specifying a path:
				</p>
				<div class="mt-3 grid gap-2 sm:grid-cols-2">
					<div class="rounded-lg bg-white p-3 shadow-sm">
						<p class="text-xs font-medium text-gray-500">Short Format</p>
						<code
							class="mt-1 block rounded bg-svelte-100 px-2 py-1 font-mono text-xs text-svelte-900"
						>
							owner/repo/packages/kit
						</code>
					</div>
					<div class="rounded-lg bg-white p-3 shadow-sm">
						<p class="text-xs font-medium text-gray-500">Full URL</p>
						<code
							class="mt-1 block rounded bg-svelte-100 px-2 py-1 font-mono text-xs text-svelte-900"
						>
							github.com/owner/repo/tree/main/packages/kit
						</code>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Left Column - Import Form (2/3) -->
		<div class="lg:col-span-2">
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<Lightning class="h-6 w-6 text-svelte-500" weight="duotone" />
						<h2 class="text-xl font-bold text-gray-900">Batch Import</h2>
					</div>
					{#if urlCount > 0}
						<div class="rounded-full bg-svelte-100 px-3 py-1">
							<span class="text-sm font-semibold text-svelte-900"
								>{urlCount} URL{urlCount !== 1 ? 's' : ''}</span
							>
						</div>
					{/if}
				</div>

				<form
					{...bulkImport.enhance(async ({ submit }) => {
						importResults = null
						try {
							await submit()
							const result = bulkImport.result as BulkImportResult | undefined
							if (result) {
								importResults = result
								if (result.success) {
									toast.success(
										`Successfully imported ${result.summary?.successful || 0} item(s)`
									)
									bulkImport.fields.urls.set('')
								} else if (result.error) {
									toast.error(result.error)
								}
							}
						} catch {
							toast.error('Failed to process bulk import')
						}
					})}
					class="flex flex-col gap-6"
				>
					<div class="flex flex-col gap-2">
						<label class="text-xs font-medium outline-none">
							URLs (one per line)
							<textarea
								{...bulkImport.fields.urls.as('text')}
								placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ
https://github.com/sveltejs/svelte
https://github.com/sveltejs/kit/tree/main/packages/kit
sveltejs/kit/packages/adapter-node
owner/repo-name"
								rows={12}
								class="mt-2 w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200"
								data-testid="textarea-urls"
							></textarea>
						</label>
						<div class="text-xs text-slate-500">
							Enter YouTube URLs, video IDs, GitHub URLs, or owner/repo/path format. Maximum 50
							URLs.
						</div>
					</div>

					<input type="hidden" name="batchSize" value="5" />
					<input type="hidden" name="skipExisting" value="true" />

					<div
						class="flex items-center justify-between rounded-lg border-t border-gray-200 pt-6"
					>
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<Info class="h-4 w-4" weight="duotone" />
							<span>Processing in batches of 5</span>
						</div>
						<Button
							type="submit"
							variant="primary"
							disabled={!!bulkImport.pending || urlCount === 0}
						>
							{#if bulkImport.pending}
								<Lightning class="h-4 w-4 animate-pulse" weight="fill" />
								Processing...
							{:else}
								<Stack class="h-4 w-4" weight="bold" />
								Import {urlCount} Item{urlCount !== 1 ? 's' : ''}
							{/if}
						</Button>
					</div>
				</form>

				<!-- Format Examples -->
				<div class="mt-6 space-y-3">
					<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
						Supported Formats
					</p>
					<div class="grid gap-3 sm:grid-cols-2">
						<div class="rounded-lg border border-red-200 bg-red-50 p-3">
							<div class="mb-2 flex items-center gap-2">
								<VideoCamera class="h-4 w-4 text-red-700" weight="bold" />
								<span class="text-xs font-semibold text-red-900">YouTube</span>
							</div>
							<ul class="space-y-1 text-xs text-red-800">
								<li>• Full URL: youtube.com/watch?v=...</li>
								<li>• Short URL: youtu.be/...</li>
								<li>• Video ID: dQw4w9WgXcQ</li>
							</ul>
						</div>
						<div class="rounded-lg border border-gray-300 bg-gray-50 p-3">
							<div class="mb-2 flex items-center gap-2">
								<GithubLogo class="h-4 w-4 text-gray-700" weight="bold" />
								<span class="text-xs font-semibold text-gray-900">GitHub</span>
							</div>
							<ul class="space-y-1 text-xs text-gray-700">
								<li>• Full URL: github.com/owner/repo</li>
								<li>• Short: owner/repo</li>
								<li>• Monorepo: owner/repo/packages/kit</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Import Results -->
			{#if importResults?.summary}
				<div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
						<TrendUp class="h-5 w-5 text-svelte-500" weight="duotone" />
						Import Results
					</h3>

					<div class="grid gap-3 sm:grid-cols-4">
						<div class="rounded-lg bg-gray-50 p-4 text-center">
							<p class="text-2xl font-bold text-gray-900">
								{importResults.summary.total}
							</p>
							<p class="text-xs text-gray-600">Total</p>
						</div>
						<div class="rounded-lg bg-green-50 p-4 text-center">
							<p class="text-2xl font-bold text-green-700">
								{importResults.summary.successful}
							</p>
							<p class="text-xs text-green-600">Successful</p>
						</div>
						<div class="rounded-lg bg-red-50 p-4 text-center">
							<p class="text-2xl font-bold text-red-700">
								{importResults.summary.failed}
							</p>
							<p class="text-xs text-red-600">Failed</p>
						</div>
						<div class="rounded-lg bg-yellow-50 p-4 text-center">
							<p class="text-2xl font-bold text-yellow-700">
								{importResults.summary.skipped}
							</p>
							<p class="text-xs text-yellow-600">Skipped</p>
						</div>
					</div>

					{#if importResults.results && importResults.results.length > 0}
						<div class="mt-6 space-y-2">
							<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
								Detailed Results
							</p>
							<div
								class="max-h-96 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3"
							>
								{#each importResults.results as result}
									<div
										class="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm"
									>
										{#if result.success}
											<CheckCircle
												class="h-5 w-5 shrink-0 text-green-600"
												weight="fill"
											/>
										{:else}
											<XCircle
												class="h-5 w-5 shrink-0 text-red-600"
												weight="fill"
											/>
										{/if}
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-medium text-gray-900">
												{result.url}
											</p>
											{#if result.error}
												<p class="mt-0.5 text-xs text-red-600">{result.error}</p>
											{/if}
											{#if result.type}
												<span
													class="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700"
												>
													{result.type}
												</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right Column - Tips & Stats (1/3) -->
		<div class="space-y-6">
			<!-- Quick Tips -->
			<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
				<h3
					class="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
				>
					<Info class="h-4 w-4" weight="duotone" />
					Quick Tips
				</h3>
				<ul class="space-y-3 text-sm text-gray-700">
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-svelte-500">✓</span>
						<span>Paste one URL per line</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-svelte-500">✓</span>
						<span>Mix YouTube and GitHub URLs</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-svelte-500">✓</span>
						<span>Maximum 50 URLs per batch</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-svelte-500">✓</span>
						<span>Duplicates are automatically skipped</span>
					</li>
				</ul>
			</div>

			<!-- Import Stats -->
			<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
				<h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
					Processing Speed
				</h3>
				<div class="space-y-4">
					<div>
						<div class="mb-2 flex justify-between text-xs">
							<span class="text-gray-600">YouTube Videos</span>
							<span class="font-medium text-gray-900">~3-5s each</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-gray-100">
							<div
								class="h-full w-3/4 rounded-full bg-gradient-to-r from-red-500 to-red-600"
							></div>
						</div>
					</div>
					<div>
						<div class="mb-2 flex justify-between text-xs">
							<span class="text-gray-600">GitHub Repos</span>
							<span class="font-medium text-gray-900">~2-4s each</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-gray-100">
							<div
								class="h-full w-2/3 rounded-full bg-gradient-to-r from-gray-700 to-gray-900"
							></div>
						</div>
					</div>
				</div>
				<p class="mt-4 rounded-lg bg-svelte-50 p-3 text-xs text-gray-700">
					<strong class="text-svelte-900">Tip:</strong> Larger batches are processed in
					parallel for faster imports.
				</p>
			</div>

			<!-- Requirements -->
			<div class="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
				<h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-yellow-900">
					API Requirements
				</h3>
				<div class="space-y-2 text-xs">
					<div class="rounded-lg bg-white p-3">
						<p class="font-semibold text-yellow-900">YOUTUBE_API_KEY</p>
						<p class="mt-1 text-yellow-800">Required for importing videos</p>
					</div>
					<div class="rounded-lg bg-white p-3">
						<p class="font-semibold text-gray-900">GITHUB_TOKEN</p>
						<p class="mt-1 text-gray-700">Optional, improves rate limits</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
