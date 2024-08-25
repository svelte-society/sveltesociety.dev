import { Database as DuckDB } from 'duckdb-async';
import Database from 'better-sqlite3';
import { seedTags } from './seed_tags';
import { seedRoles } from './seed_roles';
import { seedContent } from './seed_content';
import { seedUsers } from './seed_users';
import { seedInteractions } from './seed_interactions';
import { seedModerationQueue } from './seed_moderation_queue';
import { seedTestSession } from './seed_test_session';

import { seedEventUserEvents } from './seed_event_db';
import { config } from '$lib/server/db/seeds/utils';

const db = new Database(config.DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export const event_db = await DuckDB.create(config.EVENT_DB_PATH);

export function run_seeds() {
	try {
		// Run seeds in order
		seedRoles(db);
		seedTags(db);
		seedUsers(db);
		seedContent(db);
		seedInteractions(db);
		seedModerationQueue(db);

		if (config.NODE_ENV === 'test') {
			seedTestSession(db);
		}

		// Seed event data
		seedEventUserEvents(event_db);

		console.log('All seeds completed successfully');
	} catch (error) {
		console.error('Error running seeds:', error);
	} finally {
		// Close the database connection
		db.close();
	}
}

run_seeds();
