import { Database } from 'bun:sqlite'
import fs from 'fs'
import path from 'path'

// Static import for schema
import schemaSQL from './schema/schema.sql?raw'

// Static imports for views
import viewCollectionsSQL from './views/collections.sql?raw'
import viewContentSQL from './views/content.sql?raw'
import viewContentWithAuthorsSQL from './views/content_with_authors.sql?raw'

// Static imports for triggers
import triggerInteractionsSQL from './triggers/interactions.sql?raw'
import triggerModerationQueueSQL from './triggers/move_from_moderation_queue.sql?raw'
import triggerContentSQL from './triggers/content.sql?raw'

import { DB_PATH } from '$env/static/private'
import { MigrationRunner } from './migrations'

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true })
}

export const db = new Database(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

const execute_sql = (sql: string, source: string, db: Database) => {
	try {
		db.exec(sql)
		console.log(`Successfully executed SQL from ${source}`)
	} catch (sqlError) {
		console.error(`Error executing SQL from ${source}:`, sqlError)
	}
}

export const initiate_db = async () => {
	console.log('Initiating database...')

	// Execute schema SQL
	execute_sql(schemaSQL, 'schema.sql', db)

	// Execute view SQLs
	execute_sql(viewCollectionsSQL, 'views/collections.sql', db)
	execute_sql(viewContentSQL, 'views/content.sql', db)
	execute_sql(viewContentWithAuthorsSQL, 'views/content_with_authors.sql', db)

	// Execute trigger SQLs
	execute_sql(triggerInteractionsSQL, 'triggers/interactions.sql', db)
	execute_sql(triggerModerationQueueSQL, 'triggers/move_from_moderation_queue.sql', db)
	execute_sql(triggerContentSQL, 'triggers/content.sql', db)

	// Run database migrations
	const migrationRunner = new MigrationRunner(db)
	await migrationRunner.runMigrations()

	console.log('Database initialization completed.')
}
