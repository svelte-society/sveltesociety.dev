import { Schema, z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { collectionsService } from '$lib/server/db/services/collections';

const schema = z.object({
    id: z.number(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    author_id: z.number(),
    created_at: z.string(),
    updated_at: z.string()
});

export const load = (async ({ params }) => {
    const result = await collectionsService.get_collection(parseInt(params.id));
    if (!result.success || !result.data) {
        throw redirect(302, '/admin/collections');
    }
    const form = await superValidate(result.data as z.infer<typeof schema>, zod(schema));
    return {
        form
    };
});

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return fail(400, { form });
        }
        const { success } = await collectionsService.update_collection(form.data.id, form.data);
        if (!success) {
            return message(form, 'Something went wrong while updating the collection.');
        }
        throw redirect(302, '/admin/collections');
    }
};