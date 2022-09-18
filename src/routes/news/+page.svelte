<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import tools from './tools.json';
	import Select from '$lib/components/Select.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import components from '../cultproposals/cultproposals.json';
	import Seo from '$lib/components/Seo.svelte';

	let searchValue;

	const tagItems = extractUnique(tools, 'tags');
	let filterTag = [];
	let selectedTags = null;

	const categoryItems = [{ label: 'All', value: null }, ...extractUnique(components, 'category')];
	let selectedCategory = null;
	let filterCategory = null;

	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };
	$: sorting = selectedSorting?.value || 'stars_desc';

	const intersection = (array1, array2) => {
		return array1.filter((item) => array2.includes(item));
	};

	$: dataToDisplay = tools
		.filter((component) => {
			if (!searchValue && filterTag.length === 0 && filterCategory === null) return true;

			if (
				(searchValue &&
					!(
						component.title.toLowerCase().includes(searchValue.toLowerCase()) ||
						component.description.toLowerCase().includes(searchValue.toLowerCase())
					)) ||
				(filterTag.length > 0 && intersection(filterTag, component.tags).length === 0) ||
				(filterCategory !== null && component.category !== filterCategory)
			) {
				return false;
			}

			return true;
		})
		.sort(compare(sorting));

	$: categories = extractUnique(dataToDisplay, 'category');
	$: filterTag = selectedTags?.map((obj) => obj.value) || [];

	const categoryId = {
		'Bundler Plugins': 'bundling',
		Debugging: 'debugging',
		'Editor Extensions': 'editor-support',
		'Linting and Formatting': 'code-quality',
		Preprocessors: 'preprocessors'
	};
</script>

<Seo title="CULT News" />

<h1>CULT News</h1>

<p><br /></p>

Under construction - everyone is invited to add CULT news via pull request.

<p><br /></p>
The following is just to get some design- / layout ideas

<p><br /></p>

<SearchLayout title="CULT News">
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
			<a href="/help/submitting?type=tool" class="submit">Submit a material collection</a>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for cultproposals..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{dataToDisplay.length} result{#if dataToDisplay.length !== 1}s{/if}</span
		>
	</section>
	<section slot="items">
		{#each categories as category}
			<List
				title={category.label || 'Unclassified'}
				id={categoryId[category.label] || category.label || 'unclassified'}
			>
				{#each dataToDisplay.filter((d) => d.category === category.value) as data}
					<ComponentCard {...data} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
