
import { seedTags } from "./seed_tags"
import { seedRoles } from "./seed_roles"

import { config } from 'dotenv';

import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../schema'

config({
    path: '.env.development'
});

export const db = drizzle(createClient({
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN,
}), { schema })

await seedTags(db)
await seedRoles(db)