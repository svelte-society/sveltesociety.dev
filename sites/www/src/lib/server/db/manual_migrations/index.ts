import { sql } from 'drizzle-orm';
import { config } from 'dotenv';

import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../schema'

config({
  path: '.env.development'
});

export const db = drizzle(createClient({
  url: process.env.TURSO_DATABASE_URL as string,
}), { schema })

export async function up_likes(db: any) {
  // Drop existing triggers if any
  await db.run(sql`DROP TRIGGER IF EXISTS increment_likes;`);
  await db.run(sql`DROP TRIGGER IF EXISTS decrement_likes;`);

  // Create triggers for like tables
  await db.run(sql`
    CREATE TRIGGER IF NOT EXISTS increment_likes
    AFTER INSERT ON likes
    BEGIN
      UPDATE content SET likes = likes + 1 WHERE id = NEW.target_id;
    END;
  `);

  // Create a single, generic trigger for decrementing likes with error logging
  await db.run(sql`
    CREATE TRIGGER IF NOT EXISTS decrement_likes
    AFTER DELETE ON likes
    BEGIN
      UPDATE content SET likes = likes - 1 WHERE id = OLD.target_id;
    END;
  `);
}

export async function down_likes(db: any) {
  // Remove triggers
  await db.run(sql`DROP TRIGGER IF EXISTS increment_likes`);
  await db.run(sql`DROP TRIGGER IF EXISTS decrement_likes`);
}

// Add this to sites/www/src/lib/server/db/manual_migrations/index.ts

async function up_saves(db: any) {
  // Drop existing triggers if any
  await db.run(sql`DROP TRIGGER IF EXISTS increment_saves;`);
  await db.run(sql`DROP TRIGGER IF EXISTS decrement_saves;`);

  // Create triggers for save tables
  await db.run(sql`
    CREATE TRIGGER IF NOT EXISTS increment_saves
    AFTER INSERT ON saves
    BEGIN
      UPDATE content SET saves = saves + 1 WHERE id = NEW.target_id;
    END;
  `);

  // Create a single, generic trigger for decrementing saves
  await db.run(sql`
    CREATE TRIGGER IF NOT EXISTS decrement_saves
    AFTER DELETE ON saves
    BEGIN
      UPDATE content SET saves = saves - 1 WHERE id = OLD.target_id;
    END;
  `);
}

async function down_saves(db: any) {
  // Remove triggers
  await db.run(sql`DROP TRIGGER IF EXISTS increment_saves`);
  await db.run(sql`DROP TRIGGER IF EXISTS decrement_saves`);
}

export async function up_fts(db: any) {
  // Create the FTS table if it doesn't exist
  await db.run(sql`
      CREATE VIRTUAL TABLE content_fts USING fts5(
        content_id UNINDEXED,  -- Remove UNINDEXED to allow searching by ID if needed
        title, 
        body, 
        description
      );
  `);

  // Insert Trigger
  await db.run(sql`
    CREATE TRIGGER content_ai AFTER INSERT ON content BEGIN
      INSERT INTO content_fts(content_id, title, body, description)
      VALUES (NEW.id, NEW.title, NEW.body, NEW.description);
    END;
  `);

  // Update Trigger
  await db.run(sql`
    CREATE TRIGGER content_au AFTER UPDATE ON content BEGIN
      UPDATE content_fts
      SET title = NEW.title,
          body = NEW.body,
          description = NEW.description
      WHERE content_id = NEW.id;
    END;
  `);

  // Delete Trigger
  await db.run(sql`
    CREATE TRIGGER content_ad AFTER DELETE ON content BEGIN
      DELETE FROM content_fts WHERE content_id = OLD.id;
    END;
  `);
}

export async function down_fts(db: any) {
  // Remove triggers
  await db.run(sql`DROP TRIGGER IF EXISTS content_ai`);
  await db.run(sql`DROP TRIGGER IF EXISTS content_au`);
  await db.run(sql`DROP TRIGGER IF EXISTS content_ad`);

  // Remove FTS table
  await db.run(sql`DROP TABLE IF EXISTS content_fts`);
}

up_fts(db)
up_likes(db)
up_saves(db)