import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		try {
			const formData = await request.formData()
			const id = formData.get('id') as string

			if (!id) {
				return {
					success: false,
					error: 'Content ID is required'
				}
			}

			const success = locals.contentService.deleteContent(id)

			if (success) {
				// Return success to trigger invalidateAll in the form
				return {
					success: true
				}
			}

			return {
				success: false,
				error: 'Failed to delete content'
			}
		} catch (error) {
			if (error instanceof Response) throw error

			console.error('Error deleting content:', error)
			return {
				success: false,
				error: 'An error occurred while deleting content'
			}
		}
	}
}
