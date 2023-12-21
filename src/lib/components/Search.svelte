<script lang="ts">
	import type { Configuration } from 'itemsjs';
	import itemsjs from 'itemsjs';
	import { createEventDispatcher } from 'svelte';
	import Select from '$lib/components/Select.svelte';

	const dispatch = createEventDispatcher();

	type SortField = {
		identifier: string;
		title: string;
		ascending: boolean;
	};
	type FacetValue = { value: string } | Array<{ value: string }>;

	export let data;
	let sort = { value: 'stars_desc' };
	export let searchableFields: Array<string> = [];
	export let sortableFields: Array<SortField> = [];
	export let query = '';

	const configurations = {
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
			sort: sort.value
		});
		dispatch('search', results);
	}

	$: query, sort, search();

	function defaultEmpty(values: Array<string>, defaultValue = 'Unclassified'): Array<string> {
		return values.map((value) => value || defaultValue);
	}
	function revertDefaultValue(value: string, defaultValue = 'Unclassified'): string {
		return value === defaultValue ? '' : value;
	}
</script>

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
