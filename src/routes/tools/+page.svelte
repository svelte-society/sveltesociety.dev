<script>
	import tools from '../tools/tools.json';
	import SearchableJson from '../searchableJson.svelte';

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
	data={tools}
	displayTitle="Tools"
	displayTitleSingular="tool"
	submittingType="tool"
/>
