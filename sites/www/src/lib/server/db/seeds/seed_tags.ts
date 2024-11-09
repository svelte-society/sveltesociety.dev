import type Database from 'bun:sqlite'

export function seedTags(db: Database.Database) {
	const insertTagStmt = db.prepare(`
    INSERT INTO tags (name, slug, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `)

	const tags = [
		{ name: 'Svelte5', slug: 'svelte-5' },
		{ name: 'Runes', slug: 'runes' },
		{ name: 'Utility', slug: 'utility' },
		{ name: 'Snippet', slug: 'snippet' },
		{ name: 'Tutorial', slug: 'tutorial' }
	]

	const insertTagsTransaction = db.transaction((tags) => {
		for (const tag of tags) {
			const now = new Date().toISOString()
			insertTagStmt.run(tag.name, tag.slug, now, now)
		}
	})

	try {
		insertTagsTransaction(tags)
		console.log('Tags inserted successfully')
	} catch (error) {
		console.error('Error inserting tags:', error)
	}
}
