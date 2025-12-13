import { form, getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const bulkImportSchema = z.object({
	urls: z.string().min(1, 'At least one URL is required'),
	skipExisting: z.coerce.boolean().default(true),
	batchSize: z.coerce.number().min(1).max(10).default(5)
})

type ImportResult = {
	url: string
	success: boolean
	contentId?: string
	error?: string
	type?: 'youtube' | 'github'
}

type ImportSummary = {
	total: number
	successful: number
	failed: number
	skipped: number
	byType: {
		youtube: number
		github: number
	}
}

export type BulkImportResult = {
	success: boolean
	error?: string
	summary?: ImportSummary
	results?: ImportResult[]
}

export const bulkImport = form(bulkImportSchema, async (data) => {
	checkAdminAuth()
	const event = getRequestEvent()

	const urlsString = String(data.urls)
	const urls = urlsString
		.split('\n')
		.map((url: string) => url.trim())
		.filter((url: string) => url.length > 0)

	if (urls.length === 0) {
		return {
			success: false,
			error: 'No valid URLs provided'
		}
	}

	if (urls.length > 50) {
		return {
			success: false,
			error: 'Maximum 50 URLs allowed per batch'
		}
	}

	try {
		const res = await event.fetch('/api/bulk-import', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				urls,
				skipExisting: data.skipExisting,
				batchSize: data.batchSize
			})
		})

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}))
			return {
				success: false,
				error: errorData.message || `Import failed with status ${res.status}`
			}
		}

		const result = await res.json()

		// Build summary from results
		const results = result.results as ImportResult[]
		const summary: ImportSummary = {
			total: results.length,
			successful: results.filter((r) => r.success).length,
			failed: results.filter((r) => !r.success && !r.error?.includes('skip')).length,
			skipped: results.filter((r) => r.error?.includes('skip')).length,
			byType: {
				youtube: results.filter((r) => r.type === 'youtube' && r.success).length,
				github: results.filter((r) => r.type === 'github' && r.success).length
			}
		}

		return {
			success: true,
			summary,
			results
		}
	} catch (error) {
		console.error('Error bulk importing content:', error)
		return {
			success: false,
			error: 'There was an error processing your bulk import. Please try again.'
		}
	}
})
