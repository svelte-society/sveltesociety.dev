<script lang="ts">
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import CardList from '$lib/components/ComponentIndex/CardList.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Select from '$lib/components/Select.svelte';
	import { packageManager } from '$stores/packageManager';
	import TagsFilter from '$lib/TagsFilter.svelte';
	import { filterArray, sortArray } from '$utils/arrayUtils';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any[];
	export let tags: string[];
	export let selectedTags: string[];
	export let displayTitle = '';
	export let displayTitleSingular = '';
	export let submittingType = '';

	const sortableFields = [
		{ value: 'stars', label: 'Stars', asc: false },
		{ value: 'title', label: 'Name', asc: true },
		{ value: 'date', label: 'Date', asc: false }
	];

	let searchValue: string;
	let sort = sortableFields[0];

	$: filteredData = filterArray(data, searchValue);
	$: sortedData = sortArray(filteredData, sort);
</script>

<Seo title={displayTitle} />

<h1>{displayTitle}</h1>

<TagsFilter {tags} {selectedTags} />
<br />
<section class="controls">
	<input
		class="searchbar"
		type="text"
		placeholder="Search for {displayTitle.toLowerCase()}..."
		bind:value={searchValue}
	/>
	<div class="inputs">
		<Select
			items={sortableFields}
			bind:value={sort}
			label="Sorting"
			showIndicator
			isClearable={false}
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
	<span class="searchbar-count"
		>{data.length} result{#if data.length !== 1}s{/if}</span
	>
</section>
<hr />
<section>
	<CardList>
		{#each sortedData as entry (entry.title)}
			<ComponentCard
				title={entry.title}
				description={entry.description}
				repository={entry.repository}
				stars={entry.stars}
				tags={entry.tags}
				date={entry.date}
				npm={entry.npm}
				version={entry.version}
			/>
		{/each}
	</CardList>
</section>

<style>
	.controls {
		display: grid;
		justify-content: stretch;
		align-items: center;
		gap: var(--s-4);
		font-family: Overpass;
		position: relative;
	}
	.inputs {
		display: grid;
		gap: var(--s-2);
	}
	.searchbar {
		padding: 20.5px var(--s-2);
		border: 2px solid var(--dark-gray);
		border-radius: 2px;
		grid-row: 1/2;
		font-family: Overpass;
		background: #f3f6f9 url(/images/search-icon.svg) 98% no-repeat;
		margin: 0;
	}
	.searchbar:focus {
		outline: none;
		border: 1px solid var(--secondary);
	}
	.searchbar-count {
		position: absolute;
		top: calc(100% + 1rem);
		right: 0;
	}

	@media (min-width: 1024px) {
		.inputs {
			grid-template-columns: repeat(2, auto);
		}
	}
</style>
