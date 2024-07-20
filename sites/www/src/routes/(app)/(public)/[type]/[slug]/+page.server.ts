import { contentService } from '$lib/server/db/services/content';
import { fail } from '@sveltejs/kit';

export const load = async ({ url, fetch, locals, params }) => {
    const result = await contentService.get_content_by_slug(params.slug, locals?.user?.id);

    if (!result.success) {
        fail(400, { message: 'Error getting content' });
    }


    return { content: result?.data };

};