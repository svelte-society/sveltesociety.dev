<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Schema from '$lib/ui/Schema.svelte'
	let { data } = $props()
</script>

{#if data.schemas}
	<Schema schema={data.schemas} />
{/if}

<ContentCard content={data.content} variant="detail" />
