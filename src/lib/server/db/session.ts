import { db } from './index'

const SEVEN_DAYS = 7 * 24 * 60 * 60 // 7 days in seconds

// Generate a random UUID for session tokens
function generateUUID(): string {
	return crypto.randomUUID();
}

interface Session {
	id: number
	user_id: string
	session_token: string
	expires_at: string
	created_at: string
}

interface SessionResult {
	valid: boolean
	user_id?: string
}

const deleteSessionStatement = db.prepare(`
    DELETE FROM sessions
    WHERE session_token = $session_token
    RETURNING *
  `)

const createSessionStatement = db.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES ($user_id, $session_token, $expires_at)
    RETURNING session_token
  `)

const validateSessionStatement = db.prepare(`
    SELECT user_id
    FROM sessions
    WHERE session_token = $session_token
    AND expires_at > datetime('now')
    LIMIT 1
  `)

export function delete_session(sessionToken: string): Session | undefined {
	try {
		return deleteSessionStatement.get({ session_token: sessionToken }) as Session | undefined
	} catch (error) {
		console.error('Error deleting session:', error)
		return undefined
	}
}

export const create_session = (user_id: string): string => {
	try {
		const sessionToken = generateUUID()
		const now = new Date()
		const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000)

		const result = createSessionStatement.get({
			user_id: user_id,
			session_token: sessionToken,
			expires_at: formatDateForSQLite(expiration)
		}) as { session_token: string }

		return result.session_token
	} catch (error) {
		console.error('Error creating session:', error)
		throw error
	}
}

export function validate_session_id(sessionToken: string): SessionResult {
	try {
		const result = validateSessionStatement.get({ session_token: sessionToken }) as
			| { user_id: string | null }
			| undefined

		if (result === undefined || result.user_id === null) {
			return { valid: false }
		} 
		return { valid: true, user_id: result.user_id }

	} catch (error) {
		console.error('Error validating session:', error)
		return { valid: false }
	}
}

export function formatDateForSQLite(date: Date): string {
	return date.toISOString().replace('T', ' ').replace('Z', '')
}
