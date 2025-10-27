import { describe, expect, test, beforeEach, afterEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { CacheService } from './cache'
import { createTestDatabase } from '../db/test-helpers'

describe('CacheService', () => {
	let db: Database
	let cacheService: CacheService

	beforeEach(() => {
		// Create a fresh database for each test since cache tests need isolation
		db = createTestDatabase()
		cacheService = new CacheService(db)
	})

	afterEach(() => {
		db.close()
	})

	test('should cache and retrieve values', async () => {
		const key = 'test-key'
		const value = { data: 'test-value' }

		// First call should fetch fresh value
		const result1 = await cacheService.cachify({
			key,
			getFreshValue: async () => value,
			ttl: 1000
		})

		expect(result1).toEqual(value)

		// Second call should return cached value
		let freshValueCalled = false
		const result2 = await cacheService.cachify({
			key,
			getFreshValue: async () => {
				freshValueCalled = true
				return { data: 'new-value' }
			},
			ttl: 1000
		})

		expect(result2).toEqual(value)
		expect(freshValueCalled).toBe(false)
	})

	test('should support stale-while-revalidate', async () => {
		const key = 'swr-test'
		let callCount = 0
		const getFreshValue = async () => {
			callCount++
			return { data: `value-${callCount}` }
		}

		// Initial call
		const result1 = await cacheService.cachify({
			key,
			getFreshValue,
			ttl: 50, // Expires in 50ms
			swr: 1000 // Stale for 1 second
		})

		expect(result1).toEqual({ data: 'value-1' })
		expect(callCount).toBe(1)

		// Wait for TTL to expire but within SWR window
		await new Promise((resolve) => setTimeout(resolve, 100))

		// This should return stale value immediately and trigger background refresh
		const result2 = await cacheService.cachify({
			key,
			getFreshValue,
			ttl: 50,
			swr: 1000
		})

		// Should return stale value
		expect(result2).toEqual({ data: 'value-1' })

		// Wait a bit for background refresh
		await new Promise((resolve) => setTimeout(resolve, 50))

		// Next call should get the fresh value
		const result3 = await cacheService.cachify({
			key,
			getFreshValue,
			ttl: 50,
			swr: 1000
		})

		expect(result3).toEqual({ data: 'value-2' })
	})

	test('should cleanup expired entries', async () => {
		// Add some entries with short TTL
		await cacheService.cachify({
			key: 'expire-1',
			getFreshValue: async () => ({ data: 'test1' }),
			ttl: 50
		})

		await cacheService.cachify({
			key: 'expire-2',
			getFreshValue: async () => ({ data: 'test2' }),
			ttl: 50
		})

		// Add one with longer TTL
		await cacheService.cachify({
			key: 'keep',
			getFreshValue: async () => ({ data: 'keep-me' }),
			ttl: 10000
		})

		// Wait for short TTL to expire
		await new Promise((resolve) => setTimeout(resolve, 100))

		// Run cleanup
		cacheService.cleanup()

		// Check that expired entries are gone
		const adapter = cacheService.getCacheAdapter()
		expect(adapter.get('expire-1')).toBeUndefined()
		expect(adapter.get('expire-2')).toBeUndefined()
		expect(adapter.get('keep')).toBeDefined()
	})

	test('should delete cache entries via adapter', async () => {
		const key = 'delete-test'

		// Add a cached value
		await cacheService.cachify({
			key,
			getFreshValue: async () => ({ data: 'test' }),
			ttl: 10000
		})

		const adapter = cacheService.getCacheAdapter()

		// Verify it exists
		expect(adapter.get(key)).toBeDefined()

		// Delete it
		adapter.delete(key)

		// Verify it's gone
		expect(adapter.get(key)).toBeUndefined()
	})
})
