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
  // Create triggers for like tables
  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS increment_content_likes
      AFTER INSERT ON likes
      WHEN NEW.content_id IS NOT NULL
      BEGIN
        UPDATE content SET likes = likes + 1 WHERE id = NEW.content_id;
      END;
    `);

  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS decrement_content_likes
      AFTER DELETE ON likes
      WHEN OLD.content_id IS NOT NULL
      BEGIN
        UPDATE content SET likes = likes - 1 WHERE id = OLD.content_id;
      END;
    `);

  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS increment_collection_likes
      AFTER INSERT ON likes
      WHEN NEW.collection_id IS NOT NULL
      BEGIN
        UPDATE collections SET likes = likes + 1 WHERE id = NEW.collection_id;
      END;
    `);

  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS decrement_collection_likes
      AFTER DELETE ON likes
      WHEN OLD.collection_id IS NOT NULL
      BEGIN
        UPDATE collections SET likes = likes - 1 WHERE id = OLD.collection_id;
      END;
    `);

}

export async function down_likes(db: any) {
  // Remove triggers
  await db.run(sql`DROP TRIGGER IF EXISTS increment_content_likes`);
  await db.run(sql`DROP TRIGGER IF EXISTS decrement_content_likes`);
  await db.run(sql`DROP TRIGGER IF EXISTS increment_collection_likes`);
  await db.run(sql`DROP TRIGGER IF EXISTS decrement_collection_likes`);
}

export async function up_fts(db: any) {
  // Create the FTS table if it doesn't exist
  await db.run(sql`
      CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
        id UNINDEXED,
        title,
        body,
        description,
        content='content'
      )
    `);

  // Trigger for INSERT
  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS content_ai AFTER INSERT ON content BEGIN
        INSERT INTO content_fts(id, title, body, description)
        VALUES (new.id, new.title, new.body, new.description);
      END;
    `);

  // Trigger for UPDATE
  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS content_au AFTER UPDATE ON content BEGIN
        UPDATE content_fts
        SET title = new.title,
            body = new.body,
            description = new.description
        WHERE id = old.id;
      END;
    `);

  // Trigger for DELETE
  await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS content_ad AFTER DELETE ON content BEGIN
        DELETE FROM content_fts WHERE id = old.id;
      END;
    `);

  // Populate the FTS table with existing content
  await db.run(sql`
      INSERT OR IGNORE INTO content_fts(id, title, body, description)
      SELECT id, title, body, description FROM content
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