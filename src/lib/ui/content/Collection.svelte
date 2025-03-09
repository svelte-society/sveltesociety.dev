<script lang="ts">
import type { Content } from '$lib/server/db/content'
import Button from '$lib/ui/Button.svelte'

// Extended Content type with optional author
interface ExtendedContent extends Content {
	author?: string;
}

interface Props {
	child_content: ExtendedContent[]
	slug: string
	type: string
}

let { slug, type, child_content = [] }: Props = $props()

// Add default author for content items that don't have one
function getAuthor(content: ExtendedContent): string {
	return content.author || 'Anonymous';
}
</script>

<ul class="mb-4 flex flex-col gap-1.5">
	{#each child_content as child}
		<li class="border border-slate-200 bg-slate-100 px-2.5 py-1.5">
			<h2 class="text-md font-bold"><a href="/{child?.type}/{child?.slug}">{child?.title}</a></h2>
			<span class="flex text-xs"
				><span class="mr-0.5 font-bold capitalize">{child?.type}</span> posted by {getAuthor(child)} • {child?.published_at}</span
			>
		</li>
	{/each}
</ul>
<Button href="/{type}/{slug}" tertiary fullWidth>Open collection</Button>
