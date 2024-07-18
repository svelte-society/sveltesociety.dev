import type { PageServerLoad } from './$types';
import { contentService } from '$lib/server/db/services/content';
import { fail, error } from '@sveltejs/kit';
import { likeService } from '$lib/server/db/services/likes';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
    const searchQuery = new URL(url).searchParams.get('search');
    if (searchQuery) {
        const resp = await fetch(`/search/${searchQuery}`)
        const content = await resp.json()

        return {
            search_results: {
                content,
                count: content.length,
                query: searchQuery
            }
        }
    } else {
        const result = await contentService.get_content_items({
            user_id: locals?.user?.id
        });

        if (!result.success) {
            fail(400, { message: 'Error getting content' });
        }


        return { content: result?.data?.items, count: result?.data?.totalCount };
    }
};

export const actions = {
    toggle_like: async ({ request, locals }) => {
        if (!locals.user) {
            // User is not logged in, return silently
            return;
        }

        const data = await request.formData();
        const id = data.get('id');
        const type: 'like' | 'unlike' = data.get('type')

        if (!id || typeof id !== 'string') {
            return fail(400, { message: 'Invalid or missing id' });
        }

        try {

            if (type === 'like') {
                // Attempt to like the content
                const likeResult = await likeService.like(locals.user.id, id);

                if (!likeResult.success) {
                    throw new Error('Failed to process like action');
                }
            } else {
                const unlikeResult = await likeService.unlike(locals.user.id, id)
                if (!unlikeResult.success) {
                    throw new Error('Failed to process unlike action');
                }
            }
            // Return success without any specific action information
            return { success: true };
        } catch (err) {
            console.error('Error processing like:', err);
            throw error(500, 'An error occurred while processing the like action');
        }
    },
};