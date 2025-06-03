import { Database } from 'bun:sqlite'
export function seedInteractions(db: Database) {
	// Prepare statements
	const insertLikeStmt = db.prepare(
		'INSERT INTO likes (user_id, target_id, created_at) VALUES (?, ?, ?)'
	)
	const insertSaveStmt = db.prepare(
		'INSERT INTO saves (user_id, target_id, created_at) VALUES (?, ?, ?)'
	)

	// Get the first user's ID (assuming we have at least one user)
	const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: string } | undefined

	if (!user) {
		console.error('No users found in the database. Please seed users first.')
		return
	}

	// Get the first two content pieces (assuming we have at least two)
	const contentItems = db.prepare('SELECT id FROM content LIMIT 2').all() as { id: string }[]

	if (contentItems.length < 2) {
		console.error('Not enough content items found. Please seed content first.')
		return
	}

	const now = new Date().toISOString()

	// Seed likes and saves
	const seedInteractions = db.transaction(() => {
		// Add a like to the first content piece
		insertLikeStmt.run(user.id, contentItems[0].id, now)

		// Add a like to the second content piece
		insertLikeStmt.run(user.id, contentItems[1].id, now)

		// Save the first content piece
		insertSaveStmt.run(user.id, contentItems[0].id, now)
	})

	// Run the seeding
	try {
		seedInteractions()
		console.log('Likes and saves seeded successfully.')
	} catch (error) {
		console.error('Error seeding likes and saves:', error)
	}
}
