import { runQuery, runInsert, runDelete } from '../db';

export const userService = {
    // Create a new user
    create: async (email: string, username: string, name: string) => {
        const query = 'INSERT INTO users (email, username, name) VALUES (?, ?, ?)';
        await runInsert(query, [email, username, name]);
    },

    // Get all users
    getAll: async () => {
        const query = 'SELECT * FROM users';
        return await runQuery(query);
    },

    // Get user by id
    getById: async (id: number) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        return await runQuery(query, [id]);
    },

    // Get user by email
    getByEmail: async (email: string) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        return await runQuery(query, [email]);
    },

    // Delete user by id
    delete: async (id: number) => {
        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
        const deleteSessionsQuery = 'DELETE FROM sessions WHERE user_id = ?';
        await runDelete(deleteSessionsQuery, [id]); // Delete user sessions first
        await runDelete(deleteUserQuery, [id]); // Then delete the user
    }
};