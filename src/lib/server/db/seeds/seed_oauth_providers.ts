import type Database from 'bun:sqlite'

type Provider = {
	name: string;
	description: string;
	active: boolean;
};

export function seedOAuthProviders(db: Database.Database) {
	const insertProviderStmt = db.prepare(`
      INSERT OR IGNORE INTO oauth_providers (name, description, active)
      VALUES (?, ?, ?)
    `)

	const providers: Provider[] = [
		{
			name: 'github',
			description: 'GitHub OAuth Provider',
			active: true
		},
		{
			name: 'google',
			description: 'Google OAuth Provider',
			active: false
		},
		{
			name: 'twitter',
			description: 'Twitter OAuth Provider',
			active: false
		}
	]

	const insertProvidersTransaction = db.transaction((providers: Provider[]) => {
		for (const provider of providers) {
			insertProviderStmt.run(provider.name, provider.description, provider.active ? 1 : 0)
		}
	})

	try {
		insertProvidersTransaction(providers)
		console.log('OAuth providers seeded successfully')
	} catch (error) {
		console.error('Error seeding OAuth providers:', error)
	}
} 