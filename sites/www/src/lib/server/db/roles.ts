import { db } from "./index";

// Type definition for a Role
export interface Role {
    id: number;
    name: string;
    value: string;
    description: string;
    permissions: string;
    created_at: string;
    updated_at: string;
    active: number;
}

// Function to get all roles
export async function get_roles() {
    return await db.query.roles.findMany();
}

// Function to get a role by ID
export async function get_role_by_id(roleId: number) {
    const role = await db.execute({
        sql: `SELECT * FROM roles WHERE id = ?`,
        args: [roleId],
    });
    return role.rows[0] as unknown as Role | undefined;
}

// Function to create a new role
export async function create_role(roleInfo: Omit<Role, 'id' | 'created_at' | 'updated_at'>) {
    try {
        // Create role and fetch the same role
        const [_, role] = await db.batch([
            {
                sql: `INSERT INTO roles (name, value, description, permissions, active) VALUES ($name, $value, $description, $permissions, 1)`,
                args: roleInfo,
            },
            {
                sql: `SELECT * FROM roles WHERE id = last_insert_rowid()`,
                args: [],
            },
        ]);

        return { success: true, role: role.rows[0] as unknown as Role };
    } catch (error) {
        console.error("Create failed with error:", error);
        return { success: false, error };
    }
}

// Function to update role information
export async function update_role(old_role: Omit<Role, 'created_at' | 'updated_at'>) {
    try {
        const result = await db.execute({
            sql: `
                UPDATE roles
                SET name = $name,
                    value = $value,
                    description = $description,
                    permissions = $permissions,
                    active = $active
                WHERE id = $id;    
                `,
            args: old_role
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
}

// Function to delete a role by ID
export async function delete_role(roleId: number) {
    try {
        await db.execute({
            sql: `DELETE FROM roles WHERE id = ?`,
            args: [roleId],
        });

        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}