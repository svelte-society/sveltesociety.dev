import type Database from 'bun:sqlite'

export function seedTags(db: Database) {
	const insertTagStmt = db.prepare(`
    INSERT INTO tags (name, slug, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `)

	const tags = [
		{ name: 'Runes', slug: 'runes' },
		{ name: 'Utility', slug: 'utility' },
		{ name: 'State', slug: 'state' },
		{ name: 'Official', slug: 'official' },
		{ name: 'Snippet', slug: 'snippet' },
		{ name: 'Components', slug: 'components' },
		{ name: 'DevTools', slug: 'devtools' },
		{ name: 'i18n', slug: 'i18n' },
		{ name: 'Svelte 5', slug: 'svelte-5' },
		{ name: 'SvelteKit', slug: 'sveltekit' },
		{ name: 'Adapter', slug: 'adapter' },
		{ name: 'Testing', slug: 'testing' },
		{ name: 'Tutorial', slug: 'tutorial' }
	]

	type Tag = { name: string; slug: string }
	const insertTagsTransaction = db.transaction((tags: Tag[]) => {
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
