// Type definitions for content data
import type { TagType } from '$lib/ui/Tags.svelte';

export interface ContentItem {
  id: string | number;
  title: string;
  description?: string;
  type: string;
  author?: string;
  published_at?: string;
  views?: number;
  likes?: number;
  liked?: boolean;
  saves?: number;
  saved?: boolean;
  tags?: any[];
  slug: string;
  children?: any[];
}

// Helper function to check if content is an array
export function isContentArray(content: any): content is ContentItem[] {
  return Array.isArray(content);
}

// Helper function to convert tags to TagType
export function convertTags(tags: any[]): TagType[] {
  if (!Array.isArray(tags)) return [];
  return tags.map(tag => ({
    id: String(tag.id),
    name: String(tag.name),
    slug: String(tag.slug)
  }));
} 