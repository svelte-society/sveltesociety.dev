<script>
	import tools from '../tools/tools.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
</script>

<SearchableJson
	data={tools}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
