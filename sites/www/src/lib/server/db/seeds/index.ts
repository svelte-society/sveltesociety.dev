import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import { seedTags } from "./seed_tags"
import { seedRoles } from "./seed_roles"
import { seedContent } from "./seed_content"
import { seedUsers } from "./seed_users";
import { seedInteractions } from "./seed_interactions";
import { seedModerationQueue } from "./seed_moderation_queue";

const db = new Database(process.env.DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')



export function run_seeds() {
    try {
        // Run seeds in order
        seedRoles(db);
        seedTags(db);
        seedUsers(db);
        seedContent(db);
        seedInteractions(db);
        seedModerationQueue(db);

        console.log('All seeds completed successfully');
    } catch (error) {
        console.error('Error running seeds:', error);
    } finally {
        // Close the database connection
        db.close();
    }
}

run_seeds()