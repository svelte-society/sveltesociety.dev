import * as schema from '../schema';
import { db as db_type } from './index'
import { eq } from 'drizzle-orm';

export async function seed_users(db: typeof db_type) {
    try {
        // First, let's get the Admin role ID
        const adminRole = await db.query.roles.findFirst({
            where: eq(schema.roles.name, 'Admin')
        })

        if (!adminRole) {
            throw new Error('Admin role not found. Make sure to run seedRoles first.');
        }

        // Now let's create our user
        await db.insert(schema.users).values({
            id: 1,
            github_id: 534488,
            email: null,
            username: 'kevmodrome',
            name: 'Kevin Åberg Kultalahti',
            avatar_url: 'https://avatars.githubusercontent.com/u/534488?v=4',
            bio: 'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
            location: 'Sweden',
            twitter: 'kevmodrome',
            role: adminRole.id,
            created_at: new Date(1721331895712)
        });

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}