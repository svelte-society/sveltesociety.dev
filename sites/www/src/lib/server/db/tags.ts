import { db } from "./index";

export type Tag = {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
};

export const get_tags = () => {
    const stmt = db.prepare('SELECT * FROM tags');
    return stmt.all() as Tag[];
}

export const get_tag = (id: number) => {
    const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    return stmt.get(id) as Tag | undefined;
}

export const delete_tag = (id: number) => {
    const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

export const create_tag = (tag: Omit<Tag, 'id' | 'color'>) => {
    const stmt = db.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)');
    const result = stmt.run(tag.name, tag.slug);
    return result.lastInsertRowid as number;
}

export const update_tag = (tag: Tag) => {
    const stmt = db.prepare('UPDATE tags SET name = ?, slug = ? WHERE id = ?');
    const result = stmt.run(tag.name, tag.slug, tag.id);
    return result.changes > 0;
}