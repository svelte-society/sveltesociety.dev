import { getRequestEvent, query } from '$app/server'
import type { Item } from './FilterSubmenu.svelte'

type FilterItem = {
  type: 'Category' | 'Tag' | 'Author' | 'Search'
  paramName: string
  value: string
  label: string
}

export type SearchSuggestion = {
  type: 'category' | 'tag' | 'author'
  paramName: string
  value: string
  label: string
}

// Static content types
const contentTypes: Item[] = [
  { label: 'Recipe', value: 'recipe' },
  { label: 'Video', value: 'video' },
  { label: 'Library', value: 'library' },
  { label: 'Resource', value: 'resource' },
  { label: 'Announcement', value: 'announcement' },
  { label: 'Collection', value: 'collection' }
]

export const getCategories = query(() => {
  return contentTypes
})

export const getTags = query(() => {
  const { locals } = getRequestEvent()
  const tags = locals.tagService.getAllTags()
  return tags.map((tag) => ({
    label: tag.name,
    value: tag.slug
  }))
})

export const getAuthors = query(() => {
  const { locals } = getRequestEvent()
  const authors = locals.userService.getAuthorsWithContent()
  return authors.map((author) => {
    const name = author.name || author.username
    return {
      label: name,
      value: name // Use name for filtering (matches Orama index)
    }
  })
})

export const getActiveFilters = query("unchecked", async (searchParams: URLSearchParams) => {
  const filters: FilterItem[] = []

  const categories = new Map((await getCategories()).map((c) => [c.value, c.label]))
  const authors = new Map((await getAuthors()).map((c) => [c.value, c.label]))
  const tags = new Map((await getTags()).map((c) => [c.value, c.label]))

  const activeTypes = searchParams.getAll('type')
  for (const value of activeTypes) {
    filters.push({
      type: 'Category',
      paramName: 'type',
      value,
      label: categories.get(value) || value
    })
  }

  // Get active tags
  const activeTags = searchParams.getAll('tags')
  for (const value of activeTags) {
    filters.push({
      type: 'Tag',
      paramName: 'tags',
      value,
      label: tags.get(value) || value
    })
  }

  // Get active authors
  const activeAuthors = searchParams.getAll('authors')
  for (const value of activeAuthors) {
    filters.push({
      type: 'Author',
      paramName: 'authors',
      value,
      label: authors.get(value) || value
    })
  }

  // Get search query
  const query = searchParams.get('query')
  if (query) {
    filters.push({
      type: 'Search',
      paramName: 'query',
      value: query,
      label: query
    })
  }

  return filters
})

export const getSearchSuggestions = query(async () => {
  const suggestions: SearchSuggestion[] = []

  const categories = await getCategories()
  for (const cat of categories) {
    suggestions.push({
      type: 'category',
      paramName: 'type',
      value: cat.value,
      label: cat.label
    })
  }

  const tags = await getTags()
  for (const tag of tags) {
    suggestions.push({
      type: 'tag',
      paramName: 'tags',
      value: tag.value,
      label: tag.label
    })
  }

  const authors = await getAuthors()
  for (const author of authors) {
    suggestions.push({
      type: 'author',
      paramName: 'authors',
      value: author.value,
      label: author.label
    })
  }

  return suggestions
})
