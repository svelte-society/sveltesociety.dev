import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export enum Operator {
	and,
	or,
	contains,
	exact
}

type filter = {
	field: string;
	value: string | Array<string>;
	operator: Operator;
};
type filterGroup = {
	fields: Array<string>;
	value: string | Array<string>;
	operator: Operator;
	groupOperator: Operator;
};
export type SearchableObject = {
	[key: string]: unknown;
};

const intersection = (array1, array2) => {
	return array1.filter((item) => array2.includes(item));
};

const filterObject = (object: SearchableObject, filter: filter, defaultValue = true) => {
	const filterValue = filter.value;
	const itemValue = object[filter.field];

	if (
		filter.operator === Operator.contains &&
		typeof filterValue === 'string' &&
		filterValue.trim() !== ''
	) {
		return (itemValue as string).toLowerCase().includes(filterValue.toLowerCase().trim());
	}
	if (
		filter.operator === Operator.exact &&
		typeof filterValue === 'string' &&
		filterValue.trim() !== ''
	) {
		return itemValue === filterValue.trim();
	}
	if (filter.operator === Operator.and && Array.isArray(filterValue) && filterValue.length > 0) {
		if (!Array.isArray(itemValue) || itemValue.length === 0) {
			return false;
		}
		return intersection(filterValue, itemValue).length === filterValue.length;
	}
	if (filter.operator === Operator.or && Array.isArray(filterValue) && filterValue.length > 0) {
		if (!Array.isArray(itemValue) || itemValue.length === 0) {
			return false;
		}
		return intersection(filterValue, itemValue).length > 0;
	}

	return defaultValue;
};

export interface Searchable extends Readable<Array<SearchableObject>> {
	filter(field: string, value, operator: Operator);
	filterGroup(fields: Array<string>, value, operator: Operator, groupOperator: Operator);
	sort(field: string, ascending: boolean);
	resetFilters();
}

export const createSearch = (data: Array<SearchableObject>): Searchable => {
	const sourceData = data;
	let filters: Record<string, filter> = {};
	let filterGroups: Record<string, filterGroup> = {};
	let order = { field: 'name', ascending: true };
	let updateStore;

	const resetFilters = () => {
		filters = {};
		filterGroups = {};
		update();
	};
	const filter = (field: string, value, operator: Operator = Operator.contains) => {
		filters[field] = { field, value, operator };
		update();
	};
	const filterGroup = (
		fields: Array<string>,
		value,
		operator: Operator = Operator.contains,
		groupOperator: Operator = Operator.or
	) => {
		const key = fields.sort().join('-');
		filterGroups[key] = { fields, value, operator, groupOperator };
		update();
	};
	const sort = (field: string, ascending = true) => {
		order = { field, ascending };
		update();
	};

	const searchResult = readable([], (set) => {
		updateStore = set;
	});

	const update = () => {
		const filtered = sourceData
			.filter((item) => {
				return Object.values(filters).every((filter) => filterObject(item, filter, true));
			})
			.filter((item) => {
				return Object.values(filterGroups).every((filter) => {
					if (filter.groupOperator === Operator.and) {
						return filter.fields.every((field) =>
							filterObject(item, { field, value: filter.value, operator: filter.operator })
						);
					}
					return filter.fields.some((field) =>
						filterObject(item, { field, value: filter.value, operator: filter.operator })
					);
				});
			})
			.sort((itemA, itemB) => {
				const firstValue = order.ascending ? itemA[order.field] : itemB[order.field];
				const secondValue = order.ascending ? itemB[order.field] : itemA[order.field];

				if (firstValue === undefined && secondValue === undefined) {
					return 0;
				}

				const firstValueAsDate = Date.parse(firstValue as string);
				const secondValueAsDate = Date.parse(secondValue as string);

				const isDate =
					typeof firstValue === 'string' &&
					typeof secondValue === 'string' &&
					!isNaN(firstValueAsDate) &&
					!isNaN(secondValueAsDate);

				if (isDate) {
					return (firstValueAsDate || 0) - (secondValueAsDate || 0);
				}
				if (typeof firstValue === 'number' || typeof secondValue === 'number') {
					return (parseInt(firstValue as string) || 0) - (parseInt(secondValue as string) || 0);
				}

				return (firstValue as string)
					.toLowerCase()
					.localeCompare((secondValue as string).toLowerCase());
			});

		updateStore(filtered);
	};

	return {
		...searchResult,
		filter,
		filterGroup,
		sort,
		resetFilters
	};
};
