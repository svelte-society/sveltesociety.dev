const SEVEN_DAYS = 7 * 24 * 60 * 60; // 7 days in seconds

export function seedTestSession(db) {
    const createSessionStatement = db.prepare(`
        INSERT INTO sessions (user_id, session_token, expires_at)
        VALUES (@user_id, @session_token, @expires_at)
        RETURNING session_token
      `);

    const sessionToken = 'fe65824f-c73d-4579-a11d-fc98b6e85ad0';
    const now = new Date();
    const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000);

    createSessionStatement.get({
        user_id: 1,
        session_token: sessionToken,
        expires_at: formatDateForSQLite(expiration)
    })

    console.log('Session seeded successfully');
}

function formatDateForSQLite(date: Date): string {
    return date.toISOString().replace('T', ' ').replace('Z', '');
}