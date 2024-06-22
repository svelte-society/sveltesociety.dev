import { get_user_count } from '$lib/server/db/user';
import { fail } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const result = await get_user_count()

    if (!result.success) {
        fail(400, { message: 'Error getting users' });
    }

    return {
        users: result.data
    };
}) satisfies PageServerLoad;