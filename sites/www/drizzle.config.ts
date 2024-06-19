import { defineConfig } from 'drizzle-kit'
export default defineConfig({
    schema: "./scr/lib/server/db/schema.ts",
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:./local.db'
    },
    verbose: true
})