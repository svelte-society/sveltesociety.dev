import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { create_content } from '$lib/server/db/content';
import { get_tags } from '$lib/server/db/tags';

import { schema } from './schema';

export const load = async () => {
	const result = get_tags();

	if (!result) {
		fail(400, { message: 'Error getting tags' });
	}

	const form = await superValidate(zod(schema));
	return {
		form,
		tags: result.data
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			create_content(form.data);
			redirect(302, '/content');
		} catch (error) {
			return message(form, 'Failed to create content.');
		}
	}
};
