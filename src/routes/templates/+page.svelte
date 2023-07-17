<script>
	import templates from './templates.json';
	import SearchableJson from '$lib/searchableJson.svelte';
</script>

<SearchableJson
	data={templates}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
