import type Database from 'bun:sqlite'

export function seedUsers(db: Database.Database) {
	const findAdminRoleStmt = db.prepare(`
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
		const adminRole = findAdminRoleStmt.get('Admin') as { id: number }
		if (!adminRole) {
			throw new Error('Admin role not found. Make sure to run seedRoles first.')
		}

		const githubProvider = findGithubProviderStmt.get('github') as { id: number }
		if (!githubProvider) {
			throw new Error('GitHub OAuth provider not found. Make sure the schema is properly initialized.')
		}

		// Insert user
		const now = new Date(1721331895712).toISOString()
		const githubId = 534488
		const githubProfile = {
			id: githubId,
			login: 'kevmodrome',
			name: 'Kevin Åberg Kultalahti',
			avatar_url: 'https://avatars.githubusercontent.com/u/534488?v=4',
			bio: 'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
			location: 'Sweden',
			twitter_username: 'kevmodrome'
		}

		const user = insertUserStmt.get(
			null, // email
			'kevmodrome',
			'Kevin Åberg Kultalahti',
			'https://avatars.githubusercontent.com/u/534488?v=4',
			'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
			'Sweden',
			'kevmodrome',
			adminRole.id,
			now
		) as { id: string }

		// Insert OAuth connection
		insertOAuthStmt.run(
			user.id,
			githubProvider.id,
			githubId.toString(),
			JSON.stringify(githubProfile),
			now
		)

		console.log('Users seeded successfully')
	} catch (error) {
		console.error('Error seeding users:', error)
	}
}
