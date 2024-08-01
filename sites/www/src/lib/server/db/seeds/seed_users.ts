export function seedUsers(db) {
    const findAdminRoleStmt = db.prepare(`
      SELECT id FROM roles WHERE name = ?
    `);

    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, github_id, email, username, name, avatar_url, bio, location, twitter, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        const adminRole = findAdminRoleStmt.get('Admin');
        if (!adminRole) {
            throw new Error('Admin role not found. Make sure to run seedRoles first.');
        }

        insertUserStmt.run(
            1,
            534488,
            null,
            'kevmodrome',
            'Kevin Åberg Kultalahti',
            'https://avatars.githubusercontent.com/u/534488?v=4',
            'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
            'Sweden',
            'kevmodrome',
            adminRole.id,
            new Date(1721331895712).toISOString()
        );

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}