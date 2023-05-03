<script lang="ts">
	import templates from './templates.json';
	import SearchableJson from '../searchableJson.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const categoryId = {
		Sapper: 'sapper',
		Svelte: 'svelte',
		'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};
</script>

<SearchableJson
	{categoryId}
	data={[...templates, ...data.templates]}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
