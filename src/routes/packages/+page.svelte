<script lang="ts">
	import SearchableJson from '$lib/SearchableJson.svelte';

	export let data;
</script>

<SearchableJson
	data={data.packages}
	tags={data.tags}
	selectedTags={data.selectedTags}
	displayTitle="Packages"
	displayTitleSingular="package"
	submittingType="package"
/>
