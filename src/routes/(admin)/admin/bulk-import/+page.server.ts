import type { PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

// Schema for bulk import form
const bulkImportSchema = z.object({
	urls: z.string().min(1, 'At least one URL is required'),
	skipExisting: z.boolean().default(true)
})

export const load: PageServerLoad = async () => {
	// Initialize form
	const form = await superValidate(zod(bulkImportSchema))

	return {
		form
	}
}

export const actions = {
	import: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(bulkImportSchema))

		console.log(form)

		form.data.urls = form.data.urls
			.split('\n')
			.map((url) => url.trim())
			.filter((url) => url.length > 0)

		// Validate the form data
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const res = await fetch('/api/bulk-import', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			})

			const result = await res.json()

			// Return success message
			return message(form, {
				type: 'success',
				text: `Successfully imported ${result.length} item(s).`
			})
		} catch (error) {
			console.error('Error bulk importing content:', error)
			return message(form, {
				type: 'error',
				text: 'There was an error processing your bulk import. Please try again.'
			})
		}
	}
} satisfies Actions
