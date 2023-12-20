<script lang="ts">
	import packages from './packages.json';
	import SearchableJson from '$lib/SearchableJson.svelte';
	import { injectData } from '$utils/injectData';
</script>

<SearchableJson
	data={injectData(packages)}
	displayTitle="Packages"
	displayTitleSingular="package"
	submittingType="package"
/>
