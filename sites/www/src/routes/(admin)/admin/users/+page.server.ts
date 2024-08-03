import type { PageServerLoad } from './$types';
import { get_users } from '$lib/server/db/user';

export const load = (async () => {
    return {
        users: get_users()
    };
}) satisfies PageServerLoad;