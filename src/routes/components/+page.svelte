<script>
	import components from './components.json';
	import SearchableJson from '../searchableJson.svelte';
</script>

<SearchableJson
	{categoryId}
	data={components}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
