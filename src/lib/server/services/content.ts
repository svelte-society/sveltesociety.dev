import { Database } from 'bun:sqlite';
import { SearchService } from './search';

export interface Content {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  status: string;
  content: string;
  tags?: Array<{ id: string; name: string; slug: string; color: string }>;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  likes: number;
  saves: number;
}

export type PreviewContent = Omit<Content, 'content'>;

interface ContentFilters {
  type?: string;
  tags?: string | string[];
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sort?: 'latest' | 'oldest' | 'popular';
}

export class ContentService {
  private searchService: SearchService;

  constructor(private db: Database) {
    this.searchService = new SearchService(db);
  }

  getContentById(id: string) {
    const content = this.db.prepare(`
      SELECT c.*, 
        COALESCE(
          json_group_array(
            CASE 
              WHEN t.id IS NULL THEN NULL 
              ELSE json_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug,
                'color', t.color
              )
            END
          ),
          '[]'
        ) as tags
      FROM content c
      LEFT JOIN content_to_tags ctt ON c.id = ctt.content_id
      LEFT JOIN tags t ON ctt.tag_id = t.id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(id) as any;

    if (content) {
      content.tags = JSON.parse(content.tags);
      // Remove null entries from tags array
      content.tags = content.tags.filter(Boolean);
      
      // Process collection children if this is a collection
      if (content.type === 'collection') {
        this.populateContentChildren(content);
      }
    }
    
    return content;
  }

  // Helper method to populate children for collections
  private populateContentChildren(collectionContent: any) {
    try {
      // Parse the content field which contains children IDs
      const childrenIds = [];
      if (collectionContent.content) {
        const contentObj = JSON.parse(collectionContent.content);
        if (contentObj && Array.isArray(contentObj.children)) {
          childrenIds.push(...contentObj.children);
        }
      }
      
      // Fetch each child content item and add to the collection
      const children = childrenIds.map(id => this.getContentById(id)).filter(Boolean);
      
      // Ensure the child_content property is set and is an array
      collectionContent.child_content = children;
      
      // For backwards compatibility, also set children property
      collectionContent.children = children;
    } catch (e) {
      console.error('Error populating collection children:', e);
      // Ensure we always have arrays even if there was an error
      collectionContent.child_content = [];
      collectionContent.children = [];
    }
  }

  getFilteredContent(filters: ContentFilters = {}) {
    let contentIds: string[] = [];
    
    // Handle search first if present
    if (filters.search?.trim()) {
      contentIds = this.searchService.search({ query: filters.search.trim() });
    }
    
    // Build the base query
    let query = `
      SELECT DISTINCT c.id
      FROM content c
    `;
    const params: any[] = [];
    const whereConditions: string[] = [];
    const havingConditions: string[] = [];
    
    // Add search filter if we have results
    if (filters.search?.trim()) {
      if (contentIds.length === 0) {
        return []; // No search results found
      }
      whereConditions.push(`c.id IN (${contentIds.map(() => '?').join(',')})`);
      params.push(...contentIds);
    }
    
    // Status filter
    if (filters.status === 'all') {
      // Don't add any status condition when requesting all content
    } else {
      whereConditions.push(filters.status ? "c.status = ?" : "c.status = 'published'");
      if (filters.status) params.push(filters.status);
    }
    
    // Type filter
    if (filters.type) {
      whereConditions.push("c.type = ?");
      params.push(filters.type);
    }
    
    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      if (tags.length > 0) {
        query += `
          JOIN content_to_tags ctt ON c.id = ctt.content_id
          JOIN tags t ON ctt.tag_id = t.id
        `;
        whereConditions.push(`t.slug IN (${tags.map(() => '?').join(',')})`);
        params.push(...tags);
        
        if (tags.length > 1) {
          havingConditions.push("COUNT(DISTINCT t.slug) = ?");
          params.push(tags.length);
        }
      }
    }
    
    // Add WHERE conditions
    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    // Add GROUP BY and HAVING if needed
    if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 1) {
      query += " GROUP BY c.id";
      if (havingConditions.length > 0) {
        query += " HAVING " + havingConditions.join(" AND ");
      }
    }
    
    // Add sorting
    query += " ORDER BY ";
    if (filters.sort === 'latest') {
      query += "c.published_at DESC, c.created_at DESC";
    } else if (filters.sort === 'oldest') {
      query += "c.published_at ASC, c.created_at ASC";
    } else if (filters.sort === 'popular') {
      query += "c.likes DESC, c.saves DESC";
    } else {
      query += "c.published_at DESC, c.created_at DESC";
    }
    
    // Add pagination
    if (filters.limit) {
      query += " LIMIT ?";
      params.push(filters.limit);
      if (filters.offset) {
        query += " OFFSET ?";
        params.push(filters.offset);
      }
    }

    // Get IDs first
    const ids = this.db.prepare(query).all(...params) as { id: string }[];
    
    // Then get full content with tags for each ID
    const contents = ids.map(({ id }) => this.getContentById(id)).filter(Boolean);
    
    // Process collections to populate their children property
    return contents.map(content => {
      if (content.type === 'collection' && !content.child_content) {
        this.populateContentChildren(content);
      }
      return content;
    });
  }

  getFilteredContentCount(filters: Omit<ContentFilters, 'limit' | 'offset' | 'sort'> = {}) {
    let contentIds: string[] = [];
    
    // Handle search first if present
    if (filters.search?.trim()) {
      contentIds = this.searchService.search({ query: filters.search.trim() });
      if (contentIds.length === 0) return 0;
    }
    
    let query = "SELECT COUNT(DISTINCT c.id) as total FROM content c";
    const params: any[] = [];
    const whereConditions: string[] = [];
    const havingConditions: string[] = [];
    
    // Add search filter if we have results
    if (filters.search?.trim()) {
      whereConditions.push(`c.id IN (${contentIds.map(() => '?').join(',')})`);
      params.push(...contentIds);
    }
    
    // Status filter
    if (filters.status === 'all') {
      // Don't add any status condition when requesting all content
    } else {
      whereConditions.push(filters.status ? "c.status = ?" : "c.status = 'published'");
      if (filters.status) params.push(filters.status);
    }
    
    // Type filter
    if (filters.type) {
      whereConditions.push("c.type = ?");
      params.push(filters.type);
    }
    
    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      if (tags.length > 0) {
        query += `
          JOIN content_to_tags ctt ON c.id = ctt.content_id
          JOIN tags t ON ctt.tag_id = t.id
        `;
        whereConditions.push(`t.slug IN (${tags.map(() => '?').join(',')})`);
        params.push(...tags);
        
        if (tags.length > 1) {
          havingConditions.push("COUNT(DISTINCT t.slug) = ?");
          params.push(tags.length);
        }
      }
    }
    
    // Add WHERE conditions
    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    // Add GROUP BY and HAVING if needed
    if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 1) {
      query += " GROUP BY c.id";
      if (havingConditions.length > 0) {
        query += " HAVING " + havingConditions.join(" AND ");
      }
      // Wrap in subquery for correct count with GROUP BY
      query = `SELECT COUNT(*) as total FROM (${query})`;
    }
    
    const result = this.db.prepare(query).get(...params) as { total: number };
    return result?.total || 0;
  }

  // Helper methods remain unchanged
  searchBlogPosts(searchTerm: string, tags: string[] = []) {
    return this.getFilteredContent({
      type: 'blog',
      search: searchTerm,
      tags: tags.length > 0 ? tags : undefined,
      sort: 'latest'
    });
  }

  getContentByTag(tagSlug: string, limit = 10, offset = 0) {
    return this.getFilteredContent({
      tags: tagSlug,
      limit,
      offset
    });
  }

  getContentByType(type: string, limit = 10, offset = 0) {
    return this.getFilteredContent({
      type,
      limit,
      offset
    });
  }
}