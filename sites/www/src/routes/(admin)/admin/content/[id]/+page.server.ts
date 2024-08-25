import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import {
	type Content,
	create_content,
	get_content_by_id,
	get_tags_for_content,
	update_content
} from '$lib/server/db/content';
import { get_tags } from '$lib/server/db/tags';

import { schema } from './schema';

export const load = async ({ params }) => {
	const all_tags = get_tags();
	if (!all_tags) {
		fail(400, { message: 'Error getting tags' });
	}
	let data: Content | undefined = undefined;

	const contentId = params.id;

	if (contentId !== 'new') {
		const [res_content, res_content_tags] = await Promise.all([
			get_content_by_id(Number(params.id)),
			get_tags_for_content([Number(params.id)])
		]);
		if (!res_content || !res_content_tags || res_content_tags.length !== 1) {
			redirect(302, '/content');
		}

		data = { ...res_content, tags: res_content_tags[0].map((i) => i.id) } as Content;
	}

	const form = await superValidate(data, zod(schema), {});
	return {
		form,
		tags: all_tags
	};
};

export const actions = {
	default: async ({ params, request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			if (params.id === 'new') {
				create_content(form.data);
			} else {
				update_content({ ...form.data, id: Number(params.id) });
			}
			redirect(302, '/content');
		} catch (error) {
			return message(form, 'Failed to save content.');
		}
	}
};
