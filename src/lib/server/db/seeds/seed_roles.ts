import type Database from 'bun:sqlite'

interface Role {
	name: string
	value: string
	description: string
	active: boolean
}

export function seedRoles(db: Database) {
	const insertRoleStmt = db.prepare(`
      INSERT INTO roles (name, value, description, active, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)

	const roles: Role[] = [
		{
			name: 'Admin',
			value: 'admin',
			description: 'Administrator role with full access',
			active: true
		},
		{
			name: 'Moderator',
			value: 'moderator',
			description: 'Moderator role with content management access',
			active: true
		},
		{
			name: 'Editor',
			value: 'editor',
			description: 'Editor role with content creation access',
			active: true
		},
		{
			name: 'User',
			value: 'user',
			description: 'Standard user role with limited access',
			active: true
		}
	]

	const insertRolesTransaction = db.transaction((rolesToInsert: Role[]) => {
		for (const role of rolesToInsert) {
			const now = new Date().toISOString()
			insertRoleStmt.run(role.name, role.value, role.description, role.active ? 1 : 0, now)
		}
	})

	try {
		insertRolesTransaction(roles)
		console.log('Roles seeded successfully')
	} catch (error) {
		console.error('Error seeding roles:', error)
	}
}
