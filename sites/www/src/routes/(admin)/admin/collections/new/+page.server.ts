import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { collectionsService } from '$lib/server/db/services/collections';

const create_schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	author_id: z.number().int().positive('Author ID must be a positive integer')
});

const search_schema = () =>
	z.object({
		name: z.string().min(1).max(100)
	});

export const load = async () => {
	const create_form = await superValidate(zod(create_schema));
	return { create_form };
};

export const actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, zod(create_schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const result = await collectionsService.create_collection(form.data);
		if (!result.success) {
			return fail(500, { form, message: 'Failed to create collection' });
		}
		throw redirect(302, '/admin/collections');
	},
	finduser: async ({ request }) => {
		const form = await superValidate(request, zod(search_schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const result = await collectionsService.create_collection(form.data);

		// Simulate an API call with a delay
		await new Promise((resolve) => setTimeout(resolve, 100));

		if (!result.success) {
			return fail(500, { form, message: 'Failed to find user' });
		}

		// Mock user data - replace this with your actual API call
		const users: User[] = [
			{ id: '1', name: 'John Doe', email: 'john@example.com' },
			{ id: '2', name: 'Jane Smith', email: 'jane@example.com' },
			{ id: '3', name: 'Bob Johnson', email: 'bob@example.com' }
		].filter(
			(user) =>
				user.name.toLowerCase().includes(query.toLowerCase()) ||
				user.email.toLowerCase().includes(query.toLowerCase())
		);

		return { users };
	}
};
