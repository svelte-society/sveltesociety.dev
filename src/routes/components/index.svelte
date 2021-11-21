<script>
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$components/ComponentIndex/CardList.svelte';
	import components from './components.json';
	import { selectSortItems } from '$lib/utils/sort';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Select from '$components/Select.svelte';
	import { Operator, createSearch } from '$lib/stores/search';
	import { packageManager, availablePackageManager } from '$lib/stores/userConfig';

	const tagItems = extractUnique(components, 'tags');
	const categoryItems = [
		{ label: 'All', value: null },
		...extractUnique(components, 'category').filter((cat) => cat.value !== '')
	];

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

	let searchValue;
	let selectedTags = null;
	let selectedCategory = null;
	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };

	const search = createSearch(components);

	$: search.filter(
		'tags',
		selectedTags?.map((obj) => obj.value),
		Operator.or
	);
	$: search.filter('category', selectedCategory?.value, Operator.exact);
	$: search.filterGroup(
		['title', 'description'],
		searchValue || '',
		Operator.contains,
		Operator.or
	);
	$: search.sort(
		selectedSorting.value.substring(0, selectedSorting.value.indexOf('_')),
		selectedSorting.value.endsWith('asc')
	);

	$: categories = Object.values(
		$search.reduce((grouped, item) => {
			if (!Object.keys(grouped).includes(item.category)) {
				grouped[item.category] = { label: item.category, value: item.category, items: [] };
			}
			grouped[item.category].items.push(item);
			return grouped;
		}, {})
	).sort((a, b) => a.value.localeCompare(b.value));
</script>

<SearchLayout title="Components">
	<section class="controls" slot="controls">
		<div class="inputs">
			<Select bind:value={selectedTags} items={tagItems} isMulti label="Tags" />
			<Select
				label="Category"
				bind:value={selectedCategory}
				items={categoryItems}
				placeholder="Category"
				isClearable={false}
				showIndicator
			/>
			<Select
				items={selectSortItems}
				bind:value={selectedSorting}
				label="Sorting"
				showIndicator
				isClearable={false}
			/>
			<Select
				items={availablePackageManager}
				bind:valueValue={$packageManager}
				label="Package Manager"
				showIndicator
				isClearable={false}
			/>
		</div>

		<a href="/help/submitting?type=component" class="submit">Submit a component</a>
		<input
			class="searchbar"
			type="text"
			placeholder="Search for components..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{$search.length} result{#if $search.length !== 1}s{/if}</span
		>
	</section>
	<section slot="items">
		{#each categories as category}
			<List
				title={category.label || 'Unclassified'}
				id={categoryId[category.label] || category.label || 'unclassified'}
			>
				{#each category.items as data}
					<ComponentCard {...data} manager={$packageManager} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
