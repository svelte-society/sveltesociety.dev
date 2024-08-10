import { db } from "./index";
import { type Tag } from "./tags";

interface GetContentParams {
    limit?: number;
    offset?: number;
    types?: string[];
}

type ContentInput = {
    title: string;
    type: string;
    status?: 'draft' | 'published' | 'archived';
    body?: string;
    rendered_body?: string;
    slug: string;
    description?: string;
    metadata?: Record<string, any>;
    children?: number[];
};

export type Content = {
    id: number;
    title: string;
    type: 'draft' | 'published' | 'archived';
    body: string;
    rendered_body: string;
    slug: string;
    description: string;
    children: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    likes: number;
    saves: number;
};

export type PreviewContent = Omit<Content, 'body' | 'rendered_body'>;

export const get_content = ({ limit = 15, offset = 0, types = [] }: GetContentParams = {}): PreviewContent[] => {
    let query = `
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM published_content
    `;

    const params: Record<string, any> = {
        "limit": limit,
        "offset": offset
    };

    if (types.length > 0) {
        query += " WHERE type IN (" + types.map((_, i) => `@type${i}`).join(", ") + ")";
        types.forEach((type, i) => {
            params[`@type${i}`] = type;
        });
    }

    query += " LIMIT @limit OFFSET @offset";

    const stmt = db.prepare(query);
    return stmt.all(params) as PreviewContent[];
};

export const get_all_content = (): PreviewContent[] => {
    const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM content_without_collections
    `);
    return stmt.all() as PreviewContent[];
}

export const get_content_by_type = (type: string): PreviewContent[] => {
    const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves
        FROM published_content
        WHERE type = ?
    `);
    return stmt.all(type) as PreviewContent[];
}

export const get_content_by_slug = (slug: string): PreviewContent => {
    const stmt = db.prepare(`
        SELECT *
        FROM published_content
        WHERE slug = ?
    `);
    return stmt.get(slug) as PreviewContent;
}

export const get_content_count = () => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM content');
    return (stmt.get() as { count: number }).count;
}

export const get_tags_for_content = (content_ids: number[]): Tag[][] => {
    const stmt = db.prepare(`
        SELECT t.id, t.name, t.slug, t.color
        FROM content_to_tags ct
        JOIN tags t ON ct.tag_id = t.id
        WHERE ct.content_id = ?
      `);

    const getManyTags = db.transaction((ids: number[]) => {
        const results: Tag[][] = [];
        for (const id of ids) {
            const tags = stmt.all(id) as Tag[];
            results.push(tags);
        }
        return results;
    });

    return getManyTags(content_ids);
}

export const get_content_by_ids = (contentIds: number[]): PreviewContent[] => {
    if (contentIds.length === 0) {
        return [];
    }

    const placeholders = contentIds.map(() => '?').join(',');
    const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM published_content
        WHERE id IN (${placeholders})
    `);

    try {
        return stmt.all(...contentIds) as PreviewContent[];
    } catch (error) {
        console.error('Error fetching content:', error);
        return [];
    }
}

interface GetContentByTagOptions {
    slug: string;
    limit?: number;
    offset?: number;
}

export const get_content_by_tag = (options: GetContentByTagOptions): Content[] => {
    const {
        slug,
        limit = 10,
        offset = 0
    } = options;

    const query = `
        SELECT 
            c.id, 
            c.title, 
            c.type, 
            c.slug, 
            c.description, 
            c.children, 
            c.created_at, 
            c.updated_at, 
            c.published_at, 
            c.likes, 
            c.saves
      FROM published_content c
      JOIN content_to_tags ct ON c.id = ct.content_id
      JOIN tags t ON ct.tag_id = t.id
      WHERE t.slug = @slug
      ORDER BY c.published_at DESC
      LIMIT @limit OFFSET @offset
    `;

    const stmt = db.prepare(query);
    return stmt.all({ slug, limit, offset }) as Content[];
}

export const get_content_by_tag_count = (slug: string): number => {
    const queryCount = `
        SELECT COUNT(*) as count
        FROM published_content c
        JOIN content_to_tags ct ON c.id = ct.content_id
        JOIN tags t ON ct.tag_id = t.id
        WHERE t.slug = ?
    `;

    const stmtCount = db.prepare(queryCount);

    const { count } = stmtCount.get(slug) as { count: number };

    return count
}

interface GetSavedContentOptions {
    user_id: number;
    limit?: number;
    offset?: number;
}

export function get_user_saved_content(options: GetSavedContentOptions): Content[] {
    const {
        user_id,
        limit = 10,
        offset = 0
    } = options;

    const queryContent = `
        SELECT 
            c.id, 
            c.title, 
            c.type, 
            c.slug, 
            c.description, 
            c.children, 
            c.created_at, 
            c.updated_at, 
            c.published_at, 
            c.likes, 
            c.saves
      FROM published_content c
      JOIN saves s ON c.id = s.target_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const stmtContent = db.prepare(queryContent);

    const content = stmtContent.all(user_id, limit, offset) as Content[];

    return content;
}

export const delete_content = (id: number): boolean => {
    const stmt = db.prepare(`
        DELETE FROM content
        WHERE id = ?
    `);

    try {
        const result = stmt.run(id);
        return result.changes > 0;
    } catch (error) {
        console.error('Error deleting content:', error);
        return false;
    }
}

export const create_content = (input: ContentInput): number | null => {
    const {
        title,
        type,
        status = 'draft',
        body = null,
        rendered_body = null,
        slug,
        description = null,
        metadata = null,
        children = null
    } = input;

    const stmt = db.prepare(`
        INSERT INTO content (
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata,
            children,
            created_at,
            updated_at
        ) VALUES (
            @title,
            @type,
            @status,
            @body,
            @rendered_body,
            @slug,
            @description,
            @metadata,
            @children,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
    `);

    try {
        const result = stmt.run({
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata: metadata ? JSON.stringify(metadata) : null,
            children: children ? JSON.stringify(children) : null
        });

        // Return the ID of the newly inserted content
        return result.lastInsertRowid as number;
    } catch (error) {
        console.error('Error creating content:', error);
        return null;
    }
}

export const get_content_by_id = (id: number): Content | null => {
    const stmt = db.prepare(`
        SELECT *
        FROM content
        WHERE id = ?
    `);

    try {
        const result = stmt.get(id) as (Omit<Content, 'children'> & { children: string }) | undefined;

        if (!result) {
            return null;
        }

        const children = result.children ? JSON.parse(result.children) : [];

        return {
            ...result,
            children
        };
    } catch (error) {
        console.error('Error fetching content by id:', error);
        return null;
    }
};

export const update_content = (input: ContentInput & { id: number }): boolean => {
    const {
        id,
        title,
        type,
        status,
        body,
        rendered_body,
        slug,
        description,
        metadata,
        children
    } = input;

    const stmt = db.prepare(`
        UPDATE content
        SET
            title = @title,
            type = @type,
            status = @status,
            body = @body,
            rendered_body = @rendered_body,
            slug = @slug,
            description = @description,
            metadata = @metadata,
            children = @children,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
    `);

    try {
        const result = stmt.run({
            id,
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata: metadata ? JSON.stringify(metadata) : null,
            children: children ? JSON.stringify(children) : null
        });

        return result.changes > 0;
    } catch (error) {
        console.error('Error updating content:', error);
        return false;
    }
};