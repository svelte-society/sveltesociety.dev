<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	let { data } = $props()
</script>

<ContentCard content={data.content} />

AuthorCard goes here
