import { get_tags, delete_tag } from '$lib/server/db/tags';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const deleteSchema = z.object({
    id: z.number().int().positive()
});

export const load: PageServerLoad = async () => {
    const result = get_tags()
    const form = await superValidate(zod(deleteSchema));

    if (!result) {
        return fail(400, { message: 'Error getting tags' });
    }

    return { tags: result, form };
};

export const actions: Actions = {
    delete: async (event) => {
        const form = await superValidate(event, zod(deleteSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        delete_tag(form.data.id);
        redirect(302, '/admin/tags');
    }
};