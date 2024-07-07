import { tagService } from '$lib/server/db/services/tags';

import { fail } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    const result = await tagService.get_content_by_tag_slug(params.id);

    console.log(result)

    if (!result.success) {
        fail(400, { message: 'Error getting roles' });
    }

    return {
        tag: result.data
    }
})