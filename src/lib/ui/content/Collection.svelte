<script lang="ts">
import type { Content } from '$lib/server/db/content'
import Button from '$lib/ui/Button.svelte'
import { formatRelativeDate } from '$lib/utils/date'

// Create a partial content interface for child items that might have missing fields
type PartialContent = Partial<Content> & { 
	id: string;
	author?: string; // Add author which isn't in the original Content interface
};

interface Props {
	child_content: PartialContent[]
	slug: string
	type: string
}

let { slug, type, child_content = [] }: Props = $props()

// Add default author for content items that don't have one
function getAuthor(content: PartialContent): string {
	return content?.author || 'Anonymous';
}
</script>

<div class="mt-2">
	{#if child_content && child_content.length > 0}
		<ul class="mb-4 flex flex-col gap-1.5">
			{#each child_content as child}
				<li class="border border-slate-200 bg-slate-100 px-2.5 py-1.5 rounded">
					<h2 class="text-md font-bold">
						{#if child?.slug && child?.type}
							<a href="/{child.type}/{child.slug}">{child?.title || 'Untitled'}</a>
						{:else}
							{child?.title || 'Untitled'}
						{/if}
					</h2>
					<span class="flex text-xs">
						<span class="mr-0.5 font-bold capitalize">{child?.type || 'content'}</span> 
						posted by {getAuthor(child)} • 
						{child?.published_at ? formatRelativeDate(child.published_at) : 'Unknown date'}
					</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-gray-500 italic mb-4">This collection is empty</p>
	{/if}
	<Button href="/{type}/{slug}" tertiary fullWidth>Open collection</Button>
</div>
