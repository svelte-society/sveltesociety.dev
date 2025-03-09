import { db } from './index'
// Remove the incorrect import
// Add import for environment variables
import { dev } from '$app/environment'

interface GitHubUserInfo {
	id: number
	email?: string
	name?: string
	login: string
	avatar_url?: string
	bio?: string
	location?: string
	twitter_username?: string
}

export interface User {
	id: string
	email: string | null
	username: string
	name: string | null
	avatar_url: string | null
	bio: string | null
	location: string | null
	twitter: string | null
	role: number
}

export interface OAuthProvider {
	id: number
	name: string
	description: string | null
	active: boolean
	created_at: string
}

export interface UserOAuth {
	id: string
	user_id: string
	provider_id: number
	provider_user_id: string
	access_token: string | null
	refresh_token: string | null
	token_expires_at: string | null
	profile_data: any | null
	created_at: string
	updated_at: string
}

export const get_user = (id: string): User | undefined => {
	const stmt = db.prepare(`
      SELECT * FROM users
      WHERE id = $id
    `)

	try {
		return stmt.get({ id: id }) as User
	} catch (error) {
		console.error('Error getting user:', error)
		return undefined
	}
}

export const get_user_by_oauth = (provider: string, providerUserId: string): User | undefined => {
	const stmt = db.prepare(`
      SELECT u.* FROM users u
      JOIN user_oauth uo ON u.id = uo.user_id
      JOIN oauth_providers op ON uo.provider_id = op.id
      WHERE op.name = $provider AND uo.provider_user_id = $providerUserId
    `)

	try {
		return stmt.get({ provider, providerUserId }) as User
	} catch (error) {
		console.error('Error getting user by OAuth:', error)
		return undefined
	}
}

export const get_users = (): User[] => {
	console.warn('get_users: No limit provided, risk of memory exhaustion')
	const stmt = db.prepare(`
      SELECT * FROM users
    `)

	try {
		return stmt.all() as User[]
	} catch (error) {
		console.error('Error getting users:', error)
		return []
	}
}

export const get_user_count = (): number => {
	const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM users
    `)

	try {
		const result = stmt.get() as { count: number }
		return result.count
	} catch (error) {
		console.error('Error getting user count:', error)
		return 0
	}
}

export const create_or_update_user = (githubInfo: GitHubUserInfo): User => {
	// Start a transaction
	db.exec('BEGIN TRANSACTION')

	try {
		// Get the GitHub provider ID
		const providerStmt = db.prepare(`
			SELECT id FROM oauth_providers WHERE name = 'github'
		`)
		const provider = providerStmt.get() as OAuthProvider
		
		if (!provider) {
			throw new Error('GitHub OAuth provider not found')
		}

		// Check if user already exists with this OAuth provider
		const existingUserStmt = db.prepare(`
			SELECT u.* FROM users u
			JOIN user_oauth uo ON u.id = uo.user_id
			WHERE uo.provider_id = $providerId AND uo.provider_user_id = $providerUserId
		`)
		
		const existingUser = existingUserStmt.get({
			providerId: provider.id,
			providerUserId: githubInfo.id.toString()
		}) as User | undefined

		let user: User

		// Check if we're in development mode using SvelteKit's dev flag
		const isDevelopment = dev

		if (existingUser) {
			// Update existing user with role=1 in development mode
			const updateUserStmt = db.prepare(`
				UPDATE users SET
					email = COALESCE($email, email),
					name = COALESCE($name, name),
					username = COALESCE($username, username),
					avatar_url = COALESCE($avatar_url, avatar_url),
					bio = COALESCE($bio, bio),
					location = COALESCE($location, location),
					twitter = COALESCE($twitter, twitter)
					${isDevelopment ? ', role = 1' : ''}
				WHERE id = $id
				RETURNING *
			`)

			user = updateUserStmt.get({
				id: existingUser.id,
				email: githubInfo.email || null,
				username: githubInfo.login,
				name: githubInfo.name || null,
				avatar_url: githubInfo.avatar_url || null,
				bio: githubInfo.bio || null,
				location: githubInfo.location || null,
				twitter: githubInfo.twitter_username || null
			}) as User

			// Update OAuth profile data
			const updateOAuthStmt = db.prepare(`
				UPDATE user_oauth SET
					profile_data = $profileData,
					updated_at = CURRENT_TIMESTAMP
				WHERE user_id = $userId AND provider_id = $providerId
			`)

			updateOAuthStmt.run({
				userId: user.id,
				providerId: provider.id,
				profileData: JSON.stringify(githubInfo)
			})
		} else {
			// Create new user
			const userInfo = extractGithubUserInfo(githubInfo)
			
			// In development mode, set role to 1 (admin)
			const createUserStmt = isDevelopment 
				? db.prepare(`
					INSERT INTO users (
						email, 
						username, 
						name, 
						avatar_url, 
						bio, 
						location, 
						twitter,
						role
					)
					VALUES (
						$email, 
						$username, 
						$name, 
						$avatar_url, 
						$bio, 
						$location, 
						$twitter,
						1
					)
					RETURNING *
				`)
				: db.prepare(`
					INSERT INTO users (
						email, 
						username, 
						name, 
						avatar_url, 
						bio, 
						location, 
						twitter
					)
					VALUES (
						$email, 
						$username, 
						$name, 
						$avatar_url, 
						$bio, 
						$location, 
						$twitter
					)
					RETURNING *
				`);

			user = createUserStmt.get(userInfo) as User

			// Create OAuth entry
			const createOAuthStmt = db.prepare(`
				INSERT INTO user_oauth (user_id, provider_id, provider_user_id, profile_data)
				VALUES ($userId, $providerId, $providerUserId, $profileData)
			`)

			createOAuthStmt.run({
				userId: user.id,
				providerId: provider.id,
				providerUserId: githubInfo.id.toString(),
				profileData: JSON.stringify(githubInfo)
			})
		}

		// Commit the transaction
		db.exec('COMMIT')
		
		return user
	} catch (error) {
		// Rollback the transaction on error
		db.exec('ROLLBACK')
		console.error('Error in create_or_update_user:', error)
		throw error
	}
}

export const update_user = (userId: string, updatedInfo: Partial<User>): User | null => {
	// Start a transaction
	db.exec('BEGIN TRANSACTION')

	try {
		// Update user information
		const updateFields = Object.keys(updatedInfo)
			.filter(key => key !== 'id' && updatedInfo[key as keyof User] !== undefined)
			.map(key => `${key} = @${key}`)
			.join(', ')

		if (!updateFields) {
			db.exec('ROLLBACK')
			return null
		}

		const updateUserStmt = db.prepare(`
			UPDATE users
			SET ${updateFields}
			WHERE id = @id
			RETURNING *
		`)

		const params = { ...updatedInfo, id: userId }
		const updatedUser = updateUserStmt.get(params) as User | undefined

		if (!updatedUser) {
			db.exec('ROLLBACK')
			return null
		}

		// Commit the transaction
		db.exec('COMMIT')
		return updatedUser
	} catch (error) {
		// Rollback on error
		db.exec('ROLLBACK')
		console.error('Error updating user:', error)
		return null
	}
}

export const delete_user = (userId: string): boolean => {
	// Start a transaction
	db.exec('BEGIN TRANSACTION')

	try {
		// Delete user
		const deleteUserStmt = db.prepare('DELETE FROM users WHERE id = ?')
		const result = deleteUserStmt.run(userId)

		// Check if user was deleted
		if (result.changes === 0) {
			db.exec('ROLLBACK')
			return false
		}

		// Commit the transaction
		db.exec('COMMIT')
		return true
	} catch (error) {
		// Rollback on error
		db.exec('ROLLBACK')
		console.error('Error deleting user:', error)
		return false
	}
}

function extractGithubUserInfo(info: GitHubUserInfo): Omit<User, 'id' | 'role'> {
	return {
		email: info.email || null,
		username: info.login,
		name: info.name || null,
		avatar_url: info.avatar_url || null,
		bio: info.bio || null,
		location: info.location || null,
		twitter: info.twitter_username || null
	}
}