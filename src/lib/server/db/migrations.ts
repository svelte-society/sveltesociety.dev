import { Database } from 'bun:sqlite'
import fs from 'fs'
import path from 'path'

interface Migration {
	version: number
	name: string
	sql: string
}

export class MigrationRunner {
	private db: Database
	private migrationsDir: string

	constructor(db: Database, migrationsDir?: string) {
		this.db = db
		this.migrationsDir = migrationsDir || path.join(process.cwd(), 'src/lib/server/db/migrations')
	}

	private getMigrationFiles(): Migration[] {
		if (!fs.existsSync(this.migrationsDir)) {
			console.log('No migrations directory found')
			return []
		}

		const files = fs
			.readdirSync(this.migrationsDir)
			.filter((file) => file.endsWith('.sql'))
			.sort()

		return files.map((file) => {
			const versionMatch = file.match(/^(\d+)_(.+)\.sql$/)
			if (!versionMatch) {
				throw new Error(`Invalid migration filename: ${file}. Expected format: 001_description.sql`)
			}

			const version = parseInt(versionMatch[1], 10)
			const name = versionMatch[2].replace(/_/g, ' ')
			const sql = fs.readFileSync(path.join(this.migrationsDir, file), 'utf-8')

			return { version, name, sql }
		})
	}

	private getAppliedMigrations(): number[] {
		try {
			const stmt = this.db.prepare('SELECT version FROM migrations ORDER BY version')
			return stmt.all().map((row: any) => row.version)
		} catch (error) {
			// If migrations table doesn't exist yet, return empty array
			return []
		}
	}

	private markMigrationAsApplied(migration: Migration): void {
		const stmt = this.db.prepare(
			'INSERT INTO migrations (version, name, applied_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
		)
		stmt.run(migration.version, migration.name)
	}

	public async runMigrations(): Promise<void> {
		console.log('Running database migrations...')
		const availableMigrations = this.getMigrationFiles()
		const appliedMigrations = this.getAppliedMigrations()
		const pendingMigrations = availableMigrations.filter(
			(migration) => !appliedMigrations.includes(migration.version)
		)
		if (pendingMigrations.length === 0) {
			console.log('No pending migrations')
			return
		}
		console.log(`Found ${pendingMigrations.length} pending migration(s)`)
		for (const migration of pendingMigrations) {
			this.db.run('BEGIN TRANSACTION')
			try {
				console.log(`Applying migration ${migration.version}: ${migration.name}`)

				this.db.run(migration.sql)

				this.markMigrationAsApplied(migration)

				this.db.run('COMMIT')

				console.log(`✓ Migration ${migration.version} applied successfully`)
			} catch (error) {
				// Rollback on error
				this.db.run('ROLLBACK')
				console.error(`✗ Failed to apply migration ${migration.version}:`, error)
				throw error
			}
		}
		console.log('All migrations completed successfully')
	}

	public getMigrationStatus(): Array<{ version: number; name: string; applied: boolean }> {
		const availableMigrations = this.getMigrationFiles()
		const appliedMigrations = this.getAppliedMigrations()

		return availableMigrations.map((migration) => ({
			version: migration.version,
			name: migration.name,
			applied: appliedMigrations.includes(migration.version)
		}))
	}
}
