<script lang="ts">
	import tools from '../tools/tools.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectNpmData } from '$utils/injectData';
	import { injectStars } from '$utils/stars';
</script>

<SearchableJson
	data={injectNpmData(injectStars(tools))}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
