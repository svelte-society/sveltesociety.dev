<script lang="ts">
	import SearchableJson from '$lib/SearchableJson.svelte';

	export let data;
</script>

<SearchableJson
	data={data.packages}
	categories={data.categories}
	selectedCategories={data.selectedCategories}
	sortableFields={[
		{ value: 'stars', label: 'Stars', asc: false },
		{ value: 'title', label: 'Name', asc: true },
		{ value: 'date', label: 'Date', asc: false }
	]}
	displayTitle="Packages"
	displayTitleSingular="package"
	submittingType="package"
/>
