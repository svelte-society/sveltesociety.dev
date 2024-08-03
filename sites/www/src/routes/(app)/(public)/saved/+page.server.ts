import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { get_user_saved_content, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
get_user_likes_and_saves

export const load = (async ({ url, locals }) => {
    if (!locals?.user?.id) redirect(302, '/')

    try {
        const content = get_user_saved_content({ user_id: locals.user.id, limit: 20, offset: 0 });

        const tags = get_tags_for_content(content.map(c => c.id))
        let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

        if (locals.user) {
            const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

            content_with_tags = content_with_tags.map((c, i) => ({
                ...c,
                liked: user_likes.has(c.id),
                saved: user_saves.has(c.id)
            }))
        }


        return {
            content: content_with_tags,
        };
    } catch (err) {
        console.error('Error fetching saved content:', err);
        throw error(500, 'An error occurred while fetching saved content');
    }
}) satisfies PageServerLoad;
