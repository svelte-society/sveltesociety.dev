import Database from 'better-sqlite3';

export function seedRoles(db: Database.Database) {
	const insertRoleStmt = db.prepare(`
      INSERT INTO roles (name, value, description, active, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

	const roles = [
		{
			name: 'Admin',
			value: 'admin',
			description: 'Administrator role with full access',
			active: true
		},
		{
			name: 'User',
			value: 'user',
			description: 'Standard user role with limited access',
			active: true
		}
	];

	const insertRolesTransaction = db.transaction((roles) => {
		for (const role of roles) {
			const now = new Date().toISOString();
			insertRoleStmt.run(role.name, role.value, role.description, role.active ? 1 : 0, now);
		}
	});

	try {
		insertRolesTransaction(roles);
		console.log('Roles seeded successfully');
	} catch (error) {
		console.error('Error seeding roles:', error);
	}
}
