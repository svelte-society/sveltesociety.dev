<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();
</script>

<ContentCard {...data.content} extra={data.extra} />

AuthorCard goes here
