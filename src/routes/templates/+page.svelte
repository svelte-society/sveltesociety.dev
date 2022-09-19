<script>
	import templates from './templates.json';
	import SearchableJson from '../searchableJson.svelte';

	const categoryId = {
		Sapper: 'sapper',
		Svelte: 'svelte',
		'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};
</script>

<SearchableJson
	{categoryId}
	data={templates}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
