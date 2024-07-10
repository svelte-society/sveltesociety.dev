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
  await db.run(sql`
      CREATE VIRTUAL TABLE content_fts USING fts5(
        id, title, body, description, content='content', content_rowid='id'
      )
    `);

  // Populate the FTS table with existing content
  await db.run(sql`
      INSERT INTO content_fts (id, title, body, description)
      SELECT id, title, body, description FROM content
    `);
}

export async function down(db: any) {
  await db.run(sql`DROP TABLE content_fts`);
}

up(db)