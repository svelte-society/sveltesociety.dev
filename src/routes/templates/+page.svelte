<script>
	import templates from './templates.json';
	import SearchableJson from '../searchableJson.svelte';
	import { injectStars } from '$utils/stars';

	const categoryId = {
		Sapper: 'sapper',
		Svelte: 'svelte',
		'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};
</script>

<SearchableJson
	{categoryId}
	data={injectStars(templates)}
	displayTitle="Template"
	displayTitleSingular="template"
	submittingType="template"
/>
