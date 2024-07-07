import * as schema from '../schema'


export async function seedTags(db: any) {
    try {
        await db.insert(schema.tags).values([
            {
                name: 'Svelte5',
                slug: 'svelte-5',
            },
            {
                name: 'Runes',
                slug: 'runes',
            },
            {
                name: 'Utility',
                slug: 'utility',
            },
            {
                name: 'Snippet',
                slug: 'snippet',
            },
        ]);

        console.log('Tags seeded successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
}