import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { get_user_saved_content, get_tags_for_content, get_content_by_ids } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
get_user_likes_and_saves

export const load = (async ({ url, locals }) => {
    if (!locals?.user?.id) redirect(302, '/')

    try {
        const content = get_user_saved_content({ user_id: locals.user.id, limit: 20, offset: 0 });

        const tags = get_tags_for_content(content.map(c => c.id))
        let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))
        const all_children = [...new Set(content.reduce((acc, c) => [...acc, ...JSON.parse(c.children ?? '[]')], []))]
        const children = get_content_by_ids(all_children)

        let content_with_tags_and_children = content_with_tags.map((c, i) => ({
            ...c,
            children: JSON.parse(c.children ?? '[]').map(id => children.find(child => child.id === id))
        }))

        if (locals.user) {
            const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

            content_with_tags_and_children = content_with_tags.map((c, i) => ({
                ...c,
                liked: user_likes.has(c.id),
                saved: user_saves.has(c.id)
            }))
        }


        return {
            content: content_with_tags_and_children,
        };
    } catch (err) {
        console.error('Error fetching saved content:', err);
        throw error(500, 'An error occurred while fetching saved content');
    }
}) satisfies PageServerLoad;
