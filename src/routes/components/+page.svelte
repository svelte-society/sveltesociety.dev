<script>
	import components from './components.json';
	import SearchableJson from '../searchableJson.svelte';
	import { injectStars } from '$utils/stars';

	const categoryId = {
		Animations: 'animations',
		'Data Visualisation': 'data-vis',
		'Design Pattern': 'design-patterns',
		'Design System': 'design-systems',
		'Developer Experience': 'dx',
		'Forms & User Input': 'input',
		Integration: 'integrations',
		'Rich Text Editor': 'text-editors',
		Routers: 'routers',
		Stores: 'stores',
		'SvelteKit Adapters': 'adapters',
		Testing: 'testing',
		'User Interaction': 'ui'
	};
</script>

<SearchableJson
	{categoryId}
	data={injectStars(components)}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
