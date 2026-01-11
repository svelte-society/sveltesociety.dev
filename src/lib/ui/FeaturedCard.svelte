<script lang="ts">
	import ContentCard from './ContentCard.svelte'
	import type { ContentWithAuthor } from '$lib/types/content'

	let {
		content,
		priority = 'high'
	}: {
		content: ContentWithAuthor
		priority?: 'high' | 'auto'
	} = $props()
</script>

<!--
	FeaturedCard is a thin wrapper around ContentCard that displays the featured badge
	and uses the featured highlight styling. The data-testid wrapper preserves test compatibility.
-->
<div data-testid="featured-card">
	<ContentCard {content} {priority} showFeaturedBadge />
</div>
