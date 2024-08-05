import { get_content_by_id, update_content } from '$lib/server/db/content';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    children: z.array(z.number()).min(1, 'Children are required'),
    slug: z.string().min(1, 'Slug is required')
});

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id);
    const collection = await get_content_by_id(id);

    if (!collection) {
        throw error(404, 'Collection not found');
    }

    const form = await superValidate(collection, zod(schema));
    return {
        form
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const result = await update_content({
            id: form.data.id,
            title: form.data.title,
            description: form.data.description,
            children: form.data.children,
            slug: form.data.slug,
            type: 'collection'
        });

        if (result) {
            throw redirect(303, '/admin/collections');
        } else {
            throw error(500, 'Failed to update collection');
        }
    }
};