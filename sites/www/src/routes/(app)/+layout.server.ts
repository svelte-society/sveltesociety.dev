import { tagService } from '$lib/server/db/services/tags';

import { fail } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    const result = await tagService.get_tags_ordered_by_content_count()

    if (!result.success) {
        fail(400, { message: 'Error getting roles' });
    }

    return {
        tags: result.data,
        logged_in: locals.user ? true : false
    }
})