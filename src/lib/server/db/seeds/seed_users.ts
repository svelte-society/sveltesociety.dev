import type Database from 'bun:sqlite'

export function seedUsers(db: Database.Database) {
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
		const moderatorRole = findRoleStmt.get('Moderator') as { id: number }
		const memberRole = findRoleStmt.get('Member') as { id: number }

		if (!adminRole || !moderatorRole || !memberRole) {
			throw new Error('Required roles not found. Make sure to run seedRoles first.')
		}

		const githubProvider = findGithubProviderStmt.get('github') as { id: number }
		if (!githubProvider) {
			throw new Error(
				'GitHub OAuth provider not found. Make sure the schema is properly initialized.'
			)
		}

		const users = [
			{
				username: 'kevmodrome',
				name: 'Kevin Åberg Kultalahti',
				avatar_url: 'https://avatars.githubusercontent.com/u/534488?v=4',
				bio: 'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
				location: 'Sweden',
				twitter: 'kevmodrome',
				role: adminRole.id,
				githubId: 534488
			},
			{
				username: 'rich_harris',
				name: 'Rich Harris',
				avatar_url: 'https://avatars.githubusercontent.com/u/1162160?v=4',
				bio: 'Creator of Svelte and SvelteKit. Tech lead at Vercel.',
				location: 'New York, USA',
				twitter: 'Rich_Harris',
				role: adminRole.id,
				githubId: 1162160
			},
			{
				username: 'antony',
				name: 'Antony',
				avatar_url: 'https://avatars.githubusercontent.com/u/12506380?v=4',
				bio: 'Svelte maintainer and community contributor.',
				location: 'London, UK',
				twitter: 'antony',
				role: moderatorRole.id,
				githubId: 12506380
			},
			{
				username: 'pngwn',
				name: 'pngwn',
				avatar_url: 'https://avatars.githubusercontent.com/u/12937446?v=4',
				bio: 'Developer working on Svelte ecosystem tools.',
				location: 'Bristol, UK',
				twitter: 'evilpingwin',
				role: moderatorRole.id,
				githubId: 12937446
			},
			{
				username: 'testuser',
				name: 'Test User',
				avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
				bio: 'A test user for development purposes.',
				location: 'Test City',
				twitter: 'testuser',
				role: memberRole.id,
				githubId: 9919
			}
		]

		const now = new Date().toISOString()

		users.forEach((userData, index) => {
			const githubProfile = {
				id: userData.githubId,
				login: userData.username,
				name: userData.name,
				avatar_url: userData.avatar_url,
				bio: userData.bio,
				location: userData.location,
				twitter_username: userData.twitter
			}

			const user = insertUserStmt.get(
				null, // email
				userData.username,
				userData.name,
				userData.avatar_url,
				userData.bio,
				userData.location,
				userData.twitter,
				userData.role,
				new Date(Date.now() + index * 1000).toISOString() // Slightly different timestamps
			) as { id: string }

			// Insert OAuth connection
			insertOAuthStmt.run(
				user.id,
				githubProvider.id,
				userData.githubId.toString(),
				JSON.stringify(githubProfile),
				now
			)
		})

		console.log('Users seeded successfully')
	} catch (error) {
		console.error('Error seeding users:', error)
	}
}
