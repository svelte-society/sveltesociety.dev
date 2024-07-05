import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { roleService } from '$lib/server/db/services/roles';

enum Active {
    False = 0,
    True = 1
}

const schema = z.object({
    id: z.number(),
    name: z.string(),
    value: z.string(),
    description: z.string(),
    permissions: z.string(),
    active: z.nativeEnum(Active)
});

export const load = (async ({ params }) => {
    const result = await roleService.get_role_by_id(parseInt(params.id));

    if (!result.data) {
        redirect(302, '/admin/roles');
    }

    const form = await superValidate(result.data as z.infer<typeof schema>, zod(schema))
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

        const { success } = await roleService.update_role(form.data);

        if (!success) {
            return message(form, 'Something went wrong.');
        }

        // Display a success status message
        redirect(302, '/admin/roles');
    }
};