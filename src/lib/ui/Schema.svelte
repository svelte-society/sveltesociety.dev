<script lang="ts">
	import type { Schema, SchemaArray } from '$lib/seo/schema'

	interface Props {
		schema: Schema | SchemaArray
	}

	let { schema }: Props = $props()

	// Convert schema to JSON string
	const schemaJson = $derived(JSON.stringify(schema, null, 0))
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>
