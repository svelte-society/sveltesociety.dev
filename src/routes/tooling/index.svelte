<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import tools from './tools.json';
	import Select from '$lib/components/Select.svelte';
	import { compare, selectSortItems } from '$lib/utils/sort';

	let searchValue;

	const tags = Array.from(new Set(tools.map((item) => item.tags).flat()));
	const tagItems = tags.map((t) => ({ label: t, value: t }));
	let filterTag = [];
	let selectedTags = null;

	const allCategories = Array.from(new Set(tools.map((item) => item.category).flat()));
	const categoryItems = [
		{ label: 'all', value: null },
		...allCategories.map((cat) => ({ label: cat, value: cat }))
	];
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

	$: categories = Array.from(new Set(dataToDisplay.map((item) => item.category)));
	$: filterTag = selectedTags?.map((obj) => obj.value) || [];
</script>

<svelte:head>
	<title>Tooling - Svelte Society</title>
</svelte:head>

<SearchLayout title="Tooling">
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
			<a href="/help/components" class="submit">Submit a tool</a>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for templates..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{dataToDisplay.length} result{#if dataToDisplay.length !== 1}s{/if}</span
		>
	</section>
	<section slot="items">
		{#each categories as category}
			<List title={category || 'Unclassified'}>
				{#each dataToDisplay.filter((d) => d.category === category) as data}
					<ComponentCard {...data} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
