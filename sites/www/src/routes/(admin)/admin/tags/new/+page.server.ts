import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { tagService } from '$lib/server/db/services/tags';
import type { PageServerLoad, Actions } from './$types';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
});

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
        try {
            await tagService.create_tag(form.data);
            redirect(302, '/admin/tags');
        } catch (error) {
            return message(form, 'Failed to create tag. Please try again.');
        }
    }
};