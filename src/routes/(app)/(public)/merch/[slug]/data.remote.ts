import { getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'

const productSlugSchema = z.object({
	slug: z.string()
})

export const getProduct = query(productSlugSchema, async ({ slug }) => {
	const { locals } = getRequestEvent()

	const product = locals.merchProductService.getProductBySlug(slug)
	if (!product) {
		return null
	}

	return product
})
