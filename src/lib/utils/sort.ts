type SortableEntity = {
	title: string;
	addedOn?: string;
	stars?: number;
};

export const compare = (sorting: string) => {
	return (sortableEntityA: SortableEntity, sortableEntityB: SortableEntity): number => {
		switch (sorting) {
			case 'added_desc':
				return (
					new Date(sortableEntityB.addedOn || '').getTime() -
					new Date(sortableEntityA.addedOn || '').getTime()
				);
			case 'added_asc':
				return (
					new Date(sortableEntityA.addedOn || '').getTime() -
					new Date(sortableEntityB.addedOn || '').getTime()
				);
			case 'name_asc':
				return sortableEntityA.title
					.toLowerCase()
					.localeCompare(sortableEntityB.title.toLowerCase());
			case 'name_desc':
				return sortableEntityB.title
					.toLowerCase()
					.localeCompare(sortableEntityA.title.toLowerCase());
			case 'stars_desc':
				return (sortableEntityB.stars || 0) - (sortableEntityA.stars || 0);
			case 'stars_asc':
				return (sortableEntityA.stars || 0) - (sortableEntityB.stars || 0);
		}
	};
};

export const sortMap = {
	added_desc: 'Added Desc',
	added_asc: 'Added Asc',
	name_asc: 'Name Asc',
	name_desc: 'Name Desc',
	stars_desc: 'Stars Desc',
	stars_asc: 'Stars Asc'
};

export const selectSortItems = Object.entries(sortMap).map(([value, label]) => ({ label, value }));
