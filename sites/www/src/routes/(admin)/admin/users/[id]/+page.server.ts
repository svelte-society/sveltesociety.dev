import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { roleService } from '$lib/server/db/services/roles';
import { userService } from '$lib/server/db/services/user.js';

const schema = z.object({
	id: z.number(),
	username: z.string(),
	email: z.string().email().nullable(),
	bio: z.string().nullable(),
	location: z.string().nullable(),
	twitter: z.string().nullable(),
	avatar_url: z.string().nullable(),
	role_id: z.number().nullable()
});

export const load = async ({ params }) => {
	const [user_result, roles_result] = await Promise.all([
		userService.get_user(parseInt(params.id)),
		roleService.get_active_roles()
	]);

	if (!user_result.data) {
		redirect(302, '/admin/users');
	}

	const form = await superValidate(user_result.data as z.infer<typeof schema>, zod(schema));
	return {
		user: user_result.data,
		roles: roles_result.data.map((r) => ({ ...r, label: r.name, value: r.id })),
		form
	};
};
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { success } = await userService.update_user(form.data.id as number, form.data);

		if (!success) {
			return message(form, 'Something went wrong.');
		}

		// Display a success status message
		redirect(302, '/admin/users');
	}
};
