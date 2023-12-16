<script lang="ts">
	import type { Configuration } from 'itemsjs';
	import itemsjs from 'itemsjs';
	import { createEventDispatcher } from 'svelte';
	import Select from '$lib/components/Select.svelte';

	const dispatch = createEventDispatcher();

	type Facet = {
		identifier: string;
		title: string;
		isMulti?: boolean;
	};
	type SortField = {
		identifier: string;
		title: string;
		ascending: boolean;
	};
	type FacetValue = { value: string } | Array<{ value: string }>;

	export let facetsConfig: Array<Facet> = [];
	export let data;
	let sort = { value: 'stars_desc' };
	export let searchableFields: Array<string> = [];
	export let sortableFields: Array<SortField> = [];
	export let query = '';

	let facets: Array<Facet & { value: FacetValue; values: Array<string> }> = facetsConfig.map(
		(facet) => ({ ...facet, values: [], value: undefined })
	);

	const configurations = {
		aggregations: facetsConfig.reduce(
			(object, line) => ({
				...object,
				[line.identifier]: { sort: ['key'], order: ['asc'], size: 1000, ...line }
			}),
			{}
		),
		sortings: sortableFields.reduce(
			(object, { identifier, ascending }) => ({
				...object,
				[`${identifier}_${ascending ? 'asc' : 'desc'}`]: {
					field: identifier,
					order: ascending ? 'asc' : 'desc'
				}
			}),
			{}
		),
		searchableFields
	};
	const searcher = itemsjs(data, configurations as Configuration<string, string, string>);

	export function search(): void {
		const results = searcher.search({
			per_page: 100000,
			query,
			filters: facets
				.filter((facet) => facet.value !== null && facet.value !== undefined)
				.reduce((object, facet) => {
					let filterValue;
					const facetValue = facet.value;
					if (Array.isArray(facetValue)) {
						filterValue = facetValue.map((value) => revertDefaultValue(value.value));
					} else {
						filterValue = [revertDefaultValue(facetValue.value)];
					}
					return {
						...object,
						[facet.identifier]: filterValue
					};
				}, {}),
			sort: sort.value
		});
		facets = facets.map((facet) => {
			let values = Object.values(results.data.aggregations)
				.find((value) => value.name === facet.identifier)
				.buckets.map((b) => b.key);
			return {
				...facet,
				values
			};
		});
		dispatch('search', results);
	}

	$: query, facets, sort, search();

	function defaultEmpty(values: Array<string>, defaultValue = 'Unclassified'): Array<string> {
		return values.map((value) => value || defaultValue);
	}
	function revertDefaultValue(value: string, defaultValue = 'Unclassified'): string {
		return value === defaultValue ? '' : value;
	}
</script>

{#each facets as facet (facet.identifier)}
	<Select
		{...facet}
		bind:value={facet.value}
		items={defaultEmpty(facet.values)}
		label={facet.title}
	/>
{/each}

<Select
	items={sortableFields.map(({ identifier, title, ascending }) => ({
		value: identifier + '_' + (ascending ? 'asc' : 'desc'),
		label: title
	}))}
	bind:value={sort}
	label="Sorting"
	showIndicator
	isClearable={false}
/>
