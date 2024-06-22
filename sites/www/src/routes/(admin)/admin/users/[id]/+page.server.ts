import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { get_roles } from '$lib/server/db/roles.js';
import { get_user, update_user } from '$lib/server/db/user.js';

enum Active {
    False = 0,
    True = 1
}

const schema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email().nullable(),
    bio: z.string().nullable(),
    location: z.string().nullable(),
    twitter: z.string().nullable(),
    avatar_url: z.string().nullable(),
    role_id: z.number().nullable(),
});

export const load = (async ({ params }) => {
    // convert to promise.all
    const [user_result, roles_result] = await Promise.all([get_user(parseInt(params.id)), get_roles()]);

    if (!user_result.data) {
        redirect(302, '/admin/users');
    }

    const form = await superValidate(user_result.data as z.infer<typeof schema>, zod(schema))
    return {
        user: user_result.data,
        roles: roles_result.data,
        form
    };
})
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { success } = await update_user(form.data.id as number, form.data);

        if (!success) {
            return message(form, 'Something went wrong.');
        }

        // Display a success status message
        redirect(302, '/admin/roles');
    }
};