<script lang="ts">
	import type { Content } from '$lib/types/content'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { formatRelativeDate } from '$lib/utils/date'

	interface Props {
		content: Content
		clickable?: boolean
		priority?: 'high' | 'auto'
		fullInfo?: boolean
	}

	let { content, clickable = true, priority = 'auto', fullInfo = false }: Props = $props()

	// Extract metadata safely
	const isGitHub = $derived(content.metadata?.externalSource?.source === 'github')
	const hasStats = $derived(isGitHub && (content.metadata?.stars || content.metadata?.forks))

	// Determine loading strategy based on priority
	const isAboveFold = priority === 'high'
	const loadingAttr = isAboveFold ? 'eager' : 'lazy'
	const fetchPriorityAttr = isAboveFold ? 'high' : undefined
</script>

<div class="relative flex h-full flex-col gap-2">
	<!-- OG Image for GitHub repos -->
	<a
		href={content.metadata.github}
		target="_blank"
		rel="noopener noreferrer"
		data-testid="library-thumbnail-link"
	>
			<img
				src={getCachedImageWithPreset(content.metadata.thumbnail, 'content', { h: 400 })}
				width="800"
				height="400"
				alt="{content.title} repository preview"
				loading={loadingAttr}
				fetchpriority={fetchPriorityAttr}
				decoding="async"
				class="w-full rounded-t-lg object-cover"
			/>
		</a>

		{#if fullInfo}
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
		{#if content.metadata?.npm}
			<div class="mt-auto">
				<div class="flex items-center gap-3 text-xs">
					<a
						href="https://www.npmjs.com/package/{content.metadata.npm}"
						target="_blank"
						rel="noopener noreferrer"
						class="relative z-20 flex items-center gap-1 text-orange-600 hover:text-orange-700"
						onclick={(e) => e.stopPropagation()}
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
						</svg>
						npm
					</a>
				</div>
			</div>
		{/if}
	</div>
