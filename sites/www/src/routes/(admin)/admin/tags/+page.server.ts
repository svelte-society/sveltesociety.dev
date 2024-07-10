import { tagService } from '$lib/server/db/services/tags';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const deleteSchema = z.object({
    id: z.number().int().positive()
});

export const load: PageServerLoad = async () => {
    const result = await tagService.get_tags_ordered_by_content_count();
    const form = await superValidate(zod(deleteSchema));

    if (!result.success) {
        return fail(400, { message: 'Error getting tags' });
    }

    return { tags: result.data, form };
};

export const actions: Actions = {
    deleteTag: async (event) => {
        const form = await superValidate(event, zod(deleteSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await tagService.delete_tag(form.data.id);
            return message(form, 'Tag deleted successfully');
        } catch (error) {
            return message(form, 'Failed to delete tag', { status: 500 });
        }
    }
};