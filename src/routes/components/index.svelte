<script>
	import { persist, localStorage } from '@macfja/svelte-persistent-store';
	import { writable } from 'svelte/store';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$components/ComponentIndex/CardList.svelte';
	import Button from '$components/ComponentIndex/ArrowButton.svelte';
	import components from './components.json';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Select from '$components/Select.svelte';
	import metatags from '$lib/stores/metatags';

	metatags.update({ title: 'Components' });

	let searchValue;
	const tagItems = extractUnique(components, 'tags');
	let filterTag = [];
	let selectedTags = null;
	const categoryItems = [
		{ label: 'All', value: null },
		...extractUnique(components, 'category').filter((cat) => cat.value !== '')
	];
	let selectedCategory = null;
	let filterCategory = null;
	let sorting = 'stars_desc';
	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };
	$: sorting = selectedSorting?.value || 'stars_desc';
	let packageManager = persist(writable('npm'), localStorage(), 'packageManager');
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
	$: categories = extractUnique(dataToDisplay, 'category');
	$: filterTag = selectedTags?.map((obj) => obj.value) || [];

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
			<Button small active={$packageManager !== ''}>
				{$packageManager.toUpperCase()}
				<ul slot="menu" role="menu" class="popin no-wrap">
					<li>
						<label><input type="radio" bind:group={$packageManager} value="npm" /> NPM</label>
					</li>
					<li>
						<label><input type="radio" bind:group={$packageManager} value="pnpm" /> PNPM</label>
					</li>
					<li>
						<label><input type="radio" bind:group={$packageManager} value="yarn" /> Yarn</label>
					</li>
				</ul>
			</Button>
		</div>

		<a href="/help/submitting?type=component" class="submit">Submit a component</a>
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
			<List
				title={category.label || 'Unclassified'}
				id={categoryId[category.label] || category.label || 'unclassified'}
			>
				{#each dataToDisplay.filter((d) => d.category === category.value) as data}
					<ComponentCard {...data} manager={$packageManager} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
