<script lang="ts">
	import components from './components.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectStars } from '$utils/stars';
</script>

<SearchableJson
	data={injectStars(components)}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
