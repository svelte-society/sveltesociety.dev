import { get_users } from '$lib/server/db/user';
import { fail } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const result = await get_users()

    if (!result.success) {
        fail(400, { message: 'Error getting users' });
    }

    return {
        users: result.data
    };
}) satisfies PageServerLoad;