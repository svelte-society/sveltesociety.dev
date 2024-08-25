import { db } from './index';

export type Role = {
	id: number;
	name: string;
	value: string;
	description: string;
	active: boolean | number;
};

export const get_roles = () => {
	const stmt = db.prepare('SELECT * FROM roles');
	return stmt.all() as Role[];
};

export const get_active_roles = () => {
	const stmt = db.prepare('SELECT * FROM roles WHERE active = 1');
	return stmt.all() as Role[];
};

export const get_role_by_id = (id: number) => {
	const stmt = db.prepare('SELECT * FROM roles WHERE id = ?');
	let role = stmt.get(id) as Role | undefined;
	return { ...role, active: role?.active === 1 } as Role | undefined;
};

export const create_role = (role: Omit<Role, 'id'>) => {
	const stmt = db.prepare(
		'INSERT INTO roles (name, value, description, active) VALUES (?, ?, ?, ?)'
	);
	const info = stmt.run(role.name, role.value, role.description, role.active ? 1 : 0);
	return info.lastInsertRowid as number;
};

export const update_role = (role: Role) => {
	const stmt = db.prepare(
		'UPDATE roles SET name = ?, value = ?, description = ?, active = ? WHERE id = ?'
	);
	const info = stmt.run(role.name, role.value, role.description, role.active ? 1 : 0, role.id);
	return info.changes > 0;
};

export const delete_role = (id: number) => {
	const stmt = db.prepare('DELETE FROM roles WHERE id = ?');
	const info = stmt.run(id);
	return info.changes > 0;
};
