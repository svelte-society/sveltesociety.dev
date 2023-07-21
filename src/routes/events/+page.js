import { error } from '@sveltejs/kit';
import { getPages } from '$lib/pageList';

/** @type {import('./$types').PageLoad} */
export const load = async () => {
	const events = await getPages(import.meta.glob('./**/*.svx'));

	if (events) {
		events.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

		return {
			events
		};
	}
	throw error(500);
};