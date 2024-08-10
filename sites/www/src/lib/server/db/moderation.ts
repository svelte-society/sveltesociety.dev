import { db } from "./index";

export type ModerationQueueItem = {
    id: number;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    data: string; // JSON string
    submitted_by: number;
    submitted_at: string;
    moderated_by: number | null;
    moderated_at: string | null;
};

export type PreviewModerationQueueItem = Omit<ModerationQueueItem, 'data'>;

export const get_moderation_queue = (status: 'pending' | 'approved' | 'rejected' = 'pending'): PreviewModerationQueueItem[] => {
    const stmt = db.prepare(`
        SELECT 
            id, 
            type, 
            status, 
            submitted_by, 
            submitted_at, 
            moderated_by, 
            moderated_at
        FROM moderation_queue
        WHERE status = ?
        ORDER BY submitted_at DESC
    `);
    return stmt.all(status) as PreviewModerationQueueItem[];
}

export const get_moderation_queue_item = (id: number): ModerationQueueItem | undefined => {
    const stmt = db.prepare(`
        SELECT *
        FROM moderation_queue
        WHERE id = ?
    `);
    return stmt.get(id) as ModerationQueueItem | undefined;
}

export const add_to_moderation_queue = (item: Omit<ModerationQueueItem, 'id' | 'status' | 'submitted_at' | 'moderated_by' | 'moderated_at'>): number => {
    const stmt = db.prepare(`
        INSERT INTO moderation_queue (type, status, data, submitted_by, submitted_at)
        VALUES (?, 'pending', ?, ?, CURRENT_TIMESTAMP)
    `);
    const result = stmt.run(item.type, item.data, item.submitted_by);
    return result.lastInsertRowid as number;
}

export const update_moderation_status = (id: number, status: 'approved' | 'rejected', moderated_by: number): boolean => {
    const stmt = db.prepare(`
        UPDATE moderation_queue
        SET status = ?, moderated_by = ?, moderated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);
    const result = stmt.run(status, moderated_by, id);
    return result.changes > 0;
}

export const get_moderation_queue_count = (status: 'pending' | 'approved' | 'rejected' = 'pending'): number => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM moderation_queue WHERE status = ?');
    return (stmt.get(status) as { count: number }).count;
}

interface GetModerationQueueOptions {
    status?: 'pending' | 'approved' | 'rejected';
    type?: string;
    limit?: number;
    offset?: number;
}

export const get_moderation_queue_paginated = (options: GetModerationQueueOptions): PreviewModerationQueueItem[] => {
    const {
        status = 'pending',
        type,
        limit = 10,
        offset = 0
    } = options;

    let query = `
        SELECT 
            id, 
            title,
            type, 
            status, 
            submitted_by, 
            submitted_at, 
            moderated_by, 
            moderated_at
        FROM moderation_queue
        WHERE status = @status
    `;

    const params: any = { status, limit, offset };

    if (type) {
        query += " AND type = @type";
        params.type = type;
    }

    query += `
        ORDER BY submitted_at DESC
        LIMIT @limit OFFSET @offset
    `;

    const stmt = db.prepare(query);
    return stmt.all(params) as PreviewModerationQueueItem[];
}

export const get_moderation_queue_count_filtered = (params: Pick<GetModerationQueueOptions, 'status'>): number => {
    let query = `
        SELECT COUNT(*) as count
        FROM moderation_queue
        WHERE status = @status
    `;

    const stmt = db.prepare(query);
    return (stmt.get(params) as { count: number }).count;
}