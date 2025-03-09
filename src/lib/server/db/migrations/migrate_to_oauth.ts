import { Database } from 'bun:sqlite';
import { config } from '$lib/server/db/seeds/utils';

/**
 * Migration script to move from the old schema (with github_id in users table)
 * to the new schema (with separate oauth table)
 */
async function migrateToOAuthSchema() {
  console.log('Starting migration to OAuth schema...');
  
  // Connect to the database
  const db = new Database(config.DB_PATH);
  
  try {
    // Start a transaction
    db.exec('BEGIN TRANSACTION');
    
    // 1. Create the new tables if they don't exist
    console.log('Creating new tables...');
    db.exec(`
      -- OAuth Providers table
      CREATE TABLE IF NOT EXISTS oauth_providers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          active BOOLEAN NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- User OAuth table - links users to their OAuth accounts
      CREATE TABLE IF NOT EXISTS user_oauth (
          id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
          user_id TEXT NOT NULL,
          provider_id INTEGER NOT NULL,
          provider_user_id TEXT NOT NULL,
          access_token TEXT,
          refresh_token TEXT,
          token_expires_at TIMESTAMP,
          profile_data JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (provider_id) REFERENCES oauth_providers(id),
          UNIQUE(provider_id, provider_user_id)
      );

      -- Create index for faster OAuth lookups
      CREATE INDEX IF NOT EXISTS idx_user_oauth_user_id ON user_oauth(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_oauth_provider ON user_oauth(provider_id, provider_user_id);
    `);
    
    // 2. Insert GitHub as an OAuth provider
    console.log('Adding GitHub OAuth provider...');
    db.exec(`
      INSERT OR IGNORE INTO oauth_providers (name, description, active) 
      VALUES ('github', 'GitHub OAuth Provider', 1)
    `);
    
    // 3. Get the GitHub provider ID
    const providerResult = db.prepare(`
      SELECT id FROM oauth_providers WHERE name = 'github'
    `).get() as { id: number };
    
    if (!providerResult) {
      throw new Error('Failed to get GitHub provider ID');
    }
    
    const githubProviderId = providerResult.id;
    
    // 4. Migrate existing users with github_id to the new oauth table
    console.log('Migrating existing users to OAuth table...');
    const usersWithGithubId = db.prepare(`
      SELECT id, github_id FROM users WHERE github_id IS NOT NULL
    `).all() as { id: string, github_id: number }[];
    
    for (const user of usersWithGithubId) {
      console.log(`Migrating user ${user.id} with GitHub ID ${user.github_id}...`);
      
      // Insert into user_oauth table
      db.prepare(`
        INSERT INTO user_oauth (
          user_id, 
          provider_id, 
          provider_user_id, 
          profile_data
        )
        VALUES (?, ?, ?, ?)
      `).run(
        user.id,
        githubProviderId,
        user.github_id.toString(),
        JSON.stringify({ id: user.github_id })
      );
    }
    
    // 5. Create a backup of the users table
    console.log('Creating backup of users table...');
    db.exec(`
      CREATE TABLE users_backup AS SELECT * FROM users;
    `);
    
    // 6. Commit the transaction
    db.exec('COMMIT');
    console.log('Migration completed successfully!');
    
    // 7. Provide instructions for removing the github_id column
    console.log('\nTo complete the migration, you may want to remove the github_id column from the users table.');
    console.log('This requires recreating the table without the column. Here\'s how:');
    console.log(`
    -- Run these commands manually after verifying the migration was successful:
    
    BEGIN TRANSACTION;
    
    -- Create a new users table without the github_id column
    CREATE TABLE users_new (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        name TEXT,
        avatar_url TEXT,
        bio TEXT,
        location TEXT,
        twitter TEXT,
        role INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role) REFERENCES roles(id)
    );
    
    -- Copy data from the old table to the new one
    INSERT INTO users_new (id, email, username, name, avatar_url, bio, location, twitter, role, created_at)
    SELECT id, email, username, name, avatar_url, bio, location, twitter, role, created_at FROM users;
    
    -- Drop the old table and rename the new one
    DROP TABLE users;
    ALTER TABLE users_new RENAME TO users;
    
    COMMIT;
    `);
    
  } catch (error) {
    // Rollback on error
    db.exec('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    // Close the database connection
    db.close();
  }
}

// Run the migration if this file is executed directly
if (import.meta.main) {
  migrateToOAuthSchema().catch(console.error);
}

migrateToOAuthSchema()

export { migrateToOAuthSchema }; 