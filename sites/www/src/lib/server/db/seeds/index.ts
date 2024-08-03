
import { seedTags } from "./seed_tags"
import { seedRoles } from "./seed_roles"
import { seedContent } from "./seed_content"
import { seedUsers } from "./seed_users";
import { seedInteractions } from "./seed_interactions";

import Database from 'better-sqlite3';
import { seedModerationQueue } from "./seed_moderation_queue";

export const db = new Database('local.db')
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

async function runSeeds() {
    try {
        // Run seeds in order
        await seedRoles(db);
        await seedTags(db);
        await seedUsers(db);
        await seedContent(db);
        await seedInteractions(db);
        await seedModerationQueue(db);

        console.log('All seeds completed successfully');
    } catch (error) {
        console.error('Error running seeds:', error);
    } finally {
        // Close the database connection
        db.close();
    }
}

// Run the seeding process
runSeeds();