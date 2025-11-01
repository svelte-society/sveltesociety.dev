<script lang="ts">
	import type { Content } from '$lib/types/content'

	let {
		content,
		fullDescription = false
	}: {
		content: Content
		fullDescription?: boolean
	} = $props()
</script>

{#if fullDescription}
	{#if content.rendered_body}
		<div class="prose prose-sm max-w-none text-gray-700">
			{@html content.rendered_body}
		</div>
	{:else if content.body}
		<div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
			{content.body}
		</div>
	{/if}
{/if}
