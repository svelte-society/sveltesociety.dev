import { contentService } from '$lib/server/db/services/content';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { data } = await contentService.searchContent(params.query)

    return json(data)
};