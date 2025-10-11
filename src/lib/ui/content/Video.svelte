<script lang="ts">
	import VideoCamera from 'phosphor-svelte/lib/VideoCamera'
	import type { Content } from '$lib/types/content'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	let { content }: { content: Content } = $props()
</script>

<div class="space-y-3">
	{#if content.metadata?.thumbnail && content.metadata?.watchUrl}
		<a href={content.metadata.watchUrl} target="_blank" rel="noopener noreferrer" class="block">
			<div
				class="relative cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-90"
			>
				<img
					src={getCachedImageWithPreset(content.metadata.thumbnail, 'content', {
						w: 800,
						fit: 'inside',
						we: true
					})}
					height="450"
					width="800"
					alt={content.title}
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
	{:else if content.metadata?.thumbnail}
		<div class="relative overflow-hidden rounded-lg">
			<img
				src={getCachedImageWithPreset(content.metadata.thumbnail, 'content', {
					w: 400,
					fit: 'inside',
					we: true
				})}
				alt={content.title}
				class="h-48 w-full bg-gray-200 object-contain"
			/>
		</div>
	{:else if content.metadata?.watchUrl}
		<!-- Show placeholder when no thumbnail is available -->
		<a href={content.metadata.watchUrl} target="_blank" rel="noopener noreferrer" class="block">
			<div
				class="relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 transition-opacity hover:opacity-90"
			>
				<div class="text-center text-gray-500">
					<VideoCamera size={48} class="mx-auto mb-2" />
					<p class="text-sm">YouTube Video</p>
				</div>
				<div
					class="bg-opacity-30 hover:bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black transition-all"
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
