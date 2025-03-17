import { Database } from 'bun:sqlite'
// For testing purposes, we'll use a constant
const dev = process.env.NODE_ENV === 'development'

export interface GitHubUserInfo {
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

export class UserService {
	private getUserStatement
	private getUserByOAuthStatement
	private getUsersStatement
	private getUserCountStatement
	private getProviderStatement
	private getExistingUserStatement
	private updateUserStatement
	private createUserStatement
	private createUserAdminStatement
	private updateOAuthStatement
	private createOAuthStatement
	private deleteUserStatement

	constructor(private db: Database) {
		this.getUserStatement = this.db.prepare(`
			SELECT * FROM users
			WHERE id = $id
		`)

		this.getUserByOAuthStatement = this.db.prepare(`
			SELECT u.* FROM users u
			JOIN user_oauth uo ON u.id = uo.user_id
			JOIN oauth_providers op ON uo.provider_id = op.id
			WHERE op.name = $provider AND uo.provider_user_id = $providerUserId
		`)

		this.getUsersStatement = this.db.prepare(`
			SELECT * FROM users
		`)

		this.getUserCountStatement = this.db.prepare(`
			SELECT COUNT(*) as count FROM users
		`)

		this.getProviderStatement = this.db.prepare(`
			SELECT id FROM oauth_providers WHERE name = 'github'
		`)

		this.getExistingUserStatement = this.db.prepare(`
			SELECT u.* FROM users u
			JOIN user_oauth uo ON u.id = uo.user_id
			WHERE uo.provider_id = $providerId AND uo.provider_user_id = $providerUserId
		`)

		this.updateUserStatement = this.db.prepare(`
			UPDATE users SET
				email = COALESCE($email, email),
				name = COALESCE($name, name),
				username = COALESCE($username, username),
				avatar_url = COALESCE($avatar_url, avatar_url),
				bio = COALESCE($bio, bio),
				location = COALESCE($location, location),
				twitter = COALESCE($twitter, twitter)
				${dev ? ', role = 1' : ''}
			WHERE id = $id
			RETURNING *
		`)

		this.createUserStatement = this.db.prepare(`
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
		`)

		this.createUserAdminStatement = this.db.prepare(`
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

		this.updateOAuthStatement = this.db.prepare(`
			UPDATE user_oauth SET
				profile_data = $profileData,
				updated_at = CURRENT_TIMESTAMP
			WHERE user_id = $userId AND provider_id = $providerId
		`)

		this.createOAuthStatement = this.db.prepare(`
			INSERT INTO user_oauth (user_id, provider_id, provider_user_id, profile_data)
			VALUES ($userId, $providerId, $providerUserId, $profileData)
		`)

		this.deleteUserStatement = this.db.prepare('DELETE FROM users WHERE id = $id')
	}

	getUser(id: string): User | undefined {
		try {
			const result = this.getUserStatement.get({ id: id })
			return result ? result as User : undefined
		} catch (error) {
			console.error('Error getting user:', error)
			return undefined
		}
	}

	getUserByOAuth(provider: string, providerUserId: string): User | undefined {
		try {
			const result = this.getUserByOAuthStatement.get({ 
				provider: provider, 
				providerUserId: providerUserId 
			})
			return result ? result as User : undefined
		} catch (error) {
			console.error('Error getting user by OAuth:', error)
			return undefined
		}
	}

	getUsers(): User[] {
		console.warn('getUsers: No limit provided, risk of memory exhaustion')
		try {
			return this.getUsersStatement.all() as User[]
		} catch (error) {
			console.error('Error getting users:', error)
			return []
		}
	}

	getUserCount(): number {
		try {
			const result = this.getUserCountStatement.get() as { count: number }
			return result.count
		} catch (error) {
			console.error('Error getting user count:', error)
			return 0
		}
	}

	private extractGithubUserInfo(githubInfo: GitHubUserInfo) {
		return {
			email: githubInfo.email || null,
			username: githubInfo.login,
			name: githubInfo.name || null,
			avatar_url: githubInfo.avatar_url || null,
			bio: githubInfo.bio || null,
			location: githubInfo.location || null,
			twitter: githubInfo.twitter_username || null
		}
	}

	createOrUpdateUser(githubInfo: GitHubUserInfo): User {
		this.db.exec('BEGIN TRANSACTION')

		try {
			const provider = this.getProviderStatement.get() as OAuthProvider
			
			if (!provider) {
				throw new Error('GitHub OAuth provider not found')
			}

			const existingUser = this.getExistingUserStatement.get({
				providerId: provider.id,
				providerUserId: githubInfo.id.toString()
			}) as User | undefined

			let user: User

			if (existingUser) {
				user = this.updateUserStatement.get({
					id: existingUser.id,
					email: githubInfo.email || null,
					username: githubInfo.login,
					name: githubInfo.name || null,
					avatar_url: githubInfo.avatar_url || null,
					bio: githubInfo.bio || null,
					location: githubInfo.location || null,
					twitter: githubInfo.twitter_username || null
				}) as User

				this.updateOAuthStatement.run({
					userId: user.id,
					providerId: provider.id,
					profileData: JSON.stringify(githubInfo)
				})
			} else {
				const userInfo = this.extractGithubUserInfo(githubInfo)
				const createStmt = dev ? this.createUserAdminStatement : this.createUserStatement
				
				user = createStmt.get(userInfo) as User

				this.createOAuthStatement.run({
					userId: user.id,
					providerId: provider.id,
					providerUserId: githubInfo.id.toString(),
					profileData: JSON.stringify(githubInfo)
				})
			}

			this.db.exec('COMMIT')
			return user
		} catch (error) {
			this.db.exec('ROLLBACK')
			console.error('Error in createOrUpdateUser:', error)
			throw error
		}
	}

	updateUser(id: string, updates: Partial<User>): User | undefined {
		if (Object.keys(updates).length === 0) {
			return undefined
		}

		try {
			const params = {
				id: id,
				email: updates.email || null,
				username: updates.username || null,
				name: updates.name || null,
				avatar_url: updates.avatar_url || null,
				bio: updates.bio || null,
				location: updates.location || null,
				twitter: updates.twitter || null
			}

			const result = this.updateUserStatement.get(params)
			return result ? result as User : undefined
		} catch (error) {
			console.error('Error updating user:', error)
			return undefined
		}
	}

	deleteUser(id: string): boolean {
		try {
			const result = this.deleteUserStatement.run({ id: id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting user:', error)
			return false
		}
	}
}