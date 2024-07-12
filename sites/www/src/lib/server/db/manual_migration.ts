// Needed because Drizzle does not support creating virtual tables for FTS5 yet.

import { sql } from 'drizzle-orm';
import { config } from 'dotenv';

import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

config({
  path: '.env.development'
});

export const db = drizzle(createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN,
}), { schema })

export async function up(db: any) {
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

export async function down(db: any) {
  // Remove triggers
  await db.run(sql`DROP TRIGGER IF EXISTS content_ai`);
  await db.run(sql`DROP TRIGGER IF EXISTS content_au`);
  await db.run(sql`DROP TRIGGER IF EXISTS content_ad`);

  // Remove FTS table
  await db.run(sql`DROP TABLE IF EXISTS content_fts`);
}

up(db)