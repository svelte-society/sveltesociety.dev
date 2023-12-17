<script>
	import templates from './templates.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectStars } from '$utils/stars';
</script>

<SearchableJson
	data={injectStars(templates)}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
