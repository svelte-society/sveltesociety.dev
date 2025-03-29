<script lang="ts">
	import type { Content } from '$lib/types/content'
	import Button from '$lib/ui/Button.svelte'
	import { formatRelativeDate } from '$lib/utils/date'

	interface Props {
		children: Content[]
		slug: string
		type: string
	}

	let { slug, type, children = [] }: Props = $props()

	// Ensure children is always an array
	children = Array.isArray(children) ? children : []

	// Add default author for content items that don't have one
	function getAuthor(content: Content): string {
		return content?.author || 'Anonymous'
	}
</script>

<div class="mt-4">
	<h3 class="mb-3 text-lg font-semibold">Collection Contents</h3>

	{#if children && children.length > 0}
		<ul class="mb-4 flex flex-col gap-3">
			{#each children as child}
				<li
					class="rounded border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm transition-all hover:bg-slate-100"
				>
					<h2 class="text-lg font-bold">
						{#if child?.slug && child?.type}
							<a
								href="/{child.type}/{child.slug}"
								class="text-svelte-800 hover:text-svelte-600 hover:underline"
								>{child?.title || 'Untitled'}</a
							>
						{:else}
							{child?.title || 'Untitled'}
						{/if}
					</h2>

					<div class="mb-1 flex text-xs text-gray-500">
						<span class="mr-0.5 font-semibold capitalize">{child?.type || 'content'}</span>
						by {getAuthor(child)} •
						{child?.published_at ? formatRelativeDate(child.published_at) : 'Unknown date'}
					</div>

					{#if child?.description}
						<p class="mt-1 text-sm text-gray-700">{child.description}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<div class="rounded border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
			<p class="text-gray-500 italic">This collection is empty</p>
			<p class="mt-2 text-sm text-gray-400">Items added to this collection will appear here</p>
		</div>
	{/if}
</div>
