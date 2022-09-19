<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import components from './cultproposals.json';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Select from '$lib/components/Select.svelte';
	import SearchLayout from '$lib/layouts/SearchLayout.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let searchValue;

	const tagItems = extractUnique(components, 'tags');
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
		Sapper: 'sapper',
		Svelte: 'svelte',
		'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};
</script>

<Seo title="cultproposals" />
<div class="text-center">
	<h2>CULT Protocol Proposals</h2>
	<p><br /></p>
	Feel free to submit your own
	<a href="https://app.cultdao.io/submitProposal" target="_blank">CULT Protocol Proposal</a>.

	<p><br /></p>
	<embed
		src="https://dune.com/embeds/1280952/2194860/16501603-2aca-4a78-bb92-ddcd9ddedcb6"
		width="100%"
		height="1000"
	/>

	<p><br /></p>
	<embed
		src="https://dune.com/embeds/1280936/2194836/18828c7c-899f-487e-bc10-779fee1f1026"
		width="100%"
		height="200"
	/>

	<p><br /></p>

	<h3>Basic Tips for Newcomers</h3>
	<p><br /></p>

	In order to understand the utilites and the tokenomics you might want to read
	<a href="https://cultdao.io/manifesto.pdf" target="_blank"> the manifesto</a>.
</div>

<!-- <SearchLayout title="Cult Proposals">
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
</SearchLayout> -->
