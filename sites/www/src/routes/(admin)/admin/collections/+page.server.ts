import type { PageServerLoad } from './$types';
import { get_collections } from '$lib/server/db/collections';

export const load: PageServerLoad = async () => {
	return {
		collections: get_collections()
	};
};
