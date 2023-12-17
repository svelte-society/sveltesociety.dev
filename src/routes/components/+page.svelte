<script lang="ts">
	import components from './components.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectNpmData } from '$utils/injectNpmData';
	import { injectStars } from '$utils/stars';
</script>

<SearchableJson
	data={injectNpmData(injectStars(components))}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
