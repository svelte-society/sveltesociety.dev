// src/routes/content/new/+page.server.ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { contentService } from '$lib/server/db/services/content';

const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	type: z.enum(['recipe', 'video']),
	body: z.string().min(1, 'Body is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required')
});

export const load = async () => {
	const form = await superValidate(zod(schema));
	return {
		form
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await contentService.create_content(form.data);
			redirect(302, '/content');
		} catch (error) {
			return message(form, 'Failed to create content.');
		}
	}
};
