import { config } from 'dotenv';

import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../schema'

config({
    path: '.env.development'
});

export const db = drizzle(createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
}), { schema })

async function seedRoles() {
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

seedRoles();