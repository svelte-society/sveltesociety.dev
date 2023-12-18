<script lang="ts">
	import tools from '../tools/tools.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectData } from '$utils/injectData';
</script>

<SearchableJson
	data={injectData(tools)}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
