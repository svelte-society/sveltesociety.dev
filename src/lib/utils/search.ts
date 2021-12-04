import { Operator } from '$lib/stores/search';
import type { Searchable, SearchableObject } from '$lib/stores/search';
import { derived, Readable } from 'svelte/store';

export type FilteredCategory = {
	label: string;
	value: string;
	items: Array<SearchableObject>;
};

type CategorizedSearchableObject = SearchableObject & { category: string };

export const configureSearch = (
	search: Searchable,
	tags: Array<string>,
	category: string | null,
	searchValue: string | null,
	sort: string
): void => {
	search.filter('tags', tags, Operator.or);
	search.filter('category', category, Operator.exact);
	search.filterGroup(['title', 'description'], searchValue, Operator.contains, Operator.or);
	search.sort(sort.substring(0, sort.indexOf('_')), sort.endsWith('asc'));
};

export const groupedByCategory = (search: Searchable): Readable<Array<FilteredCategory>> =>
	derived([search], ([$search]) => {
		return Object.values(
			$search.reduce<Record<string, FilteredCategory>>(
				(grouped: Record<string, FilteredCategory>, item: CategorizedSearchableObject) => {
					if (!Object.keys(grouped).includes(item.category)) {
						grouped[item.category] = { label: item.category, value: item.category, items: [] };
					}
					grouped[item.category].items.push(item);
					return grouped;
				},
				{}
			)
		).sort((a: FilteredCategory, b: FilteredCategory) => a.value.localeCompare(b.value));
	});
