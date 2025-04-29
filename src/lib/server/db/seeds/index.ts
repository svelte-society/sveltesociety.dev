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

export function run_seeds() {
	try {
		// Run seeds in order
		seedRoles(db)
		seedOAuthProviders(db)
		seedTags(db)
		seedUsers(db)
		seedContent(db)
		seedInteractions(db)
		seedModerationQueue(db)

		console.log('All seeds completed successfully')
	} catch (error) {
		console.error('Error running seeds:', error)
	} finally {
		// db.close()
	}
}
