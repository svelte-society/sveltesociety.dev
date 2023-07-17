<script>
	import SearchableJson from '$lib/SearchableJson.svelte';
	import templates from './templates.json';
	import { entrySchema } from '$lib/schema';

	const data = entrySchema.parse(templates);
</script>

<SearchableJson
	{data}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
