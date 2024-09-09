import type { PageServerLoad } from './$types';
import { filter_content_schema, get_filtered_content } from '$lib/server/filter';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import {
	get_content,
	get_content_by_ids,
	get_tags_for_content
} from '$lib/server/db/content';
import {
	get_user_likes_and_saves,
	add_interaction,
	remove_interaction
} from '$lib/server/db/interactions';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
	const filters = await superValidate(url, zod(filter_content_schema));

	let content;

	if (filters.valid) {
		content = get_filtered_content(filters.data);
	} else {
		content = get_content();
	}

	if (content.length === 0) {
		return {
			content: [],
			count: 0
		};
	}

	const tags = get_tags_for_content(content.map((c) => c.id));
	const content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }));
	const all_children = [
		...new Set(content.reduce((acc, c) => [...acc, ...JSON.parse(c.children ?? '[]')], []))
	];
	const children = get_content_by_ids(all_children);

	let content_with_tags_and_children = content_with_tags.map((c, i) => ({
		...c,
		children: JSON.parse(c.children ?? '[]').map((id) =>
			children.find((child) => child.id === id)
		)
	}));

	if (locals.user) {
		const { user_likes, user_saves } = get_user_likes_and_saves(
			locals.user.id,
			content.map((c) => c.id)
		);

		content_with_tags_and_children = content_with_tags_and_children.map((c, i) => ({
			...c,
			liked: user_likes.has(c.id),
			saved: user_saves.has(c.id)
		}));
	}

	return {
		content: content_with_tags_and_children,
		count: 0
	};
};

export const actions = {
	interact: async ({ request, locals }) => {
		if (!locals.user) return;
		const data = await request.formData();
		const type = data.get('type') as 'like' | 'save';
		const contentId = data.get('id') as string || null;
		const action = data.get('action') as 'add' | 'remove';

		if (
			!['like', 'save'].includes(type) ||
			!['add', 'remove'].includes(action) || !contentId
		) {
			return fail(400, { message: 'Invalid input' });
		}

		try {
			if (action === 'add') {
				add_interaction(type, locals.user.id, contentId);
			} else {
				remove_interaction(type, locals.user.id, contentId);
			}
			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Server error' });
		}
	}
};
