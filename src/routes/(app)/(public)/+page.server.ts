import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// Maps datalist selection types to URL param name and optional value lookup
const DATALIST_TYPE_CONFIG: Record<string, { param: string; values?: Record<string, string> }> = {
	category: { param: 'type' },
	tag: { param: 'tags' },
	author: { param: 'authors' },
	'job-location': {
		param: 'remote',
		values: { Remote: 'remote', Hybrid: 'hybrid', 'On-Site': 'on-site' }
	},
	'job-position': {
		param: 'position',
		values: { 'Full-Time': 'full-time', 'Part-Time': 'part-time', Contract: 'contract', Internship: 'internship' }
	},
	'job-level': {
		param: 'level',
		values: { 'Entry Level': 'entry', Junior: 'junior', 'Mid-Level': 'mid', Senior: 'senior', 'Principal/Staff': 'principal' }
	}
}

function parseDatalistSelection(q: string): { label: string; type: string } | null {
	const match = q.match(/^(.+)\s+\((category|tag|author|job-location|job-position|job-level)\)$/)
	return match ? { label: match[1], type: match[2] } : null
}

export const load: PageServerLoad = ({ url, locals }) => {
	// Normalize comma-separated tags to multiple params
	const tagsParam = url.searchParams.get('tags')
	if (tagsParam?.includes(',')) {
		const params = new URLSearchParams(url.searchParams)
		params.delete('tags')
		for (const tag of tagsParam.split(',')) {
			if (tag.trim()) params.append('tags', tag.trim())
		}
		redirect(301, `/?${params}`)
	}

	// Convert datalist selections to filter params
	const q = url.searchParams.get('q')
	if (!q) return

	const params = new URLSearchParams(url.searchParams)
	params.delete('q')

	const selection = parseDatalistSelection(q)
	if (!selection) {
		params.set('query', q)
		redirect(303, `/?${params}`)
	}

	const config = DATALIST_TYPE_CONFIG[selection.type]
	let value = selection.label.toLowerCase()

	if (selection.type === 'tag') {
		const allTags = locals.tagService.getAllTags()
		const match = allTags.find((t) => t.name.toLowerCase() === value)
		value = match?.slug ?? value.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
	} else if (config.values) {
		value = config.values[selection.label] ?? value
	}

	params.append(config.param, value)
	redirect(303, `/?${params}`)
}
