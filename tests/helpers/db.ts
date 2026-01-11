import { Database } from 'bun:sqlite'

const TEST_DB_PATH = 'test.db'

/**
 * Database helper utilities for E2E tests.
 *
 * IMPORTANT: These helpers should be used primarily for:
 * - Test setup (inserting data before tests)
 * - Test teardown (cleaning up after tests)
 * - Debugging (investigating test failures)
 * - Verifying non-visible state (e.g., draft content permissions)
 *
 * AVOID using DB queries for primary test assertions. Instead, test what users see:
 * ✅ Good: await expect(page.locator('h1')).toContainText('Published')
 * ❌ Bad:  expect(queryOne('SELECT status FROM content')).toBe('published')
 *
 * E2E tests should validate the user experience through the UI, not the database.
 */

/**
 * Opens a connection to the test database.
 * @returns Database instance connected to test.db
 * @example
 * const db = openTestDatabase()
 * const users = db.query('SELECT * FROM users').all()
 * db.close()
 */
export function openTestDatabase(): Database {
	const db = new Database(TEST_DB_PATH)
	db.exec('PRAGMA journal_mode = WAL')
	db.exec('PRAGMA foreign_keys = ON')
	return db
}

/**
 * Executes a query against the test database and returns all results.
 * @param sql - SQL query to execute
 * @param params - Query parameters (optional)
 * @returns Array of result rows
 * @example
 * const users = await query('SELECT * FROM users WHERE role = ?', ['admin'])
 */
export function query<T = any>(sql: string, params: any[] = []): T[] {
	const db = openTestDatabase()
	try {
		const stmt = db.query(sql)
		return stmt.all(...params) as T[]
	} finally {
		db.close()
	}
}

/**
 * Executes a query that returns a single row.
 * @param sql - SQL query to execute
 * @param params - Query parameters (optional)
 * @returns Single result row or null
 * @example
 * const user = await queryOne('SELECT * FROM users WHERE id = ?', ['user_123'])
 */
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
	const db = openTestDatabase()
	try {
		const stmt = db.query(sql)
		return (stmt.get(...params) as T) || null
	} finally {
		db.close()
	}
}

/**
 * Executes a SQL statement (INSERT, UPDATE, DELETE) against the test database.
 * @param sql - SQL statement to execute
 * @param params - Statement parameters (optional)
 * @returns Number of affected rows
 * @example
 * exec('DELETE FROM content WHERE status = ?', ['draft'])
 */
export function exec(sql: string, params: any[] = []): number {
	const db = openTestDatabase()
	try {
		const stmt = db.query(sql)
		const result = stmt.run(...params)
		return result.changes
	} finally {
		db.close()
	}
}

/**
 * Inserts a row into the specified table.
 * @param table - Table name
 * @param data - Object with column names and values
 * @returns ID of inserted row (if applicable)
 * @example
 * insert('users', { id: 'test_123', email: 'test@example.com', username: 'test' })
 */
export function insert(table: string, data: Record<string, any>): void {
	const columns = Object.keys(data)
	const placeholders = columns.map(() => '?').join(', ')
	const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
	exec(sql, Object.values(data))
}

/**
 * Clears all rows from the specified table.
 * @param table - Table name to clear
 * @example
 * clearTable('content')
 */
export function clearTable(table: string): void {
	exec(`DELETE FROM ${table}`)
}

/**
 * Clears all rows from multiple tables.
 * Useful for cleaning up test data between tests.
 * @param tables - Array of table names to clear
 * @example
 * clearTables(['content', 'saves', 'sessions'])
 */
export function clearTables(tables: string[]): void {
	const db = openTestDatabase()
	try {
		db.exec('PRAGMA foreign_keys = OFF')
		for (const table of tables) {
			db.run(`DELETE FROM ${table}`)
		}
		db.exec('PRAGMA foreign_keys = ON')
	} finally {
		db.close()
	}
}

/**
 * Gets the count of rows in a table matching the condition.
 * @param table - Table name
 * @param where - WHERE clause (optional)
 * @param params - Query parameters for WHERE clause (optional)
 * @returns Number of matching rows
 * @example
 * const draftCount = count('content', 'status = ?', ['draft'])
 */
export function count(table: string, where?: string, params: any[] = []): number {
	const sql = where
		? `SELECT COUNT(*) as count FROM ${table} WHERE ${where}`
		: `SELECT COUNT(*) as count FROM ${table}`
	const result = queryOne<{ count: number }>(sql, params)
	return result?.count || 0
}
