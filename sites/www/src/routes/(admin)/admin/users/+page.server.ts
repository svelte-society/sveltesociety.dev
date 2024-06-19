import { get_users } from '$lib/server/db/user';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const users = await get_users()

    return {
        users
    };
}) satisfies PageServerLoad;