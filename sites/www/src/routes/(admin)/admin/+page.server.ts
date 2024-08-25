import { get_user_count } from '$lib/server/db/user';
import { get_content_count } from '$lib/server/db/content';
import { get_moderation_queue_count } from '$lib/server/db/moderation';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const users = get_user_count();
	const content = get_content_count();
	const moderation_queue = get_moderation_queue_count();

	return {
		users,
		content,
		moderation_queue
	};
}) satisfies PageServerLoad;
