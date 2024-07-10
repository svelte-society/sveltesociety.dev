import { config } from 'dotenv';

config({
    path: '.env.development'
});

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL as string
    },
    verbose: true
})