import { delete_role, get_roles } from '$lib/server/db/roles';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async () => {
    const roles = await get_roles();

    return {
        roles
    }
})

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        if (!id) {
            return fail(400, { message: 'No role id provided.' });
        }

        const { success } = await delete_role(id);

        if (!success) {
            return { message: 'Something went wrong.' };
        }

        return { message: `Role deleted.` };
    }
};