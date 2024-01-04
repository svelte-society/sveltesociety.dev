export const getCategories = (input) => {
	const output: string[] = [];
	input.forEach((item) => {
		item.categories.forEach((category) => {
			if (!output.includes(category)) {
				output.push(category);
			}
		});
	});
	return output.toSorted();
};
