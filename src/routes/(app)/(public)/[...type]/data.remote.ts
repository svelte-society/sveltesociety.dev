import { getRequestEvent, query } from '$app/server'
import { superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import { schema } from './schema'
import {
    buildHomepageMeta,
    buildCategoryMeta,
    generateOrganizationSchema,
    generateWebSiteSchema
} from '$lib/seo'

export const getData = query("unchecked", async ({ url, type }) => {
    const { locals } = getRequestEvent()
    const filters = await superValidate(url, zod4(schema))

    let content = []

    const { data } = filters

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

    const allTags = locals.tagService.getAllTags()

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
        tags: allTags,
        meta,
        schemas
    }
})