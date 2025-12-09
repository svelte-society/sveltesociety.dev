<script lang="ts">
	import type { ContentWithAuthor } from '$lib/types/content'
	import { formatRelativeDate } from '$lib/utils/date'
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut'

	type ContentChild = Omit<ContentWithAuthor, 'children'> & { children?: any[] }

	interface Props {
		children: ContentChild[]
	}

	let { children = [] }: Props = $props()

	function getAuthor(content: ContentChild): string {
		return content?.author_name || content?.author_username || 'Unknown'
	}

	function getExternalUrl(content: ContentChild): string | null {
		if (content.type === 'resource') {
			return content.metadata?.link || null
		}
		if (content.type === 'library') {
			return content.metadata?.packageUrl || content.metadata?.github || null
		}
		if (content.type === 'video') {
			return content.metadata?.watchUrl || null
		}
		return null
	}
</script>

<ul class="space-y-2">
	{#each children as child (child.id)}
		<li
			class="rounded border border-slate-200 bg-slate-100 px-3 py-1.5 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
		>
			<div class="flex items-center gap-2">
				<a
					href="/{child.type}/{child.slug}"
					class="text-svelte-800 hover:text-svelte-600 block min-w-0 flex-1"
				>
					<h2 class="text-svelte-800 hover:text-svelte-600 text-md block font-bold break-words">
						{child?.title || 'Untitled'}
					</h2>

					<div class="mb-1 flex text-xs text-gray-500">
						<span class="mr-0.5 font-semibold capitalize">{child?.type || 'content'}</span>
						submitted by {getAuthor(child)} •
						{child?.published_at ? formatRelativeDate(child.published_at) : 'Unknown date'}
					</div>
				</a>
				{#if getExternalUrl(child)}
					<a
						href={getExternalUrl(child)}
						target="_blank"
						rel="noopener noreferrer"
						title="Open external link"
						class="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
					>
						<ArrowSquareOut size={18} />
					</a>
				{/if}
			</div>
		</li>
	{/each}
</ul>
