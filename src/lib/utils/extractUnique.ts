export const extractUnique = (
	source: Array<Record<string, unknown>>,
	field: string
): Array<Record<'label' | 'value', unknown>> => {
	const extracted = Array.from(new Set(source.map((item) => item[field]).flat()));
	return extracted
		.filter((value) => !!value)
		.map((value) => ({ label: value, value }))
		.sort((a, b) => {
			if (typeof a.value === 'string' && typeof b.value === 'string') {
				return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
			}
			if (typeof a.value === 'number' && typeof b.value === 'number') {
				return a.value - b.value;
			}
			return 0;
		});
};
