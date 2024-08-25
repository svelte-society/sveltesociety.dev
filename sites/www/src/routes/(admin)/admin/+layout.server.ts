import { get_moderation_queue_count_filtered } from '$lib/server/db/moderation';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const moderation_count = get_moderation_queue_count_filtered({ status: 'pending' });

	return {
		moderation_count
	};
};
