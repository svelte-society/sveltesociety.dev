export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replaceAll(/[^0-9a-z_-]+/g, '-') // Replace unknown chars
		.replaceAll(/(^-+)|(-+$)/g, ''); // Trim '-' at start and end
}
