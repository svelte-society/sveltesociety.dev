<script lang="ts">
	import components from './components.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectData } from '$utils/injectData';
</script>

<SearchableJson
	data={injectData(components)}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
