<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import templates from './templates.json';
	import { selectSortItems } from '$lib/utils/sort';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Select from '$lib/components/Select.svelte';
	import SearchLayout from '$lib/layouts/SearchLayout.svelte';
	import { Operator, createSearch } from '$lib/stores/search';

	const tagItems = extractUnique(templates, 'tags');
	const categoryItems = [{ label: 'All', value: null }, ...extractUnique(templates, 'category')];
	const search = createSearch(templates);

	const categoryId = {
		Sapper: 'sapper',
		Svelte: 'svelte',
		'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};

	let searchValue;
	let selectedTags = null;
	let selectedCategory = null;
	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };

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

<SearchLayout title="Templates">
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

			<a href="/help/submitting?type=template" class="submit">Submit a template</a>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for templates..."
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
					<ComponentCard {...data} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
