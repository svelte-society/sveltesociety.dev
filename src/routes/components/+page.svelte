<script>
	import SearchableJson from '$lib/SearchableJson.svelte';
	import components from './components.json';
	import { entrySchema } from '$lib/schema';

	const data = entrySchema.parse(components);
</script>

<SearchableJson
	{data}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
