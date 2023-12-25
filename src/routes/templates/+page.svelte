<script lang="ts">
	import SearchableJson from '$lib/SearchableJson.svelte';

	export let data;
</script>

<SearchableJson
	data={data.templates}
	tags={data.tags}
	selectedTags={data.selectedTags}
	sortableFields={[
		{ value: 'stars', label: 'Stars', asc: false },
		{ value: 'title', label: 'Name', asc: true }
	]}
	displayTitle="Templates"
	displayTitleSingular="template"
	submittingType="template"
/>
