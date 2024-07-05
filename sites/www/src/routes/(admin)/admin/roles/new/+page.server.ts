import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { roleService } from '$lib/server/db/services/roles';

const schema = z.object({
    name: z.string(),
    value: z.string(),
    description: z.string(),
    permissions: z.string(),
});
export const load = (async () => {
    const form = await superValidate(zod(schema))
    return {
        form
    };
})
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { success } = await roleService.create_role(form.data);

        if (!success) {
            return message(form, 'Something went wrong.');
        }

        // Display a success status message
        redirect(302, '/admin/roles');
    }
};