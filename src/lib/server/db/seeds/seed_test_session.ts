import { Database } from 'bun:sqlite'

const SEVEN_DAYS = 7 * 24 * 60 * 60 // 7 days in seconds

export function seedTestSession(db: Database) {
	// Get the first user's ID
	const getUserStmt = db.prepare(`
		SELECT id FROM users LIMIT 1
	`)

	const user = getUserStmt.get() as { id: string } | undefined

	if (!user) {
		console.error('No users found. Please seed users first.')
		return
	}

	const createSessionStatement = db.prepare(`
        INSERT INTO sessions (user_id, session_token, expires_at)
        VALUES (@user_id, @session_token, @expires_at)
        RETURNING session_token
      `)

	const sessionToken = 'fe65824f-c73d-4579-a11d-fc98b6e85ad0'
	const now = new Date()
	const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000)

	createSessionStatement.get({
		user_id: user.id,
		session_token: sessionToken,
		expires_at: formatDateForSQLite(expiration)
	})

	console.log('Session seeded successfully')
}

function formatDateForSQLite(date: Date): string {
	return date.toISOString().replace('T', ' ').replace('Z', '')
}
