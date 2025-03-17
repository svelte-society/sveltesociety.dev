import { Database } from 'bun:sqlite';

export type Role = {
	id: number;
	name: string;
	value: string;
	description: string;
	active: boolean;
}

export class RoleService {
	constructor(private db: Database) {}

	getRoles(): Role[] {
		const stmt = this.db.prepare('SELECT * FROM roles');
		const roles = stmt.all() as (Omit<Role, 'active'> & { active: number })[];
		return roles.map(role => ({ ...role, active: role.active === 1 }));
	}

	getActiveRoles(): Role[] {
		const stmt = this.db.prepare('SELECT * FROM roles WHERE active = 1');
		const roles = stmt.all() as (Omit<Role, 'active'> & { active: number })[];
		return roles.map(role => ({ ...role, active: role.active === 1 }));
	}

	getRoleById(id: number): Role | undefined {
		const stmt = this.db.prepare('SELECT * FROM roles WHERE id = $id');
		const role = stmt.get({ $id: id }) as (Omit<Role, 'active'> & { active: number }) | undefined;
		return role ? { ...role, active: role.active === 1 } : undefined;
	}

	createRole(role: Omit<Role, 'id'>): number {
		const stmt = this.db.prepare(
			'INSERT INTO roles (name, value, description, active) VALUES ($name, $value, $description, $active)'
		);
		const info = stmt.run({
			$name: role.name,
			$value: role.value,
			$description: role.description,
			$active: role.active ? 1 : 0
		});
		return Number(info.lastInsertRowid);
	}

	updateRole(role: Role): boolean {
		const stmt = this.db.prepare(
			'UPDATE roles SET name = $name, value = $value, description = $description, active = $active WHERE id = $id'
		);
		const info = stmt.run({
			$id: role.id,
			$name: role.name,
			$value: role.value,
			$description: role.description,
			$active: role.active ? 1 : 0
		});
		return info.changes > 0;
	}

	deleteRole(id: number): boolean {
		const stmt = this.db.prepare('DELETE FROM roles WHERE id = $id');
		const info = stmt.run({ $id: id });
		return info.changes > 0;
	}
}