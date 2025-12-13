<script lang="ts">
	import type { Content } from '$lib/types/content'
	import type { CardVariant } from '../contentCard.variants'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { formatRelativeDate } from '$lib/utils/date'

	interface Props {
		content: Content
		clickable?: boolean
		priority?: 'high' | 'auto'
		variant?: CardVariant
	}

	let { content, clickable = true, priority = 'auto', variant = 'list' }: Props = $props()

	// Extract metadata safely
	const isGitHub = $derived(content.metadata?.externalSource?.source === 'github')
	const hasStats = $derived(isGitHub && (content.metadata?.stars || content.metadata?.forks))

	// Validate NPM package name - filter out invalid/placeholder names
	const isValidNpmPackage = $derived.by(() => {
		const npm = content.metadata?.npm
		if (!npm) return false

		// Filter out common placeholder/invalid names
		const invalidNames = ['www', 'app', 'web', 'site', 'website', 'monorepo', 'workspace']
		const lowerName = npm.toLowerCase()

		if (invalidNames.includes(lowerName)) return false
		if (lowerName.endsWith('-monorepo') || lowerName.endsWith('-workspace')) return false

		// Valid NPM package name pattern
		const validPackagePattern = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
		return validPackagePattern.test(npm)
	})

	// Determine loading strategy based on priority
	const isAboveFold = $derived(priority === 'high')
	const loadingAttr = $derived(isAboveFold ? 'eager' : 'lazy')
	const fetchPriorityAttr = $derived(isAboveFold ? 'high' : undefined)

	// Use packageUrl for monorepo packages, otherwise use github URL
	const githubUrl = $derived(content.metadata?.packageUrl || content.metadata?.github)
</script>

<div class="relative flex h-full flex-col gap-2">
	<!-- OG Image for GitHub repos -->
	<a
		href={githubUrl}
		target="_blank"
		rel="noopener noreferrer"
		data-testid="library-thumbnail-link"
	>
			<img
				src={getCachedImageWithPreset(content.metadata?.thumbnail, 'content', { h: 400 })}
				width="800"
				height="400"
				alt="{content.title} repository preview"
				loading={loadingAttr}
				fetchpriority={fetchPriorityAttr}
				decoding="async"
				class="w-full rounded-t-lg object-cover"
			/>
		</a>

	{#if variant === 'detail'}
		<!-- Owner Info & Stats -->
		<div class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-gray-100 px-3 py-2">
			{#if content.metadata?.owner}
				<div class="flex items-center gap-2">
					{#if content.metadata.owner.avatar}
						<img
							src={content.metadata.owner.avatar}
							alt={content.metadata.owner.name}
							class="h-6 w-6 rounded-full"
							loading="lazy"
						/>
					{/if}
					<a
						href={content.metadata.owner.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
					>
						{content.metadata.owner.name}
					</a>
				</div>
			{/if}

			{#if hasStats}
				<div class="flex flex-wrap items-center gap-4 text-sm text-gray-700">
					{#if content.metadata?.stars}
						<div class="flex items-center gap-1.5" title="Stars">
							<span>⭐</span>
							<span class="font-medium">{content.metadata.stars.toLocaleString()}</span>
						</div>
					{/if}
					{#if content.metadata?.forks}
						<div class="flex items-center gap-1.5" title="Forks">
							<span>🍴</span>
							<span class="font-medium">{content.metadata.forks.toLocaleString()}</span>
						</div>
					{/if}
					{#if content.metadata?.issues}
						<div class="flex items-center gap-1.5" title="Open Issues">
							<span>🐛</span>
							<span class="font-medium">{content.metadata.issues.toLocaleString()}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Dates -->
		<div class="flex flex-wrap items-center justify-between gap-4 rounded-md bg-gray-100 px-3 py-2 text-sm">
			{#if content.metadata?.updatedAt}
				<div class="flex items-center gap-2">
					<span class="font-medium text-gray-600">Last Updated:</span>
					<span class="text-gray-700">{formatRelativeDate(content.metadata.updatedAt)}</span>
				</div>
			{/if}
			{#if content.metadata?.createdAt}
				<div class="flex items-center gap-2">
					<span class="font-medium text-gray-600">Created:</span>
					<span class="text-gray-700">{formatRelativeDate(content.metadata.createdAt)}</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- External Links -->
	{#if isValidNpmPackage}
		<div class="mt-auto rounded-md bg-gray-100 px-3 py-2">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium text-gray-600">NPM:</span>
				<a
					href="https://www.npmjs.com/package/{content.metadata.npm}"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 hover:underline"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M0 0h24v24H0V0z" fill="none"/>
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
					</svg>
					{content.metadata.npm}
				</a>
			</div>
		</div>
	{/if}
	</div>
