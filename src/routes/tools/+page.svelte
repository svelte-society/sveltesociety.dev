<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import tools from '../tools/tools.json';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';

	let searchValue;
	let dataToDisplay = [];

	$: categories = extractUnique(dataToDisplay, 'category');

	const categoryId = {
		'Bundler Plugins': 'bundling',
		Debugging: 'debugging',
		'Editor Extensions': 'editor-support',
		'Linting and Formatting': 'code-quality',
		Preprocessors: 'preprocessors'
	};
</script>

<Seo title="Tools" />

<SearchLayout title="Tools">
	<section slot="controls" class="controls">
		<div class="inputs">
			<Search
				data={tools}
				dataDefault={{ category: '' }}
				bind:query={searchValue}
				sortableFields={[
					{ identifier: 'addedOn', title: 'Last added first', ascending: false },
					{ identifier: 'addedOn', title: 'Oldest first', ascending: true },
					{ identifier: 'title', title: 'Name (A-Z)', ascending: true },
					{ identifier: 'title', title: 'Name (Z-A)', ascending: false },
					{ identifier: 'stars', title: 'Most stars first', ascending: false }
				]}
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
			<a href="/help/submitting?type=tool" class="submit">Submit a tool</a>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for tools..."
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
				{#each dataToDisplay.filter((d) => d.category === category.value || (!categories
							.map((v) => v.value)
							.includes(d.category) && category.value === '')) as data}
					<ComponentCard {...data} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
