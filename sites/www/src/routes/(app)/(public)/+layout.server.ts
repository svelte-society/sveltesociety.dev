import { get_tags } from '$lib/server/db/tags';

import { fail } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    const result = get_tags()

    if (!result) {
        fail(400, { message: 'Error getting roles' });
    }

    return {
        tags: result
    }
})