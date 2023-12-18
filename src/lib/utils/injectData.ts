import npm from '$lib/data/npm.json';
import publint from '$lib/data/publint.json';
import type { z } from 'zod';
import type { componentsSchema } from '$lib/schemas';

export const injectNpmData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const extra = npm[item.npm] ?? {};
		output.push({ ...item, ...extra });
	}
	return output;
};

export const injectPublintData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const extra = publint[item.npm] ?? false;
		output.push({ ...item, publint: extra });
	}
	return output;
};
