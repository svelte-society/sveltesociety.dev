<script>
	import tools from '../tools/tools.json';
	import SearchableJson from '$lib/searchableJson.svelte';
</script>

<SearchableJson
	data={tools}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
