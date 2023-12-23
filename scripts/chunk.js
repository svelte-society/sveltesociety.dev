/**
 * Divide an array into multiple smaller array
 * @template T
 * @param {Array<T>} input
 * @param {number} size
 * @return {Array<Array<T>>}
 */
export function chunk(input, size) {
	size = size < 1 ? 10 : size;
	const pages = Math.ceil(input.length / size);
	const final = [];
	for (let index = 0; index < pages; index++) {
		final.push(input.slice(index * size, (index + 1) * size));
	}
	return final;
}
