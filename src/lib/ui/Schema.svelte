<script lang="ts">
	import type { Schema, SchemaArray } from '$lib/seo/schema'

	interface Props {
		schema: Schema | SchemaArray
	}

	let { schema }: Props = $props()

	// Convert schema to JSON string and create safe HTML
	const schemaJson = $derived(JSON.stringify(schema, null, 0))
	const schemaHtml = $derived(`<script type="application/ld+json">${schemaJson}<` + `/script>`)
</script>

<svelte:head>
	{@html schemaHtml}
</svelte:head>
