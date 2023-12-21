<script lang="ts">
	import SearchableJson from '$lib/SearchableJson.svelte';

	export let data;
</script>

<SearchableJson
	data={data.packages}
	displayTitle="Packages"
	displayTitleSingular="package"
	submittingType="package"
/>
