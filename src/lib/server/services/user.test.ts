import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { UserService, type GitHubUserInfo, type User } from './user';
import fs from 'node:fs';

describe('UserService', () => {
  let db: Database;
  let userService: UserService;

  beforeAll(() => {
    // Read and execute schema
    const schema = fs.readFileSync('src/lib/server/db/schema/schema.sql', 'utf-8');
    db = new Database(':memory:', { strict: true});
    // Enable foreign key constraints
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(schema);
  });

  beforeEach(() => {
    // Clear tables
    db.prepare('DELETE FROM user_oauth').run();
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM oauth_providers').run();
    db.prepare('DELETE FROM roles').run();

    // Insert roles
    db.prepare(`
      INSERT INTO roles (id, name, value, description, active)
      VALUES 
        (0, 'user', 'user', 'Regular user', true),
        (1, 'admin', 'admin', 'Administrator', true)
    `).run();

    // Insert GitHub provider
    db.prepare(`
      INSERT INTO oauth_providers (id, name, description, active)
      VALUES (1, 'github', 'GitHub OAuth Provider', true)
    `).run();

    // Create test users
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, username, name, avatar_url, bio, location, twitter, role)
      VALUES ($id, $email, $username, $name, $avatar_url, $bio, $location, $twitter, $role)
    `);

    const testUsers = [
      {
        id: 'user1',
        email: 'user1@test.com',
        username: 'testuser1',
        name: 'Test User 1',
        avatar_url: 'https://avatar1.test',
        bio: 'Test bio 1',
        location: 'Test location 1',
        twitter: 'testuser1',
        role: 0
      },
      {
        id: 'user2',
        email: 'user2@test.com',
        username: 'testuser2',
        name: 'Test User 2',
        avatar_url: 'https://avatar2.test',
        bio: 'Test bio 2',
        location: 'Test location 2',
        twitter: 'testuser2',
        role: 1
      }
    ];

    for (const user of testUsers) {
      insertUser.run(user);
    }

    // Create test OAuth entries
    const insertOAuth = db.prepare(`
      INSERT INTO user_oauth (user_id, provider_id, provider_user_id, profile_data)
      VALUES ($userId, $providerId, $providerUserId, $profileData)
    `);

    insertOAuth.run({
      userId: 'user1',
      providerId: 1,
      providerUserId: '12345',
      profileData: JSON.stringify({ id: 12345, login: 'testuser1' })
    });

    userService = new UserService(db);
  });

  describe('getUser', () => {
    test('should return user by id', () => {
      const user = userService.getUser('user1');
      expect(user).toBeDefined();
      expect(user?.id).toBe('user1');
      expect(user?.username).toBe('testuser1');
    });

    test('should return undefined for non-existent user', () => {
      const user = userService.getUser('non-existent');
      expect(user).toBeUndefined();
    });
  });

  describe('getUserByOAuth', () => {
    test('should return user by OAuth provider and id', () => {
      const user = userService.getUserByOAuth('github', '12345');
      expect(user).toBeDefined();
      expect(user?.id).toBe('user1');
      expect(user?.username).toBe('testuser1');
    });

    test('should return undefined for non-existent OAuth user', () => {
      const user = userService.getUserByOAuth('github', 'non-existent');
      expect(user).toBeUndefined();
    });
  });

  describe('getUsers', () => {
    test('should return all users', () => {
      const users = userService.getUsers();
      expect(users.length).toBe(2);
      expect(users.map(u => u.id).sort()).toEqual(['user1', 'user2']);
    });
  });

  describe('getUserCount', () => {
    test('should return correct user count', () => {
      const count = userService.getUserCount();
      expect(count).toBe(2);
    });
  });

  describe('createOrUpdateUser', () => {
    test('should create new user from GitHub info', () => {
      const githubInfo: GitHubUserInfo = {
        id: 67890,
        login: 'newuser',
        email: 'new@test.com',
        name: 'New User',
        avatar_url: 'https://avatar.test',
        bio: 'Test bio',
        location: 'Test location',
        twitter_username: 'newuser'
      };

      const user = userService.createOrUpdateUser(githubInfo);
      expect(user).toBeDefined();
      expect(user.username).toBe('newuser');
      expect(user.email).toBe('new@test.com');

      // Verify OAuth entry was created
      const oauthEntry = db.prepare(`
        SELECT * FROM user_oauth 
        WHERE provider_user_id = $providerUserId
      `).get({ providerUserId: '67890' });
      expect(oauthEntry).toBeDefined();
    });

    test('should update existing user from GitHub info', () => {
      const githubInfo: GitHubUserInfo = {
        id: 12345,
        login: 'testuser1',
        email: 'updated@test.com',
        name: 'Updated User',
        avatar_url: 'https://updated.test',
        bio: 'Updated bio',
        location: 'Updated location',
        twitter_username: 'updated'
      };

      const user = userService.createOrUpdateUser(githubInfo);
      expect(user).toBeDefined();
      expect(user.email).toBe('updated@test.com');
      expect(user.name).toBe('Updated User');
      expect(user.bio).toBe('Updated bio');
    });

    test('should throw error if GitHub provider not found', () => {
      // Delete OAuth entries first
      db.prepare('DELETE FROM user_oauth').run();
      // Then delete GitHub provider
      db.prepare('DELETE FROM oauth_providers').run();

      const githubInfo: GitHubUserInfo = {
        id: 67890,
        login: 'newuser'
      };

      expect(() => userService.createOrUpdateUser(githubInfo)).toThrow('GitHub OAuth provider not found');
    });
  });

  describe('updateUser', () => {
    test('should update user fields', () => {
      const updates = {
        name: 'Updated Name',
        bio: 'Updated Bio',
        location: 'Updated Location'
      };

      const user = userService.updateUser('user1', updates);
      expect(user).toBeDefined();
      expect(user?.name).toBe('Updated Name');
      expect(user?.bio).toBe('Updated Bio');
      expect(user?.location).toBe('Updated Location');
    });

    test('should return undefined for non-existent user', () => {
      const updates = { name: 'Updated Name' };
      const user = userService.updateUser('non-existent', updates);
      expect(user).toBeUndefined();
    });

    test('should return undefined if no fields to update', () => {
      const updates = {};
      const user = userService.updateUser('user1', updates);
      expect(user).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    test('should delete user and return true', () => {
      const result = userService.deleteUser('user1');
      expect(result).toBe(true);

      // Verify user was deleted
      const user = userService.getUser('user1');
      expect(user).toBeUndefined();

      // Verify OAuth entry was deleted
      const oauthEntry = db.prepare(`
        SELECT * FROM user_oauth 
        WHERE user_id = $userId
      `).get({ userId: 'user1' });
      expect(oauthEntry).toBeNull();
    });

    test('should return false for non-existent user', () => {
      const result = userService.deleteUser('non-existent');
      expect(result).toBe(false);
    });

    test('should delete associated OAuth entries', () => {
      userService.deleteUser('user1');

      // Verify OAuth entry was deleted
      const oauthEntry = db.prepare(`
        SELECT * FROM user_oauth 
        WHERE user_id = $userId
      `).get({ userId: 'user1' });
      expect(oauthEntry).toBeNull();
    });
  });
}); 