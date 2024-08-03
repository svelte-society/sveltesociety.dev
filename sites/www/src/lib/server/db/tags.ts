import { db } from "./index";

export type Tag = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
};

export const get_tags = () => {
    const stmt = db.prepare('SELECT * FROM tags');
    return stmt.all() as Tag[];
}