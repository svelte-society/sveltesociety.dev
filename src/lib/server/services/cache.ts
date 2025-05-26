import type { Database } from 'bun:sqlite'
import { cachified, type CacheEntry } from '@epic-web/cachified'

export class CacheService {
	constructor(private db: Database) {}

	private get(key: string): CacheEntry<unknown> | undefined {
		const stmt = this.db.prepare('SELECT value, metadata, created_at FROM cache WHERE key = ?')
		const row = stmt.get(key) as
			| { value: string; metadata: string | null; created_at: number }
			| undefined

		if (!row) return undefined

		try {
			return {
				value: JSON.parse(row.value),
				metadata: row.metadata ? JSON.parse(row.metadata) : {}
			}
		} catch {
			return undefined
		}
	}

	private set(key: string, entry: CacheEntry<unknown>): void {
		const stmt = this.db.prepare(
			'INSERT OR REPLACE INTO cache (key, value, metadata, created_at, ttl) VALUES (?, ?, ?, ?, ?)'
		)

		const metadata = entry.metadata || {}
		const ttl = metadata.ttl || metadata.swr || null

		stmt.run(key, JSON.stringify(entry.value), JSON.stringify(metadata), Date.now(), ttl)
	}

	private delete(key: string): void {
		const stmt = this.db.prepare('DELETE FROM cache WHERE key = ?')
		stmt.run(key)
	}

	// Clean up expired entries
	cleanup(): void {
		const now = Date.now()
		const stmt = this.db.prepare('DELETE FROM cache WHERE ttl IS NOT NULL AND created_at + ttl < ?')
		stmt.run(now)
	}

	// Get the cache adapter for cachified
	getCacheAdapter() {
		return {
			get: this.get.bind(this),
			set: this.set.bind(this),
			delete: this.delete.bind(this)
		}
	}

	// Helper method to create a cachified wrapper with common options
	async cachify<T>(options: {
		key: string
		getFreshValue: () => Promise<T>
		ttl?: number // Time to live in milliseconds
		swr?: number // Stale while revalidate in milliseconds
	}): Promise<T> {
		// Run cleanup occasionally (1% chance)
		if (Math.random() < 0.01) {
			this.cleanup()
		}

		return cachified({
			cache: this.getCacheAdapter(),
			key: options.key,
			getFreshValue: options.getFreshValue,
			ttl: options.ttl,
			swr: options.swr,
			// Fallback to in-memory cache if DB operations fail
			fallbackToCache: true
		})
	}
}
