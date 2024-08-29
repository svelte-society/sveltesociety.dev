import Database from 'better-sqlite3';

export function seedModerationQueue(db: Database.Database) {
	// Get the first user's ID (assuming we have at least one user)
	const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: string };

	const insertModerationItemStmt = db.prepare(`
        INSERT INTO moderation_queue (type, status, data, submitted_by, submitted_at)
        VALUES (?, ?, ?, ?, ?)
    `);

	const moderationItems = [
		{
			type: 'content',
			status: 'pending',
			data: JSON.stringify({
				title: 'Svelte 5 Runes Tutorial',
				body: 'This tutorial covers the new runes feature in Svelte 5...',
				type: 'recipe'
			}),
			submitted_by: user.id
		},
		{
			type: 'content',
			status: 'pending',
			data: JSON.stringify({
				title: 'Utility Functions for SvelteKit',
				body: 'A collection of useful utility functions for SvelteKit projects...',
				type: 'recipe'
			}),
			submitted_by: user.id
		},
		{
			type: 'content',
			status: 'pending',
			data: JSON.stringify({
				title: 'Building a Blog with SvelteKit',
				body: 'Step-by-step guide to creating a blog using SvelteKit...',
				type: 'recipe'
			}),
			submitted_by: user.id
		}
	];

	const insertModerationItemsTransaction = db.transaction((items: typeof moderationItems) => {
		for (const item of items) {
			const now = new Date().toISOString();
			insertModerationItemStmt.run(item.type, item.status, item.data, item.submitted_by, now);
		}
	});

	try {
		insertModerationItemsTransaction(moderationItems);
		console.log('Moderation queue items inserted successfully');
	} catch (error) {
		console.error('Error inserting moderation queue items:', error);
	}
}
