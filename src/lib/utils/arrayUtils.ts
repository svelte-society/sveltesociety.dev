import dayjs from 'dayjs';

export const filterArray = <T>(arr: T[], filter: string): T[] => {
	if (!filter) {
		return arr;
	}
	// cast to string and lowercase to have non-dependant type and case search
	filter = String(filter).toLowerCase();
	return arr.filter((object) =>
		// get only values from iterated objects
		Object.values(object).some((objValue) => {
			// casting field values to the same shape
			return String(objValue).toLowerCase().includes(filter);
		})
	);
};

export const sortArray = <T>(arr: T[], filter: { value: string; asc: boolean }): T[] => {
	return arr.toSorted((a, b) => {
		if (filter.asc) {
			if (filter.value === 'date') {
				return dayjs(a[filter.value]) > dayjs(b[filter.value]) ? 1 : -1;
			} else {
				return a[filter.value] > b[filter.value] ? 1 : -1;
			}
		} else {
			if (filter.value === 'date') {
				return dayjs(a[filter.value]) < dayjs(b[filter.value]) ? 1 : -1;
			} else {
				return a[filter.value] < b[filter.value] ? 1 : -1;
			}
		}
	});
};
