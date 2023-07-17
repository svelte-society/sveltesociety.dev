<script>
	import SearchableJson from '$lib/SearchableJson.svelte';
	import tools from './tools.json';
	import { entrySchema } from '$lib/schema';

	const data = entrySchema.parse(tools);
</script>

<SearchableJson {data} displayTitle="Tools" displayTitleSingular="tool" submittingType="tool" />
