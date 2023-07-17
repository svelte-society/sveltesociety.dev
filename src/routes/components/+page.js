import components from './components.json';
import { entrySchema } from '$lib/schema';

/** @type {import('./$types').PageLoad} */
export const load = async () => {
	return { components: entrySchema.parse(components) };
};
