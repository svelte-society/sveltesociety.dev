<script>
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$components/ComponentIndex/CardList.svelte';
	import Button from '$components/ComponentIndex/ArrowButton.svelte';
	import components from './components.json';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import Select from '$components/Select.svelte';
	let searchValue;
	const tags = Array.from(new Set(components.map((item) => item.tags).flat()));
	const tagItems = tags.map((t) => ({ label: t, value: t }));
	let filterTag = [];
	let selectedTags = null;
	const allCategories = Array.from(new Set(components.map((item) => item.category).flat()));
	const categoryItems = [
		{ label: 'All', value: null },
		...allCategories.filter((cat) => cat !== '').map((cat) => ({ label: cat, value: cat }))
	];
	let selectedCategory = null;
	let filterCategory = null;
	let sorting = 'stars_desc';
	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };
	$: sorting = selectedSorting?.value || 'stars_desc';
	let packageManager = 'npm';
	const intersection = (array1, array2) => {
		return array1.filter((item) => array2.includes(item));
	};
	$: filterCategory = selectedCategory?.value || null;
	$: dataToDisplay = components
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
	<title>Components - Svelte Society</title>
</svelte:head>

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
			<Button small active={packageManager !== ''}>
				Package Manager
				<ul slot="menu" role="menu" class="popin no-wrap">
					<li><label><input type="radio" bind:group={packageManager} value="npm" /> NPM</label></li>
					<li>
						<label><input type="radio" bind:group={packageManager} value="pnpm" /> PNPM</label>
					</li>
					<li>
						<label><input type="radio" bind:group={packageManager} value="yarn" /> Yarn</label>
					</li>
				</ul>
			</Button>
		</div>
    
		<a href="/help/components" class="submit">Submit a component</a>
		<input
			class="searchbar"
			type="text"
			placeholder="Search for components..."
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
					<ComponentCard {...data} manager={packageManager} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
