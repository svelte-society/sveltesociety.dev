<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import Button from '$lib/components/ComponentIndex/ArrowButton.svelte';
	import components from './templates.json';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import Select from '$lib/components/Select.svelte';

	let searchValue;

	const tags = Array.from(new Set(components.map((item) => item.tags).flat()));
	const tagItems = tags.map((t) => ({ label: t, value: t }));
	let filterTag = [];
	let selectedTags = null;

	const allCategories = Array.from(new Set(components.map((item) => item.category).flat()));
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
	<title>Templates - Svelte Society</title>
</svelte:head>

<main class="wrapper">
	<h1>Templates</h1>
	<div class="controls">
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

			<Button on:click={() => (location.href = '/help/components')}>Submit a template</Button>
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
	</div>
	<hr />
	{#each categories as category}
		<List title={category || 'Unclassified'}>
			{#each dataToDisplay.filter((d) => d.category === category) as data}
				<ComponentCard {...data} />
			{/each}
		</List>
	{/each}
</main>

<style>
	h1 {
		@apply text-5xl;
	}

	hr {
		margin-block: 4rem;
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: Overpass;
		position: relative;
	}

	.inputs {
		display: grid;
		grid-template-columns: repeat(4, auto);
		grid-gap: 0.5rem;
		margin-right: 2rem;
		padding-top: 1rem;
	}

	.searchbar {
		height: 100%;
		width: 35%;
		font-family: Overpass;
		border-width: 0;
		background: #f3f6f9 url(/images/search-icon.svg) 98% no-repeat;
		margin: 0;
		padding: 10px 15px;
	}

	.searchbar-count {
		position: absolute;
		top: 100%;
		right: 0;
	}

	@media screen and (max-width: 1024px) {
		.controls {
			flex-flow: column-reverse;
		}
		.inputs {
			align-self: flex-start;
			width: 100%;
			grid-template-columns: repeat(3, auto);
		}

		.searchbar {
			align-self: flex-end;
			margin-bottom: 1ex;
		}
	}

	@media screen and (max-width: 700px) {
		.controls {
			align-items: stretch;
		}

		.inputs {
			grid-template-columns: auto;
		}

		.searchbar {
			width: auto;
			align-self: stretch;
		}

		:global(.select-container) {
			width: 100%;
		}
	}
</style>
