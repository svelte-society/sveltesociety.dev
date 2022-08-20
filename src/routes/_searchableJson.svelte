<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '../lib/components/Select.svelte';
	import { localStorage, persist } from '@macfja/svelte-persistent-store';
	import { writable } from 'svelte/store';

	export let data;
	export let displayTitle = '';
	export let displayTitleSingular = '';
	export let submittingType = '';

	let selectedPackageManager = { value: 'npm' };
	const packageManager = persist(writable('npm'), localStorage(), 'packageManager');
	let searchValue;
	let dataToDisplay = [];

	$: $packageManager = selectedPackageManager.value;
	$: categories = extractUnique(dataToDisplay, 'category');

	export let categoryId = {};
</script>

<Seo title={displayTitle} />

<SearchLayout title={displayTitle}>
	<section slot="controls" class="controls">
		<div class="inputs">
			<Search
				{data}
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
			<Select
				label="Package manager"
				isClearable={false}
				showIndicator
				bind:value={selectedPackageManager}
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
