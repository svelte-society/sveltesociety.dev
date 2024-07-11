import type { PageServerLoad } from './$types';
import { contentService } from '$lib/server/db/services/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const searchQuery = new URL(url).searchParams.get('search');
    if (searchQuery) {
        const resp = await fetch(`/search/${searchQuery}`)
        const content = await resp.json()

        if (content.error) {
            search_results: {
                error: 'Rate limit exceeded'
            }
        }

        return {
            search_results: {
                content,
                count: content.length
            }
        }
    } else {
        const result = await contentService.get_content_items();

        if (!result.success) {
            fail(400, { message: 'Error getting content' });
        }


        return { content: result?.data?.items, count: result?.data?.totalCount };
    }
};