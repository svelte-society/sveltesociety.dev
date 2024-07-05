import { userService } from '$lib/server/db/services/user';
import { roleService } from '$lib/server/db/services/roles';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const userResult = await userService.get_user_count();
	const rolesResult = await roleService.get_roles_count();

	return {
		users: userResult.data,
		roles: rolesResult.data
	};
}) satisfies PageServerLoad;
