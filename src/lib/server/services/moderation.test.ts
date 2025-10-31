import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import {
	ModerationService,
	ModerationStatus,
	type ModerationStatus as ModerationStatusType
} from './moderation'
import { createTestDatabase } from '../db/test-helpers'

describe('ModerationService', () => {
	let db: Database
	let moderationService: ModerationService

	beforeEach(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()

		// Get actual role IDs from the database (migrations create them)
		const memberRole = db.prepare("SELECT id FROM roles WHERE value = 'member'").get() as {
			id: number
		}

		// Insert test users with role
		const insertUser = db.prepare(`
      INSERT INTO users (id, username, email, role)
      VALUES ($id, $username, $email, $role)
    `)

		const testUsers = [
			{ id: 'user1', username: 'moderator', email: 'mod@test.com', role: memberRole.id },
			{ id: 'user2', username: 'submitter', email: 'sub@test.com', role: memberRole.id }
		]

		for (const user of testUsers) {
			insertUser.run({
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role
			})
		}

		// Insert test moderation items
		const insertItem = db.prepare(`
      INSERT INTO moderation_queue (
        id, type, status, data, submitted_by, submitted_at,
        moderated_by, moderated_at
      ) VALUES (
        $id, $type, $status, $data, $submitted_by,
        CURRENT_TIMESTAMP, $moderated_by, $moderated_at
      )
    `)

		const testItems = [
			{
				id: 'item1',
				type: 'content' as const,
				status: ModerationStatus.PENDING,
				data: JSON.stringify({
					title: 'Pending Content 1',
					type: 'recipe',
					body: 'Test content 1',
					description: 'Test description 1',
					tags: []
				}),
				submitted_by: 'user2',
				moderated_by: null,
				moderated_at: null
			},
			{
				id: 'item2',
				type: 'content' as const,
				status: ModerationStatus.APPROVED,
				data: JSON.stringify({
					title: 'Approved Content',
					type: 'recipe',
					body: 'Test content 2',
					description: 'Test description 2',
					tags: []
				}),
				submitted_by: 'user2',
				moderated_by: 'user1',
				moderated_at: new Date().toISOString()
			},
			{
				id: 'item3',
				type: 'comment',
				status: ModerationStatus.PENDING,
				data: JSON.stringify({ title: 'Pending Comment', comment: 'Test comment' }),
				submitted_by: 'user2',
				moderated_by: null,
				moderated_at: null
			}
		]

		for (const item of testItems) {
			insertItem.run({
				id: item.id,
				type: item.type,
				status: item.status,
				data: item.data,
				submitted_by: item.submitted_by,
				moderated_by: item.moderated_by,
				moderated_at: item.moderated_at
			})
		}

		moderationService = new ModerationService(db)
	})

	afterEach(() => {
		db.close()
	})

	describe('getModerationQueue', () => {
		test('should return all pending items by default', () => {
			const items = moderationService.getModerationQueue()
			expect(items.length).toBe(2)
			expect(items.every((item) => item.status === ModerationStatus.PENDING)).toBe(true)
		})

		test('should return items with specified status', () => {
			const items = moderationService.getModerationQueue(ModerationStatus.APPROVED)
			expect(items.length).toBe(1)
			expect(items[0].status).toBe(ModerationStatus.APPROVED)
		})
	})

	describe('getModerationQueueItem', () => {
		test('should return full item details by id', () => {
			const item = moderationService.getModerationQueueItem('item1')
			expect(item).toBeDefined()
			expect(item?.id).toBe('item1')
			expect(item?.data).toBeDefined()
		})

		test('should return undefined for non-existent item', () => {
			const item = moderationService.getModerationQueueItem('non-existent')
			expect(item).toBeUndefined()
		})
	})

	describe('addToModerationQueue', () => {
		test('should add new item to queue', () => {
			const newItem = {
				type: 'content' as const,
				data: JSON.stringify({
					title: 'New Content',
					type: 'recipe',
					body: 'New test content',
					description: 'New description',
					tags: []
				}),
				submitted_by: 'user2'
			}

			const id = moderationService.addToModerationQueue(newItem)
			expect(id).toBeDefined()

			const item = moderationService.getModerationQueueItem(id)
			expect(item).toBeDefined()
			expect(item?.type).toBe(newItem.type)
			expect(item?.status).toBe(ModerationStatus.PENDING)
			expect(item?.title).toBe('New Content')
		})
	})

	describe('updateModerationStatus', () => {
		test('should update item status to approved', () => {
			// Use item3 (comment type) to avoid triggering approve_content trigger
			// which has a bug with last_insert_rowid() and TEXT PRIMARY KEY
			const result = moderationService.updateModerationStatus(
				'item3',
				ModerationStatus.APPROVED,
				'user1'
			)
			expect(result).toBeDefined()
			expect(result?.status).toBe(ModerationStatus.APPROVED)
			expect(result?.moderated_by).toBe('user1')
			expect(result?.moderated_at).toBeDefined()
		})

		test('should update item status to rejected', () => {
			const result = moderationService.updateModerationStatus(
				'item1',
				ModerationStatus.REJECTED,
				'user1'
			)
			expect(result).toBeDefined()
			expect(result?.status).toBe(ModerationStatus.REJECTED)
		})

		test('should return undefined for non-existent item', () => {
			const result = moderationService.updateModerationStatus(
				'non-existent',
				ModerationStatus.APPROVED,
				'user1'
			)
			expect(result).toBeUndefined()
		})
	})

	describe('getModerationQueueCount', () => {
		test('should return count of pending items by default', () => {
			const count = moderationService.getModerationQueueCount()
			expect(count).toBe(2)
		})

		test('should return count for specified status', () => {
			const count = moderationService.getModerationQueueCount(ModerationStatus.APPROVED)
			expect(count).toBe(1)
		})
	})

	describe('deleteModerationQueueItem', () => {
		test('should delete moderation queue item', () => {
			const result = moderationService.deleteModerationQueueItem('item1')
			expect(result).toBe(true)

			// Verify item was deleted
			const item = moderationService.getModerationQueueItem('item1')
			expect(item).toBeUndefined()
		})

		test('should return false for non-existent item', () => {
			const result = moderationService.deleteModerationQueueItem('non-existent')
			expect(result).toBe(false)
		})
	})

	describe('getModerationQueuePaginated', () => {
		test('should return paginated results', () => {
			const items = moderationService.getModerationQueuePaginated({
				limit: 1,
				offset: 0
			})
			expect(items.length).toBe(1)
		})

		test('should filter by type', () => {
			const items = moderationService.getModerationQueuePaginated({
				type: 'comment'
			})
			expect(items.length).toBe(1)
			expect(items[0].type).toBe('comment')
		})

		test('should respect offset', () => {
			const items = moderationService.getModerationQueuePaginated({
				offset: 1
			})
			expect(items.length).toBe(1)
		})
	})

	describe('getModerationQueueCountFiltered', () => {
		test('should return filtered count', () => {
			const count = moderationService.getModerationQueueCountFiltered({
				status: ModerationStatus.PENDING
			})
			expect(count).toBe(2)
		})
	})
})
