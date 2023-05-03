<script lang="ts">
	import tools from '../tools/tools.json';
	import SearchableJson from '../searchableJson.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const categoryId = {
		'Bundler Plugins': 'bundling',
		Debugging: 'debugging',
		'Editor Extensions': 'editor-support',
		'Linting and Formatting': 'code-quality',
		Preprocessors: 'preprocessors'
	};
</script>

<SearchableJson
	{categoryId}
	data={[...tools, ...data.tools]}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
