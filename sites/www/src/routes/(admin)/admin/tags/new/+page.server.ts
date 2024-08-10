import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { create_tag } from '$lib/server/db/tags';
import { schema } from './schema';

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(schema));
    return { form };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return fail(400, { form });
        }
        create_tag(form.data);
        redirect(302, '/admin/tags');
    }
};