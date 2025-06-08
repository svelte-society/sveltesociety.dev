import type { PageServerLoad, Actions } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { fail } from '@sveltejs/kit'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms/server'
import { z } from 'zod'

const bulkImportSchema = z.object({
	urls: z.string().min(1, 'At least one URL is required'),
	skipExisting: z.boolean().default(true),
	batchSize: z.number().min(1).max(10).default(5)
})

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(bulkImportSchema))

	return {
		form
	}
}

export const actions: Actions = {
	import: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(bulkImportSchema))

		form.data.urls = form.data.urls
			.split('\n')
			.map((url: string) => url.trim())
			.filter((url: string) => url.length > 0)

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
