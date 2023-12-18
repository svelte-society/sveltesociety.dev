<script lang="ts">
	import templates from './templates.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectData } from '$utils/injectData';
</script>

<SearchableJson
	data={injectData(templates)}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
