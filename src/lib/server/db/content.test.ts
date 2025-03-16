import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'bun:sqlite';
import { ContentService } from './content';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('ContentService', () => {
  let db: Database;
  let contentService: ContentService;

  beforeEach(() => {
    // Create a new in-memory database for each test
    db = new Database(':memory:');
    db.exec('PRAGMA journal_mode = WAL;');

    // Read and execute schema
    const schemaPath = join(process.cwd(), 'src/lib/server/db/schema/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    db.exec(schema);

    // Read and execute triggers
    const triggersPath = join(process.cwd(), 'src/lib/server/db/triggers/search.sql');
    const triggers = readFileSync(triggersPath, 'utf-8');
    db.exec(triggers);

    // Insert test data
    db.prepare(`
      INSERT INTO tags (id, name, slug, color)
      VALUES
        ('tag1', 'Svelte', 'svelte', '#FF3E00'),
        ('tag2', 'TypeScript', 'typescript', '#3178C6'),
        ('tag3', 'Web Development', 'webdev', '#61DAFB')
    `).run();

    db.prepare(`
      INSERT INTO content (id, title, type, status, body, rendered_body, slug, description, published_at)
      VALUES
        ('content1', 'Svelte Tutorial', 'recipe', 'published', 'Svelte tutorial content', '<p>Svelte tutorial content</p>', 'svelte-tutorial', 'Learn Svelte', '2025-03-16 20:33:30'),
        ('content2', 'TypeScript Guide', 'library', 'published', 'TypeScript guide content', '<p>TypeScript guide content</p>', 'typescript-guide', 'Master TypeScript', '2025-03-16 20:33:29'),
        ('content3', 'Draft Post', 'recipe', 'draft', 'Draft content', '<p>Draft content</p>', 'draft-post', 'Draft description', '2025-03-16 20:33:28'),
        ('content4', 'Multi-tag Post', 'recipe', 'published', 'Content with multiple tags', '<p>Content with multiple tags</p>', 'multi-tag-post', 'Post with multiple tags', '2025-03-16 20:33:27')
    `).run();

    db.prepare(`
      INSERT INTO content_to_tags (content_id, tag_id)
      VALUES
        ('content1', 'tag1'),
        ('content1', 'tag2'),
        ('content2', 'tag2'),
        ('content4', 'tag1'),
        ('content4', 'tag2'),
        ('content4', 'tag3')
    `).run();

    // Initialize content service
    contentService = new ContentService(db);
  });

  describe('getFilteredContent', () => {
    it('should return only published content by default', () => {
      const content = contentService.getFilteredContent();
      expect(content.length).toBe(3);
      expect(content.every(item => item.status === 'published')).toBe(true);
    });

    it('should filter by type', () => {
      const content = contentService.getFilteredContent({ type: 'recipe' });
      expect(content.length).toBe(2);
      expect(content.every(item => item.type === 'recipe')).toBe(true);
    });

    it('should filter by single tag', () => {
      const content = contentService.getFilteredContent({ tags: ['svelte'] });
      expect(content.length).toBe(2);
      expect(content.every(item => {
        return item.tags.some((tag: any) => tag.slug === 'svelte');
      })).toBe(true);
    });

    it('should handle multiple tags', () => {
      const content = contentService.getFilteredContent({ tags: ['svelte', 'typescript'] });
      expect(content.length).toBe(2);
      expect(content.every(item => {
        return item.tags.some((tag: any) => tag.slug === 'svelte' || tag.slug === 'typescript');
      })).toBe(true);
    });

    it('should handle limit in pagination', () => {
      const content = contentService.getFilteredContent({ limit: 2 });
      expect(content.length).toBe(2);
    });

    it('should handle offset in pagination', () => {
      const allContent = contentService.getFilteredContent();
      const offsetContent = contentService.getFilteredContent({ offset: 1, limit: 2 });
      expect(offsetContent.length).toBe(2);
      expect(offsetContent[0].id).toBe(allContent[1].id);
      expect(offsetContent[1].id).toBe(allContent[2].id);
    });

    it('should sort by latest by default', () => {
      const content = contentService.getFilteredContent();
      for (let i = 1; i < content.length; i++) {
        expect(new Date(content[i].published_at) <= new Date(content[i - 1].published_at)).toBe(true);
      }
    });

    it('should sort by oldest when specified', () => {
      const content = contentService.getFilteredContent({ sort: 'oldest' });
      for (let i = 1; i < content.length; i++) {
        expect(new Date(content[i].published_at) >= new Date(content[i - 1].published_at)).toBe(true);
      }
    });
  });

  describe('getFilteredContentCount', () => {
    it('should return correct total count', () => {
      const count = contentService.getFilteredContentCount();
      expect(count).toBe(3); // Only published content
    });

    it('should return correct count with tag filter', () => {
      const count = contentService.getFilteredContentCount({ tags: ['svelte'] });
      expect(count).toBe(2);
    });

    it('should return correct count with multiple tags', () => {
      const count = contentService.getFilteredContentCount({ tags: ['svelte', 'typescript'] });
      expect(count).toBe(2);
    });

    it('should return correct count with search', () => {
      const count = contentService.getFilteredContentCount({ search: 'tutorial' });
      expect(count).toBe(1);
    });
  });

  describe('helper methods', () => {
    it('searchBlogPosts should return blog posts with search term', () => {
      const posts = contentService.searchBlogPosts('multi');
      expect(posts.length).toBe(0); // No blog posts in test data match 'multi'
    });

    it('getContentByTag should return content with specific tag', () => {
      const content = contentService.getContentByTag('typescript');
      expect(content.length).toBe(3);
      expect(content.every(item => {
        return item.tags.some((tag: any) => tag.slug === 'typescript');
      })).toBe(true);
    });

    it('getContentByType should return content of specific type', () => {
      const content = contentService.getContentByType('recipe');
      expect(content.length).toBe(2);
      expect(content.every(item => item.type === 'recipe')).toBe(true);
    });
  });
}); 