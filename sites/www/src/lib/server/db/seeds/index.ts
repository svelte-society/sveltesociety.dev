
import { seedTags } from "./seed_tags"
import { seedRoles } from "./seed_roles"
import { seedContent } from "./seed_content"
import { seed_users } from "./seed_users";

import { config } from 'dotenv';

import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../schema'

config({
    path: '.env.development'
});

export const db = drizzle(createClient({
    url: process.env.TURSO_DATABASE_URL as string
}), { schema })

await seedTags(db)
await seedRoles(db)
await seed_users(db)
await seedContent(db)