<script>
	import SearchableJson from '$lib/SearchableJson.svelte';

	export let data;
</script>

<SearchableJson
	data={data.components}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
