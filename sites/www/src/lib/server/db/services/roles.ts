import { db } from '../';
import { sql, eq } from 'drizzle-orm';
import { roles } from '../schema';
import { handleServiceCall } from './utils';

// Type definition for a New Role
export interface NewRole {
	name: string;
	value: string;
	description: string;
	permissions: string;
	active: number;
}

export class RoleService {
	private static instance: RoleService;

	private constructor() {}

	public static getInstance(): RoleService {
		if (!RoleService.instance) {
			RoleService.instance = new RoleService();
		}
		return RoleService.instance;
	}

	private findRolesStatement = db.query.roles.findMany().prepare();

	private findActiveRolesStatement = db.query.roles
		.findMany({
			where: (role, { eq }) => eq(role.active, sql.placeholder('active'))
		})
		.prepare();

	private countRolesStatement = db
		.select({ count: sql<number>`count(*)` })
		.from(roles)
		.prepare();

	private findRoleStatement = db.query.roles
		.findFirst({
			where: (role, { eq }) => eq(role.id, sql.placeholder('id'))
		})
		.prepare();

	// Function to get all roles
	async get_roles() {
		return handleServiceCall(async () => (await this.findRolesStatement.get()) || []);
	}
	async get_active_roles() {
		return handleServiceCall(
			async () => (await this.findActiveRolesStatement.get({ active: 1 })) || []
		);
	}

	async get_roles_count() {
		return handleServiceCall(async () => {
			const result = await this.countRolesStatement.get();
			if (!result) {
				throw new Error('Failed to get user count');
			}
			return result.count;
		});
	}

	// Function to get a role by ID
	async get_role_by_id(role_id: number) {
		return handleServiceCall(async () => await this.findRoleStatement.get({ id: role_id }));
	}

	// Function to create a new role
	async create_role(role_info: NewRole) {
		return handleServiceCall(async () => await db.insert(roles).values(role_info).returning());
	}

	// Function to update role information
	async update_role(old_role: NewRole & { id: number }) {
		return handleServiceCall(
			async () => await db.update(roles).set(old_role).where(eq(roles.id, old_role.id)).returning()
		);
	}

	// Function to delete a role by ID
	async delete_role(role_id: number) {
		return handleServiceCall(
			async () => await db.delete(roles).where(eq(roles.id, role_id)).returning()
		);
	}
}

// Export the singleton instance
export const roleService = RoleService.getInstance();
