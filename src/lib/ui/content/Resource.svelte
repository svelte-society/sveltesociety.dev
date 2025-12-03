<script lang="ts">
	import type { Content } from '$lib/types/content'
	import type { CardVariant } from '../contentCard.variants'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut'

	interface Props {
		content: Content
		priority?: 'high' | 'auto'
		variant?: CardVariant
	}

	let { content, priority = 'auto', variant = 'list' }: Props = $props()

	const hasImage = $derived(!!content.metadata?.image)
	const link = $derived(content.metadata?.link || '#')

	// Determine loading strategy based on priority
	const isAboveFold = $derived(priority === 'high')
	const loadingAttr = $derived(isAboveFold ? 'eager' : 'lazy')
	const fetchPriorityAttr = $derived(isAboveFold ? 'high' : undefined)
</script>

{#if variant === 'detail'}
	<!-- Detail page: full image at top -->
	<div class="flex flex-col gap-4">
		{#if content.description}
			<p data-testid="content-description" class="text-sm sm:text-base">
				{content.description}
			</p>
		{/if}

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
			class="flex w-fit items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
		>
			<ArrowSquareOut size={16} />
			<span class="truncate">{link}</span>
		</a>
	</div>
{:else}
	<!-- Card view: 2-column layout with small thumbnail -->
	<div class="flex items-start gap-4">
		<div class="flex min-w-0 flex-1 flex-col gap-2">
			{#if content.description}
				<p data-testid="content-description" class="line-clamp-2 text-sm sm:text-base">
					{content.description}
				</p>
			{/if}
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				data-testid="resource-link"
				class="flex w-fit items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
			>
				<ArrowSquareOut size={16} />
				<span class="truncate">{link}</span>
			</a>
		</div>

		{#if hasImage}
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				class="flex-shrink-0"
				data-testid="resource-image-link"
			>
				<img
					src={getCachedImageWithPreset(content.metadata.image, 'thumbnail')}
					width="192"
					height="108"
					alt="{content.title} preview"
					loading={loadingAttr}
					fetchpriority={fetchPriorityAttr}
					decoding="async"
					class="h-[108px] w-48 rounded-lg object-cover"
				/>
			</a>
		{/if}
	</div>
{/if}
