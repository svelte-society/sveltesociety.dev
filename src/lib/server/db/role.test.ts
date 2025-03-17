import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { RoleService, type Role } from './role';
import fs from 'node:fs';

describe('RoleService', () => {
  let db: Database;
  let roleService: RoleService;

  beforeAll(() => {
    // Read and execute schema
    const schema = fs.readFileSync('src/lib/server/db/schema/schema.sql', 'utf-8');
    db = new Database(':memory:');
    db.exec(schema);
  });

  beforeEach(() => {
    // Clear roles table
    db.prepare('DELETE FROM roles').run();

    // Insert test data
    const testRoles = [
      {
        name: 'Admin',
        value: 'admin',
        description: 'Administrator role',
        active: true
      },
      {
        name: 'User',
        value: 'user',
        description: 'Regular user role',
        active: true
      },
      {
        name: 'Guest',
        value: 'guest',
        description: 'Guest role',
        active: false
      }
    ];

    roleService = new RoleService(db);
    testRoles.forEach(role => roleService.createRole(role));
  });

  describe('getRoles', () => {
    test('should return all roles', () => {
      const roles = roleService.getRoles();
      expect(roles.length).toBe(3);
      expect(roles.map(r => r.value)).toEqual(['admin', 'user', 'guest']);
    });
  });

  describe('getActiveRoles', () => {
    test('should return only active roles', () => {
      const roles = roleService.getActiveRoles();
      expect(roles.length).toBe(2);
      expect(roles.every(r => r.active)).toBe(true);
      expect(roles.map(r => r.value)).toEqual(['admin', 'user']);
    });
  });

  describe('getRoleById', () => {
    test('should return role by id', () => {
      const roles = roleService.getRoles();
      const role = roleService.getRoleById(roles[0].id);
      expect(role).toBeDefined();
      expect(role?.value).toBe('admin');
    });

    test('should return undefined for non-existent id', () => {
      const role = roleService.getRoleById(999);
      expect(role).toBeUndefined();
    });
  });

  describe('createRole', () => {
    test('should create a new role', () => {
      const newRole = {
        name: 'Moderator',
        value: 'mod',
        description: 'Moderator role',
        active: true
      };
      const id = roleService.createRole(newRole);
      const role = roleService.getRoleById(id);
      expect(role).toBeDefined();
      expect(role?.name).toBe(newRole.name);
      expect(role?.value).toBe(newRole.value);
      expect(role?.description).toBe(newRole.description);
      expect(role?.active).toBe(newRole.active);
    });
  });

  describe('updateRole', () => {
    test('should update an existing role', () => {
      const roles = roleService.getRoles();
      const roleToUpdate = roles[0];
      const updatedRole: Role = {
        ...roleToUpdate,
        name: 'Super Admin',
        description: 'Updated description'
      };
      const success = roleService.updateRole(updatedRole);
      expect(success).toBe(true);

      const role = roleService.getRoleById(roleToUpdate.id);
      expect(role?.name).toBe('Super Admin');
      expect(role?.description).toBe('Updated description');
    });

    test('should return false when updating non-existent role', () => {
      const nonExistentRole: Role = {
        id: 999,
        name: 'Non-existent',
        value: 'none',
        description: 'Does not exist',
        active: true
      };
      const success = roleService.updateRole(nonExistentRole);
      expect(success).toBe(false);
    });
  });

  describe('deleteRole', () => {
    test('should delete an existing role', () => {
      const roles = roleService.getRoles();
      const success = roleService.deleteRole(roles[0].id);
      expect(success).toBe(true);

      const remainingRoles = roleService.getRoles();
      expect(remainingRoles.length).toBe(2);
      expect(remainingRoles.map(r => r.value)).not.toContain('admin');
    });

    test('should return false when deleting non-existent role', () => {
      const success = roleService.deleteRole(999);
      expect(success).toBe(false);
    });
  });
}); 