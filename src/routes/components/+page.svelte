<script>
	import { components } from './components.js';
	import SearchableJson from '../searchableJson.svelte';
</script>

<SearchableJson
	data={components}
	displayTitle="Components"
	displayTitleSingular="component"
	submittingType="component"
/>
