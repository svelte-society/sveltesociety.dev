import { runQuery, runInsert, runDelete } from '../db';

export const sessionService = {
    // Get all sessions for a user
    getByUserId: async (userId: number) => {
        const query = 'SELECT * FROM sessions WHERE user_id = ?';
        return await runQuery(query, [userId]);
    },

    // Insert session
    create: async (userId: number, token: string) => {
        const query = 'INSERT INTO sessions (user_id, token) VALUES (?, ?)';
        await runInsert(query, [userId, token]);
    },

    // Delete session by id
    delete: async (sessionId: number) => {
        const query = 'DELETE FROM sessions WHERE id = ?';
        await runDelete(query, [sessionId]);
    }
};