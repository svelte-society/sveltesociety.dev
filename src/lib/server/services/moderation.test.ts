import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { ModerationService, ModerationStatus, type ModerationStatus as ModerationStatusType } from './moderation';
import fs from 'node:fs';

describe('ModerationService', () => {
  let db: Database;
  let moderationService: ModerationService;

  beforeAll(() => {
    // Read and execute schema
    const schema = fs.readFileSync('src/lib/server/db/schema/schema.sql', 'utf-8');
    db = new Database(':memory:', { strict: true });
    db.exec(schema);
  });

  beforeEach(() => {
    // Clear moderation_queue table
    db.prepare('DELETE FROM moderation_queue').run();
    db.prepare('DELETE FROM users').run();

    // Insert test users
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, email)
      VALUES ($id, $username, $email)
    `);

    const testUsers = [
      { id: 'user1', username: 'moderator', email: 'mod@test.com' },
      { id: 'user2', username: 'submitter', email: 'sub@test.com' }
    ];

    for (const user of testUsers) {
      insertUser.run({
        id: user.id,
        username: user.username,
        email: user.email
      });
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
    `);

    const testItems = [
      {
        id: 'item1',
        type: 'content',
        status: ModerationStatus.PENDING,
        data: JSON.stringify({ title: 'Pending Content 1', content: 'Test content 1' }),
        submitted_by: 'user2',
        moderated_by: null,
        moderated_at: null
      },
      {
        id: 'item2',
        type: 'content',
        status: ModerationStatus.APPROVED,
        data: JSON.stringify({ title: 'Approved Content', content: 'Test content 2' }),
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
    ];

    for (const item of testItems) {
      insertItem.run({
        id: item.id,
        type: item.type,
        status: item.status,
        data: item.data,
        submitted_by: item.submitted_by,
        moderated_by: item.moderated_by,
        moderated_at: item.moderated_at
      });
    }

    moderationService = new ModerationService(db);
  });

  describe('getModerationQueue', () => {
    test('should return all pending items by default', () => {
      const items = moderationService.getModerationQueue();
      expect(items.length).toBe(2);
      expect(items.every(item => item.status === ModerationStatus.PENDING)).toBe(true);
    });

    test('should return items with specified status', () => {
      const items = moderationService.getModerationQueue(ModerationStatus.APPROVED);
      expect(items.length).toBe(1);
      expect(items[0].status).toBe(ModerationStatus.APPROVED);
    });
  });

  describe('getModerationQueueItem', () => {
    test('should return full item details by id', () => {
      const item = moderationService.getModerationQueueItem('item1');
      expect(item).toBeDefined();
      expect(item?.id).toBe('item1');
      expect(item?.data).toBeDefined();
    });

    test('should return undefined for non-existent item', () => {
      const item = moderationService.getModerationQueueItem('non-existent');
      expect(item).toBeUndefined();
    });
  });

  describe('addToModerationQueue', () => {
    test('should add new item to queue', () => {
      const newItem = {
        type: 'content',
        data: JSON.stringify({ title: 'New Content', content: 'New test content' }),
        submitted_by: 'user2'
      };

      const id = moderationService.addToModerationQueue(newItem);
      expect(id).toBeDefined();

      const item = moderationService.getModerationQueueItem(id);
      expect(item).toBeDefined();
      expect(item?.type).toBe(newItem.type);
      expect(item?.status).toBe(ModerationStatus.PENDING);
      expect(item?.title).toBe('New Content');
    });
  });

  describe('updateModerationStatus', () => {
    test('should update item status to approved', () => {
      const result = moderationService.updateModerationStatus(
        'item1',
        ModerationStatus.APPROVED,
        'user1'
      );
      expect(result).toBeDefined();
      expect(result?.status).toBe(ModerationStatus.APPROVED);
      expect(result?.moderated_by).toBe('user1');
      expect(result?.moderated_at).toBeDefined();
    });

    test('should update item status to rejected', () => {
      const result = moderationService.updateModerationStatus(
        'item1',
        ModerationStatus.REJECTED,
        'user1'
      );
      expect(result).toBeDefined();
      expect(result?.status).toBe(ModerationStatus.REJECTED);
    });

    test('should return undefined for non-existent item', () => {
      const result = moderationService.updateModerationStatus(
        'non-existent',
        ModerationStatus.APPROVED,
        'user1'
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getModerationQueueCount', () => {
    test('should return count of pending items by default', () => {
      const count = moderationService.getModerationQueueCount();
      expect(count).toBe(2);
    });

    test('should return count for specified status', () => {
      const count = moderationService.getModerationQueueCount(ModerationStatus.APPROVED);
      expect(count).toBe(1);
    });
  });

  describe('getModerationQueuePaginated', () => {
    test('should return paginated results', () => {
      const items = moderationService.getModerationQueuePaginated({
        limit: 1,
        offset: 0
      });
      expect(items.length).toBe(1);
    });

    test('should filter by type', () => {
      const items = moderationService.getModerationQueuePaginated({
        type: 'comment'
      });
      expect(items.length).toBe(1);
      expect(items[0].type).toBe('comment');
    });

    test('should respect offset', () => {
      const items = moderationService.getModerationQueuePaginated({
        offset: 1
      });
      expect(items.length).toBe(1);
    });
  });

  describe('getModerationQueueCountFiltered', () => {
    test('should return filtered count', () => {
      const count = moderationService.getModerationQueueCountFiltered({
        status: ModerationStatus.PENDING
      });
      expect(count).toBe(2);
    });
  });
}); 