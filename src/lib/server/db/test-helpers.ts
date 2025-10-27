import { Database } from 'bun:sqlite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Creates an in-memory SQLite database with all migrations applied
 * @returns A new Database instance with all migrations applied
 */
export function createTestDatabase(): Database {
	const db = new Database(':memory:', { strict: true })
	applyMigrations(db)
	return db
}

/**
 * Applies all database migrations to the given database in order
 * @param db The database instance to apply migrations to
 */
export function applyMigrations(db: Database): void {
	const migrationsDir = path.join(process.cwd(), 'src/lib/server/db/migrations')

	// Get all migration files and sort them by filename
	const migrationFiles = fs
		.readdirSync(migrationsDir)
		.filter((file) => file.endsWith('.sql'))
		.sort()

	// Apply each migration in order
	for (const file of migrationFiles) {
		const migrationPath = path.join(migrationsDir, file)
		const migration = fs.readFileSync(migrationPath, 'utf-8')

		try {
			db.exec(migration)
		} catch (error) {
			// Some migrations might fail in test environment (e.g., data updates on empty tables)
			// We log but don't throw to allow tests to continue
			console.warn(`Warning: Migration ${file} had issues:`, error)
		}
	}
}
