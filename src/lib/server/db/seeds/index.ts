import { Database } from 'bun:sqlite'
import { seedContent } from './seed_content'
import { seedInteractions } from './seed_interactions'
// import { seedContent } from './seed_large_amounts_of_content'
import { seedModerationQueue } from './seed_moderation_queue'
import { seedRoles } from './seed_roles'
import { seedTags } from './seed_tags'
import { seedTestSession } from './seed_test_session'
import { seedUsers } from './seed_users'
import { seedOAuthProviders } from './seed_oauth_providers'

import { config } from './utils'

const db = new Database(config.DB_PATH)
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

		// if (config.NODE_ENV === 'test') {
		// 	seedTestSession(db)
		// }

		// // Seed event data
		// seedEventUserEvents(event_db)

		console.log('All seeds completed successfully')
	} catch (error) {
		console.error('Error running seeds:', error)
	} finally {
		// Close the database connection
		// db.close()
	}
}

run_seeds()
