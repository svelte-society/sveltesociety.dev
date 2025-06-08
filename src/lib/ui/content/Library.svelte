<script lang="ts">
	import type { Content } from '$lib/types/content'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	interface Props {
		content: Content
		clickable?: boolean
	}

	let { content, clickable = true }: Props = $props()

	// Extract metadata safely
	const isGitHub = $derived(content.metadata?.externalSource?.source === 'github')
	const hasStats = $derived(isGitHub && (content.metadata?.stars || content.metadata?.forks))

	// Determine the primary link
	const primaryLink = $derived(() => {
		if (content.metadata?.homepage && content.metadata.homepage !== content.metadata?.github) {
			return content.metadata.homepage
		}
		return content.metadata?.github || content.metadata?.npm
			? `https://www.npmjs.com/package/${content.metadata.npm}`
			: null
	})
</script>

<div class="relative h-full">
	{#if clickable}
		<a href="/{content.type}/{content.slug}" class="absolute inset-0 z-10">
			<span class="sr-only">View {content.title} details</span>
		</a>
	{/if}

	<div class="relative flex h-full flex-col gap-2">
		<!-- OG Image for GitHub repos -->
		{#if isGitHub && content.metadata?.ogImage}
			<div class="">
				{#if content.metadata?.github}
					<a
						href={content.metadata.github}
						target="_blank"
						rel="noopener noreferrer"
						class="relative z-20 block"
						onclick={(e) => e.stopPropagation()}
					>
						<img
							src={getCachedImageWithPreset(content.metadata.ogImage, 'content', { h: 400 })}
							alt="{content.title} repository preview"
							class="w-full rounded-t-lg object-cover transition-opacity hover:opacity-90"
							loading="lazy"
						/>
					</a>
				{:else}
					<img
						src={getCachedImageWithPreset(content.metadata.ogImage, 'content', { h: 400 })}
						alt="{content.title} repository preview"
						class="w-full rounded-t-lg object-cover"
						loading="lazy"
					/>
				{/if}
			</div>
		{/if}

		<!-- Description -->
		{#if content.description}
			<p class="sr-only">
				{content.description}
			</p>
		{/if}

		<!-- Stats and Links -->
		<div class="mt-auto space-y-2">
			{#if hasStats}
				<div class="sr-only">
					{#if content.metadata?.stars}
						<div class="flex items-center gap-1">
							<span>⭐</span>
							<span>{content.metadata.stars.toLocaleString()}</span>
						</div>
					{/if}
					{#if content.metadata?.forks}
						<div class="flex items-center gap-1">
							<span>🍴</span>
							<span>{content.metadata.forks.toLocaleString()}</span>
						</div>
					{/if}
					{#if content.metadata?.issues}
						<div class="flex items-center gap-1">
							<span>🐛</span>
							<span>{content.metadata.issues.toLocaleString()}</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- External Links -->
			<div class="flex items-center gap-3 text-xs">
				{#if content.metadata?.npm}
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
				{/if}

				{#if content.metadata?.github}
					<a
						href={content.metadata.github}
						target="_blank"
						rel="noopener noreferrer"
						class="relative z-20 flex items-center gap-1 text-gray-700 hover:text-gray-900"
						onclick={(e) => e.stopPropagation()}
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
						GitHub
					</a>
				{/if}

				{#if primaryLink() && primaryLink() !== content.metadata?.github}
					<a
						href={primaryLink()}
						target="_blank"
						rel="noopener noreferrer"
						class="relative z-20 flex items-center gap-1 text-blue-600 hover:text-blue-700"
						onclick={(e) => e.stopPropagation()}
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
						{content.metadata?.homepage ? 'Homepage' : 'View'}
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>
