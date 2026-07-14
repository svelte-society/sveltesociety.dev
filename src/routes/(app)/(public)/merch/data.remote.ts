import { getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'

const merchFiltersSchema = z.object({
	query: z.string().optional(),
	in_stock: z.boolean().optional(),
	sort: z.string().optional(),
	order: z.enum(['ASC', 'DESC']).optional()
})

export const getProducts = query(merchFiltersSchema, async (filters) => {
	const { locals } = getRequestEvent()
	const catalog = await locals.merchProductService.ensureCatalog()

	if (!catalog.available) {
		return { products: [], count: 0, catalogUnavailable: true, catalogStale: false }
	}

	const results = locals.merchSearchService.search({
		query: filters.query || undefined,
		in_stock: filters.in_stock,
		active: true,
		sort: filters.sort || 'created_at',
		order: filters.order || 'DESC',
		limit: 50
	})

	return {
		products: results.hits.map((hit) => hit.document),
		count: results.count,
		catalogUnavailable: false,
		catalogStale: catalog.stale
	}
})
