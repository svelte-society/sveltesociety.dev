import { getRequestEvent, query } from '$app/server'
import { schema } from './schema'
import {
    buildHomepageMeta,
    buildCategoryMeta,
    generateOrganizationSchema,
    generateWebSiteSchema
} from '$lib/seo'

export const getTags = query(() => {
    const { locals } = getRequestEvent()
    return locals.tagService.getAllTags()
})

export const getData = query("unchecked", async ({ url, type }) => {
    const { locals } = getRequestEvent()

    // Parse URL search params into filter data
    // Convert searchParams to an object, handling special cases
    const searchParams = url.searchParams
    const params = Object.fromEntries(searchParams.entries())

    const rawData = {
        ...params,
        // Handle tags as array (split by comma if present)
        tags: params.tags ? params.tags.split(',') : undefined,
        // Coerce numeric fields
        limit: params.limit ? parseInt(params.limit, 10) : undefined,
        offset: params.offset ? parseInt(params.offset, 10) : undefined,
        // Convert empty strings to undefined
        query: params.query || undefined,
        category: params.category || undefined,
        sort: params.sort || undefined,
        order: params.order as 'ASC' | 'DESC' | undefined
    }

    const result = schema.safeParse(rawData)
    const data = result.success ? result.data : {}

    let content = []

    // Handle pagination
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = 30 // Should match the default limit in search service
    const offset = (page - 1) * perPage

    // Handle rest parameter - params.type can be an array like ['recipe'] or undefined
    const typeFilter = Array.isArray(type) ? type[0] : type

    const searchResults = locals.searchService.search({
        ...data,
        type: typeFilter,
        status: 'published', // Only show published content to public users
        limit: perPage,
        offset: offset
    })

    content = searchResults.hits
        .map((hit) => locals.contentService.getContentById(hit.id))
        .filter((piece) => piece !== null)

    let mappedContent = content
    if (locals.user?.id) {
        const contentIds = content.map((piece) => piece.id)
        const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
            locals.user.id,
            contentIds
        )

        mappedContent = content.map((piece) => ({
            ...piece,
            liked: userLikes.has(piece.id),
            saved: userSaves.has(piece.id)
        }))
    }

    // Build SEO meta configuration
    const meta = typeFilter
        ? buildCategoryMeta(typeFilter, url.toString())
        : buildHomepageMeta()

    // Build structured data schemas for homepage
    const schemas = !typeFilter
        ? [generateOrganizationSchema(), generateWebSiteSchema()]
        : undefined

    return {
        content: mappedContent,
        count: searchResults.count,
        meta,
        schemas
    }
})