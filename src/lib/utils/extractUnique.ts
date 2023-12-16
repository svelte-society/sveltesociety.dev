export const extractUnique = (
	source: Array<Record<string, unknown>>,
	field: string
): Array<Record<'label' | 'value', unknown>> => {
	const extracted = source.map((item) => item[field] ?? '');
	const uniqued = Array.from(new Set(extracted.flat()));
	return uniqued
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
