<script lang="ts">
	import SearchableJson from '$lib/SearchableJson.svelte';

	export let data;
</script>

<SearchableJson
	data={data.templates}
	tags={data.tags}
	selectedTags={data.selectedTags}
	displayTitle="Templates"
	displayTitleSingular="template"
	submittingType="template"
/>
