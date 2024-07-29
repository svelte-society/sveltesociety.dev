import type { PageServerLoad } from './$types';
import { contentService } from '$lib/server/db/services/content';
import { fail, error } from '@sveltejs/kit';
import { likeService } from '$lib/server/db/services/likes';
import { saveService } from '$lib/server/db/services/saves';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
    const searchQuery = url.searchParams.get('search');
    let page = url.searchParams.get('page')

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
            user_id: locals?.user?.id,
            page: page ? parseInt(page) : 0
        });

        if (!result.success) {
            fail(400, { message: 'Error getting content' });
        }


        return { content: result?.data?.items, count: result?.data?.totalCount, totalPages: result?.data?.totalPages };
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

        if (!id) {
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
    toggle_save: async ({ request, locals }) => {
        if (!locals.user) {
            // User is not logged in, return silently
            return;
        }

        const data = await request.formData();
        const id = data.get('id');
        const type: 'save' | 'unsave' = data.get('type')

        if (!id) {
            return fail(400, { message: 'Invalid or missing id' });
        }

        try {

            if (type === 'save') {
                // Attempt to like the content
                const saveResult = await saveService.save(locals.user.id, id);

                if (!saveResult.success) {
                    throw new Error('Failed to process save action');
                }
            } else {
                const unlikeResult = await saveService.unsave(locals.user.id, id)
                if (!unlikeResult.success) {
                    throw new Error('Failed to process unsave action');
                }
            }
            // Return success without any specific action information
            return { success: true };
        } catch (err) {
            console.error('Error processing like:', err);
            throw error(500, 'An error occurred while processing the save action');
        }
    },
};