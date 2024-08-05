import { db } from "./index";

export type Collection = {
    id: number;
    title: string;
    type: 'collection';
    description: string;
    children: string;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'published';
    published_at: string | null;
    slug: string;
};

export const get_collections = (): Collection[] => {
    const stmt = db.prepare(`
        SELECT * FROM collections_view
    `);
    return stmt.all() as Collection[];
}