export const PAGINATION_SEARCH = 'paginationprobe'
export const PAGINATION_UNIQUE_SEARCH = 'paginationunique'

export const CONTENT_PAGINATION_FIXTURES = [
	...Array.from({ length: 60 }, (_, index) => ({
		id: `pagination_recipe_${index}`,
		title: index === 0 ? 'Paginationunique recipe' : `Paginationprobe recipe ${index}`,
		type: 'recipe',
		status: 'pending_review'
	})),
	...Array.from({ length: 5 }, (_, index) => ({
		id: `pagination_library_${index}`,
		title: `Paginationprobe library ${index}`,
		type: 'library',
		status: index === 0 ? 'draft' : 'published'
	}))
]
