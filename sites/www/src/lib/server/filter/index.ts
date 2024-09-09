import { z } from 'zod';
import { db } from '$lib/server/db';

export const filter_content_schema = z.object({
    types: z.array(z.string()),
    tags: z.array(z.string()),
    search: z.string(),
    sort: z.enum(['latest', 'oldest', 'most_liked', 'most_saved']),
}).partial().refine(
    data => !!data.types || !!data.tags || !!data.search,
    'No value was provided',
);;

export type filter_content_schema = z.infer<typeof filter_content_schema>;

function filter_by_types(types: string[] | undefined): string[] {
    if (!types || types.length === 0) return [];
    const query = 'SELECT id FROM published_content WHERE type IN (' + types.map(() => '?').join(',') + ')';
    return db.prepare(query).all(...types).map(row => row.id);
}

function filter_by_tags(tags: string[] | undefined): string[] {
    if (!tags || tags.length === 0) return [];

    const query = `
        SELECT DISTINCT c.id
        FROM content c
        JOIN content_to_tags ct ON c.id = ct.content_id
        JOIN tags t ON ct.tag_id = t.id
        WHERE c.status = 'published'
        AND t.slug IN (${tags.map(() => '?').join(',')})
    `;

    return db.prepare(query).all(...tags).map(row => row.id);
}

function search_content(search_term: string | undefined): string[] {
    if (!search_term) return [];
    const query = `
        SELECT content_id, rank
        FROM content_fts
        WHERE content_fts MATCH ?
        ORDER BY rank
    `;
    return db.prepare(query).all(search_term).map(row => row.content_id);
}

function get_content_by_ids(ids: string[], sort: filter_content_schema['sort']): any[] {
    if (ids.length === 0) return [];
    let query = 'SELECT * FROM content WHERE id IN (' + ids.map(() => '?').join(',') + ')';
    switch (sort) {
        case 'latest':
            query += ' ORDER BY published_at DESC';
            break;
        case 'oldest':
            query += ' ORDER BY published_at ASC';
            break;
        case 'most_liked':
            query += ' ORDER BY likes DESC';
            break;
        case 'most_saved':
            query += ' ORDER BY saves DESC';
            break;
        default:
            query += ' ORDER BY published_at DESC';
    }
    return db.prepare(query).all(...ids);
}

export function get_filtered_content(filters: filter_content_schema): any[] {
    const type_ids = filter_by_types(filters.types);
    const tag_ids = filter_by_tags(filters.tags);
    const search_ids = search_content(filters.search);

    // Combine all filter results
    let filtered_ids: string[] = [];
    if (type_ids.length > 0) filtered_ids = type_ids;
    if (tag_ids.length > 0) filtered_ids = filtered_ids.length > 0 ? filtered_ids.filter(id => tag_ids.includes(id)) : tag_ids;
    if (search_ids.length > 0) filtered_ids = filtered_ids.length > 0 ? filtered_ids.filter(id => search_ids.includes(id)) : search_ids;

    // If no filters applied, get all published content
    if (filtered_ids.length === 0 && !filters.types && !filters.tags && !filters.search) {
        const all_published_query = 'SELECT id FROM published_content';
        filtered_ids = db.prepare(all_published_query).all().map(row => row.id);
    }

    return get_content_by_ids(filtered_ids, filters.sort);
}
