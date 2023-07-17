<script>
	import { components } from './data.js';
	import SearchableJson from '$lib/searchableJson.svelte';
</script>

<SearchableJson
	data={components}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
