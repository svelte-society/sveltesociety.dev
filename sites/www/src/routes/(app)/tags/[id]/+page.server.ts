import { tagService } from '$lib/server/db/services/tags';

import { fail, redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    const result = await tagService.get_content_by_tag_slug(params.id);

    if (!result.data.tag) {
        redirect(302, '/');
    }

    if (!result.success) {
        fail(400, { message: 'Error getting roles' });
    }

    return {
        tag: result.data.tag,
        content: result.data.content
    }
})