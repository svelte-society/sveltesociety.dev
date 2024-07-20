import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { contentService } from '$lib/server/db/services/content';

export const load = (async ({ url, locals }) => {
    const page = +(url.searchParams.get('page') || '1');
    const limit = 10;

    if (!locals?.user?.id) redirect(302, '/')

    try {
        const result = await contentService.get_user_saved_content(locals.user.id, limit, page - 1);

        return {
            content: result.data.items,
            pagination: {
                currentPage: page,
                totalPages: result.data.totalPages,
                totalItems: result.data.totalCount
            }
        };
    } catch (err) {
        console.error('Error fetching saved content:', err);
        throw error(500, 'An error occurred while fetching saved content');
    }
}) satisfies PageServerLoad;
