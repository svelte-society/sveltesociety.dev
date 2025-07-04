import { Database } from 'bun:sqlite'
import { seedContent } from './seed_content'
import { seedInteractions } from './seed_interactions'
import { seedModerationQueue } from './seed_moderation_queue'
import { seedRoles } from './seed_roles'
import { seedTags } from './seed_tags'
import { seedUsers } from './seed_users'
import { seedOAuthProviders } from './seed_oauth_providers'
import { DB_PATH } from '$env/static/private'

export const db = new Database(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

export function run_seeds(mode: string = 'full') {
	try {
		// Always seed roles and OAuth providers as they're essential
		seedRoles(db)
		seedOAuthProviders(db)

		if (mode === 'minimal') {
			// In minimal mode, only seed kevmodrome user
			seedMinimalUsers(db)
			console.log('Minimal seeds completed (roles + kevmodrome user)')
		} else if (mode === 'full') {
			// Full seeding for development
			seedTags(db)
			seedUsers(db)
			seedContent(db)
			seedInteractions(db)
			seedModerationQueue(db)
			console.log('All seeds completed successfully')
		}
	} catch (error) {
		console.error('Error running seeds:', error)
	} finally {
		// db.close()
	}
}

function seedMinimalUsers(db: Database) {
	const findRoleStmt = db.prepare(`
		SELECT id FROM roles WHERE name = ?
	`)

	const insertUserStmt = db.prepare(`
		INSERT INTO users (email, username, name, avatar_url, bio, location, twitter, role, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		RETURNING id
	`)

	const findGithubProviderStmt = db.prepare(`
		SELECT id FROM oauth_providers WHERE name = ?
	`)

	const insertOAuthStmt = db.prepare(`
		INSERT INTO user_oauth (user_id, provider_id, provider_user_id, profile_data, created_at)
		VALUES (?, ?, ?, ?, ?)
	`)

	try {
		const adminRole = findRoleStmt.get('Admin') as { id: number }
		if (!adminRole) {
			throw new Error('Admin role not found. Make sure to run seedRoles first.')
		}

		const githubProvider = findGithubProviderStmt.get('github') as { id: number }
		if (!githubProvider) {
			throw new Error('GitHub OAuth provider not found.')
		}

		// Only seed kevmodrome user
		const kevmodrome = {
			username: 'kevmodrome',
			name: 'Kevin Åberg Kultalahti',
			avatar_url: 'https://avatars.githubusercontent.com/u/534488?v=4',
			bio: 'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
			location: 'Sweden',
			twitter: 'kevmodrome',
			role: adminRole.id,
			githubId: 534488
		}

		const githubProfile = {
			id: kevmodrome.githubId,
			login: kevmodrome.username,
			name: kevmodrome.name,
			avatar_url: kevmodrome.avatar_url,
			bio: kevmodrome.bio,
			location: kevmodrome.location,
			twitter_username: kevmodrome.twitter
		}

		const user = insertUserStmt.get(
			null, // email
			kevmodrome.username,
			kevmodrome.name,
			kevmodrome.avatar_url,
			kevmodrome.bio,
			kevmodrome.location,
			kevmodrome.twitter,
			kevmodrome.role,
			new Date().toISOString()
		) as { id: string }

		// Insert OAuth connection
		insertOAuthStmt.run(
			user.id,
			githubProvider.id,
			kevmodrome.githubId.toString(),
			JSON.stringify(githubProfile),
			new Date().toISOString()
		)

		console.log('Minimal users seeded successfully (kevmodrome only)')
	} catch (error) {
		console.error('Error seeding minimal users:', error)
	}
}
