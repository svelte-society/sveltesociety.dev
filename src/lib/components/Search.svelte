<script lang="ts">
	import type { Configuration } from 'itemsjs';
	import itemsjs from 'itemsjs';
	import { createEventDispatcher } from 'svelte';
	import Select from '$lib/components/Select.svelte';

	const dispatch = createEventDispatcher();

	export type Facet = {
		identifier: string;
		title: string;
		isMulti?: boolean;
	};
	type FacetValue = { value: string } | Array<{ value: string }>;

	export let facetsConfig: Array<Facet> = [];
	export let data;
	let sort = { value: 'stars_desc' };
	export let searchableFields: Array<string> = [];
	export let sortableFields: Record<string, string> = {};
	export let query = '';

	let facets: Array<
		Facet & { value: FacetValue; values: Array<string> }
	> = facetsConfig.map((facet) => ({ ...facet, values: [], value: undefined }));

	const configurations = {
		aggregations: facetsConfig.reduce(
			(object, line) => ({
				...object,
				[line.identifier]: { sort: ['key'], order: ['asc'], size: 1000, ...line }
			}),
			{}
		),
		sortings: Object.keys(sortableFields).reduce(
			(object, line) => ({
				...object,
				[`${line}_asc`]: { field: line, order: 'asc' },
				[`${line}_desc`]: { field: line, order: 'desc' }
			}),
			{}
		),
		searchableFields
	};

	const searcher = itemsjs(data, configurations as Configuration<string, string, string>);

	export function search() {
		const results = searcher.search({
			per_page: 100000,
			query,
			filters: facets
				.filter((facet) => facet.value !== null && facet.value !== undefined)
				.reduce((object, facet) => {
					let filterValue;
					const facetValue = facet.value;
					if (Array.isArray(facetValue)) {
						filterValue = facetValue.map((value) => value.value);
					} else {
						filterValue = [facetValue.value];
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
</script>

{#each facets as facet (facet.identifier)}
	<Select {...facet} bind:value={facet.value} items={facet.values} label={facet.title} />
{/each}

<Select
	items={Object.entries(sortableFields).reduce(
		(fields, [field, label]) => [
			...fields,
			{ value: field + '_asc', label: label + ' ascending' },
			{ value: field + '_desc', label: label + ' descending' }
		],
		[]
	)}
	bind:value={sort}
	label="Sorting"
	showIndicator
	isClearable={false}
/>
