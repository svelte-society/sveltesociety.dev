import type { PageServerLoad } from './$types';
import { get_content_by_tag, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';

export const load: PageServerLoad = async ({ params, locals }) => {
	const content = await get_content_by_tag({ slug: params.slug });
	const tags = get_tags_for_content(content.map((c) => c.id));
	let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }));

	if (locals.user) {
		const { user_likes, user_saves } = get_user_likes_and_saves(
			locals.user.id,
			content.map((c) => c.id)
		);

		content_with_tags = content_with_tags.map((c, i) => ({
			...c,
			liked: user_likes.has(c.id),
			saved: user_saves.has(c.id)
		}));
	}

	return { content: content_with_tags };
};
