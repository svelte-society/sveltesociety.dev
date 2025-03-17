import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { SessionService } from './session';
import fs from 'node:fs';

describe('SessionService', () => {
  let db: Database;
  let sessionService: SessionService;

  beforeAll(() => {
    // Read and execute schema
    const schema = fs.readFileSync('src/lib/server/db/schema/schema.sql', 'utf-8');
    db = new Database(':memory:');
    db.exec(schema);
  });

  beforeEach(() => {
    // Clear sessions table
    db.prepare('DELETE FROM sessions').run();
    db.prepare('DELETE FROM users').run();

    // Insert test user
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, email)
      VALUES ($id, $username, $email)
    `);
    insertUser.run({
      $id: 'test-user-1',
      $username: 'testuser1',
      $email: 'test1@example.com'
    });

    sessionService = new SessionService(db);
  });

  describe('createSession', () => {
    test('should create a new session', () => {
      const sessionToken = sessionService.createSession('test-user-1');
      expect(sessionToken).toBeDefined();
      expect(typeof sessionToken).toBe('string');
      expect(sessionToken.length).toBeGreaterThan(0);
    });

    test('should throw error for non-existent user', () => {
      expect(() => sessionService.createSession('non-existent-user'))
        .toThrow('User with ID non-existent-user does not exist');
    });
  });

  describe('validateSessionId', () => {
    test('should validate a valid session', () => {
      const sessionToken = sessionService.createSession('test-user-1');
      const result = sessionService.validateSessionId(sessionToken);
      expect(result.valid).toBe(true);
      expect(result.user_id).toBe('test-user-1');
    });

    test('should invalidate a non-existent session', () => {
      const result = sessionService.validateSessionId('non-existent-token');
      expect(result.valid).toBe(false);
      expect(result.user_id).toBeUndefined();
    });

    test('should invalidate an expired session', async () => {
      // Create a session that's already expired
      const insertExpiredSession = db.prepare(`
        INSERT INTO sessions (user_id, session_token, expires_at)
        VALUES ($user_id, $session_token, datetime('now', '-1 day'))
      `);
      insertExpiredSession.run({
        $user_id: 'test-user-1',
        $session_token: 'expired-token'
      });

      const result = sessionService.validateSessionId('expired-token');
      expect(result.valid).toBe(false);
      expect(result.user_id).toBeUndefined();
    });
  });

  describe('deleteSession', () => {
    test('should delete an existing session', () => {
      const sessionToken = sessionService.createSession('test-user-1');
      const deletedSession = sessionService.deleteSession(sessionToken);
      expect(deletedSession).toBeDefined();
      expect(deletedSession?.user_id).toBe('test-user-1');
      expect(deletedSession?.session_token).toBe(sessionToken);

      // Verify session is deleted
      const result = sessionService.validateSessionId(sessionToken);
      expect(result.valid).toBe(false);
    });

    test('should return undefined for non-existent session', () => {
      const deletedSession = sessionService.deleteSession('non-existent-token');
      expect(deletedSession).toBeUndefined();
    });
  });

  describe('deleteSessionsByUserId', () => {
    test('should delete all sessions for a user', () => {
      // Create multiple sessions for the same user
      const session1 = sessionService.createSession('test-user-1');
      const session2 = sessionService.createSession('test-user-1');
      const session3 = sessionService.createSession('test-user-1');

      const deletedCount = sessionService.deleteSessionsByUserId('test-user-1');
      expect(deletedCount).toBe(3);

      // Verify all sessions are deleted
      expect(sessionService.validateSessionId(session1).valid).toBe(false);
      expect(sessionService.validateSessionId(session2).valid).toBe(false);
      expect(sessionService.validateSessionId(session3).valid).toBe(false);
    });

    test('should return 0 for non-existent user', () => {
      const deletedCount = sessionService.deleteSessionsByUserId('non-existent-user');
      expect(deletedCount).toBe(0);
    });
  });
}); 