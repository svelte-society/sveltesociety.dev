<script lang="ts">
	import tools from '../tools/tools.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectStars } from '$utils/stars';
</script>

<SearchableJson
	data={injectStars(tools)}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
