import { delete_role, get_roles } from '$lib/server/db/roles';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
    const result = await get_roles();

    if (!result.success) {
        fail(400, { message: 'Error getting roles' });
    }

    return {
        roles: result.data
    }
})

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as unknown as number;

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