import * as schema from '../schema';

export async function seedContent(db: any) {
    try {
        // First, let's get the IDs of our tags
        const tagIds = await db.select({ id: schema.tags.id, slug: schema.tags.slug })
            .from(schema.tags);

        const tagMap = new Map(tagIds.map(tag => [tag.slug, tag.id]));

        // Now let's create our content
        const contentItems = [
            {
                title: "Introduction to Svelte 5",
                type: "recipe",
                body: "Svelte 5 introduces a revolutionary concept called runes...",
                slug: "introduction-to-svelte-5",
                description: "Learn about the new features in Svelte 5",
                tags: [tagMap.get('svelte-5'), tagMap.get('runes')]
            },
            {
                title: "Understanding Runes in Svelte 5",
                type: "recipe",
                body: "Runes are a new way to handle reactivity in Svelte 5...",
                slug: "understanding-runes-svelte-5",
                description: "Deep dive into Svelte 5's runes",
                tags: [tagMap.get('svelte-5'), tagMap.get('runes')]
            },
            {
                title: "5 Useful Svelte Snippets",
                type: "recipe",
                body: "Here are 5 Svelte snippets that will boost your productivity...",
                slug: "5-useful-svelte-snippets",
                description: "Boost your Svelte development with these snippets",
                tags: [tagMap.get('svelte-5'), tagMap.get('snippet'), tagMap.get('utility')]
            },
            {
                title: "Building a Todo App with Svelte 5",
                type: "recipe",
                body: "In this tutorial, we'll build a todo app using Svelte 5 and runes...",
                slug: "todo-app-svelte-5",
                description: "Step-by-step guide to building a todo app with Svelte 5",
                tags: [tagMap.get('svelte-5'), tagMap.get('runes'), tagMap.get('utility')]
            },
            {
                title: "Migrating from Svelte 4 to Svelte 5",
                type: "recipe",
                body: "Learn how to migrate your existing Svelte 4 projects to Svelte 5...",
                slug: "migrating-svelte-4-to-5",
                description: "Guide on upgrading your Svelte projects to version 5",
                tags: [tagMap.get('svelte-5'), tagMap.get('utility')]
            }
        ];

        // Insert the content
        for (const item of contentItems) {
            const [insertedContent] = await db.insert(schema.content)
                .values({
                    title: item.title,
                    type: item.type,
                    body: item.body,
                    slug: item.slug,
                    description: item.description,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                .returning({ id: schema.content.id });

            // Insert the content-tag relationships
            await db.insert(schema.contentToTags)
                .values(item.tags.map(tagId => ({
                    content_id: insertedContent.id,
                    tag_id: tagId
                })));
        }

        console.log('Content seeded successfully');
    } catch (error) {
        console.error('Error seeding content:', error);
    }
}