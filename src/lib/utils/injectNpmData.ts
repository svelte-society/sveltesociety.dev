import npm from '$lib/npm.json';
import type { z } from 'zod';
import type { componentsSchema } from '$lib/schemas';

export const injectNpmData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const extra = npm[item.npm];
		if (extra) {
			output.push({ ...item, ...extra });
		} else {
			output.push(item);
		}
	}
	return output;
};
