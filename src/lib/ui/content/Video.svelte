<script lang="ts">
	import VideoCamera from 'phosphor-svelte/lib/VideoCamera'
	import type { Content } from '$lib/types/content'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import Image from '$lib/ui/Image.svelte'

	let { content, priority = 'auto' }: { content: Content; priority?: 'high' | 'auto' } = $props()

	// Determine loading strategy based on priority
	const isAboveFold = priority === 'high'
	const loadingAttr = isAboveFold ? 'eager' : 'lazy'
	const fetchPriorityAttr = isAboveFold ? 'high' : undefined
</script>

<div class="space-y-3">
	{#if content.metadata.thumbnail}
		<a href={content.metadata.watchUrl} target="_blank" rel="noopener noreferrer" class="block">
			<div
				class="relative cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-90"
			>
				<Image
					src={content.metadata.thumbnail}
					height="450"
					width="800"
					alt={content.title}
					loading={loadingAttr}
					fetchpriority={fetchPriorityAttr}
					blurhash={content.metadata.blurhash}
					decoding="async"
					class="aspect-video w-full object-contain"
				/>
				<div
					class="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/10"
				>
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg">
						<svg class="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				</div>
			</div>
		</a>
	{/if}

	<div class="flex items-center gap-4 text-sm text-gray-600">
		{#if content.metadata?.channelTitle}
			<span class="font-medium">{content.metadata.channelTitle}</span>
		{/if}
		{#if content.metadata?.statistics?.viewCount}
			<span>{content.metadata.statistics.viewCount.toLocaleString()} views</span>
		{/if}
	</div>
</div>
