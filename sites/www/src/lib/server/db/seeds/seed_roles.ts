
import * as schema from '../schema'

export async function seedRoles(db: any) {
    try {
        await db.insert(schema.roles).values([
            {
                name: 'Admin',
                value: 'admin',
                description: 'Administrator role with full access',
                permissions: JSON.stringify(['read', 'write', 'delete', 'manage_users']),
                active: true,
            },
            {
                name: 'User',
                value: 'user',
                description: 'Standard user role with limited access',
                permissions: JSON.stringify(['read', 'write']),
                active: true,
            },
        ]);

        console.log('Roles seeded successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
}