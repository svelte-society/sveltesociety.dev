<script lang="ts">
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import CardList from '$lib/components/ComponentIndex/CardList.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '$lib/components/Select.svelte';
	import { packageManager } from '$stores/packageManager';
	import TagsFilter from '$lib/TagsFilter.svelte';

	export let data;
	export let tags;
	export let selectedTags;
	export let displayTitle = '';
	export let displayTitleSingular = '';
	export let submittingType = '';

	let searchValue;
</script>

<Seo title={displayTitle} />

<h1>{displayTitle}</h1>

<TagsFilter {tags} {selectedTags} />
<br />
<section class="controls">
	<div class="inputs">
		<Search
			{data}
			bind:query={searchValue}
			sortableFields={[
				{ identifier: 'stars', title: 'Stars', ascending: false },
				{ identifier: 'title', title: 'Name', ascending: true }
			]}
			searchableFields={['title', 'description']}
			on:search={(a) => (data = a.detail.data.items)}
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
		>{data.length} result{#if data.length !== 1}s{/if}</span
	>
</section>
<hr />
<section>
	<CardList title={'Unclassified'} id={'unclassified'}>
		{#each data as cardData}
			<ComponentCard {...cardData} />
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
		align-self: flex-end;
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

	@media (min-width: 1280px) {
		.controls {
			grid-template-columns: 2fr 1fr;
		}
		.inputs {
			grid-template-columns: repeat(4, auto);
		}
		.searchbar {
			grid-row: auto;
		}
	}
</style>
