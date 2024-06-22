import { db } from "./index";
import { sql, eq } from "drizzle-orm";
import { roles } from "./schema";
import { handleServiceCall } from "./utils";

// Type definition for a New Role
export interface NewRole {
    name: string;
    value: string;
    description: string;
    permissions: string;
    active: number;
}

export const findRolesStatement = db.query.roles.findMany().prepare();

export const findRoleStatement = db.query.roles.findFirst({
    where: (role, { eq }) => eq(role.id, sql.placeholder('id')),
}).prepare();

// Function to get all roles
export async function get_roles() {
    return handleServiceCall(async () => await findRolesStatement.get() || [])
}

// Function to get a role by ID
export async function get_role_by_id(role_id: number) {
    return handleServiceCall(async () => await findRoleStatement.get({ id: role_id }))
}

// Function to create a new role
export async function create_role(role_info: NewRole) {
    return handleServiceCall(async () => await db.insert(roles).values(role_info).returning())
}

// Function to update role information
export async function update_role(old_role: NewRole & { id: number }) {
    return handleServiceCall(async () => await db.update(roles).set(old_role).where(eq(roles.id, old_role.id)).returning())
}

// Function to delete a role by ID
export async function delete_role(role_id: number) {
    return handleServiceCall(async () => await db.delete(roles).where(eq(roles.id, role_id)).returning())
}