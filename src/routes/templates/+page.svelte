<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import templates from './templates.json';
	import { extractUnique } from '$lib/utils/extractUnique';
	import SearchLayout from '$lib/layouts/SearchLayout.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';

	let searchValue;
	let dataToDisplay = [];
	$: categories = extractUnique(dataToDisplay, 'category');

	const categoryId = {
		Sapper: 'sapper',
		Svelte: 'svelte',
		'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};
</script>

<Seo title="Templates" />

<SearchLayout title="Templates">
	<section class="controls" slot="controls">
		<div class="inputs">
			<Search
				data={templates}
				bind:query={searchValue}
				sortableFields={{ addedOn: 'Added date', tile: 'Title', stars: 'Stars' }}
				searchableFields={['title', 'description']}
				facetsConfig={[
					{
						title: 'Category',
						identifier: 'category',
						isClearable: true,
						showIndicator: true
					},
					{
						title: 'Tags',
						identifier: 'tags',
						isMulti: true
					}
				]}
				on:search={(a) => (dataToDisplay = a.detail.data.items)}
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
