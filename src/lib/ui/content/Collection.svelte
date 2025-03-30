<script lang="ts">
	import type { Content } from '$lib/types/content'
	import { formatRelativeDate } from '$lib/utils/date'

	// Create a partial Content type for children that doesn't require the children property
	type ContentChild = Omit<Content, 'children'> & { children?: any[] }

	interface Props {
		children: ContentChild[]
	}

	let { children = [] }: Props = $props()

	// Add default author for content items that don't have one
	function getAuthor(content: ContentChild): string {
		return content?.author || 'Unknown'
	}
</script>

<ul class="space-y-2">
	{#each children as child}
		<li
			class="rounded border border-slate-200 bg-slate-100 px-3 py-1.5 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
		>
			<a href="/{child.type}/{child.slug}" class="text-svelte-800 hover:text-svelte-600 block">
				<h2
					class="text-svelte-800 hover:text-svelte-600 text-md block max-w-xl truncate overflow-hidden font-bold text-ellipsis"
				>
					{child?.title || 'Untitled'}
				</h2>

				<div class="mb-1 flex text-xs text-gray-500">
					<span class="mr-0.5 font-semibold capitalize">{child?.type || 'content'}</span>
					by {getAuthor(child)} •
					{child?.published_at ? formatRelativeDate(child.published_at) : 'Unknown date'}
				</div>
			</a>
		</li>
	{/each}
</ul>
