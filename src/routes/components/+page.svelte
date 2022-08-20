<script>
	import { persist, localStorage } from '@macfja/svelte-persistent-store';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import components from './components.json';
	import List from '$components/ComponentIndex/CardList.svelte';
	import Select from '$components/Select.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';

	let searchValue;
	let selectedPackageManager = { value: 'npm' };
	let packageManager = writable('npm');
	let dataToDisplay = [];
	onMount(() => {
		packageManager = persist(writable('npm'), localStorage(), 'packageManager');
	});
	$: $packageManager = selectedPackageManager.value;
	$: categories = extractUnique(dataToDisplay, 'category');

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

<Seo title="Components" />

<SearchLayout title="Components">
	<section class="controls" slot="controls">
		<div class="inputs">
			<Search
				data={components}
				bind:query={searchValue}
				sortableFields={[
					{ identifier: 'addedOn', title: 'Last added first', ascending: false },
					{ identifier: 'addedOn', title: 'Oldest first', ascending: true },
					{ identifier: 'title', title: 'Name (A-Z)', ascending: true },
					{ identifier: 'title', title: 'Name (Z-A)', ascending: false },
					{ identifier: 'stars', title: 'Most star first', ascending: false }
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
				{#each dataToDisplay.filter((d) => d.category === category.value || (!categories
							.map((v) => v.value)
							.includes(d.category) && category.value === '')) as data}
					<ComponentCard {...data} manager={$packageManager} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout>
