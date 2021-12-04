<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import tools from './tools.json';
	import Select from '$lib/components/Select.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import { selectSortItems } from '$lib/utils/sort';
	import { createSearch } from '$lib/stores/search';
	import { configureSearch, groupedByCategory } from '$lib/utils/search';

	const tagItems = extractUnique(tools, 'tags');
	const categoryItems = [{ label: 'All', value: null }, ...extractUnique(tools, 'category')];
	const search = createSearch(tools);

	const categoryId = {
		'Bundler Plugins': 'bundling',
		Debugging: 'debugging',
		'Editor Extensions': 'editor-support',
		'Linting and Formatting': 'code-quality',
		Preprocessors: 'preprocessors'
	};

	let searchValue;
	let selectedTags = null;
	let selectedCategory = null;
	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };

	$: configureSearch(
		search,
		selectedTags?.map((obj) => obj.value) ?? [],
		selectedCategory?.value,
		searchValue ?? '',
		selectedSorting.value
	);

	const categories = groupedByCategory(search);
</script>

<SearchLayout title="Tools">
	<section slot="controls" class="controls">
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
			<a href="/help/submitting?type=tool" class="submit">Submit a tool</a>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for tools..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{$search.length} result{#if $search.length !== 1}s{/if}</span
		>
	</section>
	<section slot="items">
		{#each $categories as category (category.value)}
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
