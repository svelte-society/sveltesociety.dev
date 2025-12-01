<script lang="ts">
	import type { Content } from '$lib/types/content'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut'

	interface Props {
		content: Content
		priority?: 'high' | 'auto'
	}

	let { content, priority = 'auto' }: Props = $props()

	const hasImage = $derived(!!content.metadata?.image)
	const link = $derived(content.metadata?.link || '#')

	// Determine loading strategy based on priority
	const isAboveFold = priority === 'high'
	const loadingAttr = isAboveFold ? 'eager' : 'lazy'
	const fetchPriorityAttr = isAboveFold ? 'high' : undefined
</script>

<div class="relative flex h-full flex-col gap-2">
	{#if hasImage}
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			data-testid="resource-image-link"
		>
			<img
				src={getCachedImageWithPreset(content.metadata.image, 'content', { h: 400 })}
				width="800"
				height="400"
				alt="{content.title} preview"
				loading={loadingAttr}
				fetchpriority={fetchPriorityAttr}
				decoding="async"
				class="w-full rounded-lg object-cover"
			/>
		</a>
	{/if}

	<a
		href={link}
		target="_blank"
		rel="noopener noreferrer"
		data-testid="resource-link"
		class="mt-auto flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
	>
		<ArrowSquareOut size={16} />
		<span class="truncate">{link}</span>
	</a>
</div>
