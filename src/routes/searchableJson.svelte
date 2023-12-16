<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '../lib/components/Select.svelte';
	import { packageManager } from '$stores/packageManager';

	export let data;
	export let displayTitle = '';
	export let displayTitleSingular = '';
	export let submittingType = '';

	let searchValue;

	const dataDefault = { category: '' };
	$: dataToDisplay = data.map((line) => ({ ...dataDefault, ...line }));

	$: categories = extractUnique(dataToDisplay, 'category');

	export let categoryId = {};
</script>

<Seo title={displayTitle} />

<SearchLayout title={displayTitle}>
	<section slot="controls" class="controls">
		<div class="inputs">
			<Search
				data={dataToDisplay}
				bind:query={searchValue}
				sortableFields={[
					{ identifier: 'stars', title: 'Stars', ascending: false },
					{ identifier: 'title', title: 'Name', ascending: true }
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
			<Select
				label="Package manager"
				isClearable={false}
				isSearchable={false}
				showIndicator
				value={{ value: $packageManager }}
				on:select={({ detail }) => ($packageManager = detail.value)}
				items={[
					{ label: 'NPM', value: 'npm' },
					{ label: 'PNPM', value: 'pnpm' },
					{ label: 'Yarn', value: 'yarn' }
				]}
			/>
			<a href="/help/submitting?type={submittingType}" class="submit"
				>Submit a {displayTitleSingular}</a
			>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for {displayTitle.toLowerCase()}..."
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
							.includes(d.category) && category.value === '')) as cardData}
					<ComponentCard {...cardData} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
