const c = (a) => (e, s) => {
		switch (a) {
			case 'added_desc':
				return new Date(s.addedOn || '').getTime() - new Date(e.addedOn || '').getTime();
			case 'added_asc':
				return new Date(e.addedOn || '').getTime() - new Date(s.addedOn || '').getTime();
			case 'name_asc':
				return e.title.toLowerCase().localeCompare(s.title.toLowerCase());
			case 'name_desc':
				return s.title.toLowerCase().localeCompare(e.title.toLowerCase());
			case 'stars_desc':
				return (s.stars || 0) - (e.stars || 0);
			case 'stars_asc':
				return (e.stars || 0) - (s.stars || 0);
		}
	},
	t = {
		added_desc: 'Added Desc',
		added_asc: 'Added Asc',
		name_asc: 'Name Asc',
		name_desc: 'Name Desc',
		stars_desc: 'Stars Desc',
		stars_asc: 'Stars Asc'
	},
	d = Object.entries(t).map(([a, e]) => ({ label: e, value: a }));
export { c, d as s };
