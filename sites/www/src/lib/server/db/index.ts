import { readFileSync } from 'fs';
import path from 'path';
import sqlite3 from 'better-sqlite3';
import pg from 'pg';

const isPostgres = process.env.DATABASE_TYPE === 'postgres';

let db: any;

const runMigrations = (db: any, migrationPath: string) => {
    const migration = readFileSync(migrationPath, 'utf-8');
    db.exec(migration);
};

if (isPostgres) {
    const { Pool } = pg
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    db = {
        query: async (text: string, params?: any[]) => {
            const client = await pool.connect();
            try {
                const res = await client.query(text, params);
                return res;
            } finally {
                client.release();
            }
        }
    };

    // Initialize Postgres schema
    const schema = readFileSync('schema.postgres.sql', 'utf-8');
    db.query(schema);
} else {
    db = sqlite3('database.sqlite');
    db.exec(readFileSync('schema.sqlite.sql', 'utf-8'));
}

export const runQuery = async (query: string, params: any[] = []): Promise<any> => {
    if (isPostgres) {
        const res = await db.query(query, params);
        return res.rows;
    } else {
        const stmt = db.prepare(query);
        return stmt.all(...params);
    }
};

export const runInsert = async (query: string, params: any[]): Promise<void> => {
    if (isPostgres) {
        await db.query(query, params);
    } else {
        const stmt = db.prepare(query);
        stmt.run(...params);
    }
};

export const runUpdate = async (query: string, params: any[]): Promise<void> => {
    if (isPostgres) {
        await db.query(query, params);
    } else {
        const stmt = db.prepare(query);
        stmt.run(...params);
    }
};

export const runDelete = async (query: string, params: any[]): Promise<void> => {
    if (isPostgres) {
        await db.query(query, params);
    } else {
        const stmt = db.prepare(query);
        stmt.run(...params);
    }
};