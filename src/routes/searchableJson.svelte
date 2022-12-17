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
	<section slot="controls" class="searchable-grid">
		<div class="selects-grid">
			<Search
				data={dataToDisplay}
				bind:query={searchValue}
				sortableFields={[
					{ identifier: 'addedOn', title: 'Most recent', ascending: false },
					{ identifier: 'addedOn', title: 'Oldest', ascending: true },
					{ identifier: 'title', title: 'Name', ascending: true },
					{ identifier: 'stars', title: 'Stars', ascending: false }
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
		</div>

		<div class="searchbar-wrapper">
			<input
				class="searchbar"
				type="text"
				placeholder="Search for {displayTitle.toLowerCase()}..."
				bind:value={searchValue}
			/>
		</div>

		<div class="searchable-footer">
			<a href="/help/submitting?type={submittingType}" tabindex="0">
				Submit a {displayTitleSingular}
			</a>

			<p>
				{dataToDisplay.length} result{#if dataToDisplay.length !== 1}s{/if}
			</p>
		</div>
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

<style>
	.searchable-grid {
		display: grid;
		align-items: center;
		gap: var(--s-6);
		font-family: Overpass;
		position: relative;
	}

	.selects-grid {
		display: grid;
		gap: var(--s-5);
	}

	@media (min-width: 1280px) {
		.searchable-grid {
			gap: var(--s-8);
		}

		.selects-grid {
			gap: var(--s-6);
			grid-template-columns: 1.5fr 2.25fr 1fr 0.75fr;
		}
	}

	.searchbar-wrapper {
		height: 100%;
		width: 100%;
		grid-row: 1;
	}

	.searchbar {
		--icon-width: 18px;
		--siblings-label-margin: calc(1em / 3);
		--searchbar-height: calc(
			var(--input-label-size) + var(--siblings-label-margin) + var(--input-height)
		);
		height: var(--searchbar-height);
		font-size: var(--s-4);
		width: 100%;
		padding: var(--ff-optical-5) calc(var(--icon-width) + var(--s-4)) 0 var(--s-4);
		border: 2px solid var(--dark-gray);
		border-radius: 4px;
		font-family: Overpass;
		background: #f3f6f9 url(/images/search-icon.svg) 98% no-repeat;
	}

	.searchbar:focus {
		outline: none;
		border-color: var(--secondary);
	}

	.searchable-footer {
		display: flex;
		justify-content: space-between;
	}

	@media (max-width: 325px) {
		.searchable-footer {
			display: flex;
			flex-wrap: wrap;
			gap: var(--s-6);
		}
	}

	@media (min-width: 1280px) {
		.searchbar-wrapper {
			grid-row: unset;
		}

		.searchable-footer {
			margin-top: var(--s-3);
			grid-column: 1 / span 2;
			grid-row: 2;
		}

		.searchable-grid {
			gap: var(--s-6);
			grid-template-columns: 2fr 0.85fr;
		}
	}
</style>
