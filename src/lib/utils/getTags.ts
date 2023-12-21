export const getTags = (input) => {
	const output = []
	input.forEach((item) => {
		item.tags.forEach((tag) => {
			if (!output.includes(tag)) {
				output.push(tag)
			}
		})
	})
	return output.toSorted()
}
