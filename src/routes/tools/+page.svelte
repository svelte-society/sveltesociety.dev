<script lang="ts">
	import tools from '../tools/tools.json';
	import SearchableJson from '../searchableJson.svelte';
	import { injectNpmData } from '$utils/injectNpmData';
	import { injectStars } from '$utils/stars';

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
	data={injectNpmData(injectStars(tools))}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
