import { userService } from '$lib/server/db/services/user';
import { fail } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const result = await userService.get_users()

    if (!result.success) {
        fail(400, { message: 'Error getting users' });
    }

    return {
        users: result.data
    };
}) satisfies PageServerLoad;