const o = (l, s) => {
	const _ = l.map((e) => {
		var t;
		return (t = e[s]) != null ? t : '';
	});
	return Array.from(new Set(_.flat()))
		.map((e) => ({ label: e, value: e }))
		.sort((e, t) =>
			typeof e.value == 'string' && typeof t.value == 'string'
				? e.value.toLowerCase().localeCompare(t.value.toLowerCase())
				: typeof e.value == 'number' && typeof t.value == 'number'
				? e.value - t.value
				: 0
		);
};
export { o as e };
