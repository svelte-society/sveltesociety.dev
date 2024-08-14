import {get_user_likes_and_saves_count} from "$lib/server/db/interactions";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    return get_user_likes_and_saves_count(locals.user.id)
}
