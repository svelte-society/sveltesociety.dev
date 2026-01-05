import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

function parseDatalistSelection(q: string): { label: string; type: string } | null {
	const match = q.match(/^(.+)\s+\((category|tag|author|job-location|job-position|job-level)\)$/)
	if (match) {
		return { label: match[1], type: match[2] }
	}
	return null
}

// Job filter label to value mappings
const jobLocationValues: Record<string, string> = {
	'Remote': 'remote',
	'Hybrid': 'hybrid',
	'On-Site': 'on-site'
}

const jobPositionValues: Record<string, string> = {
	'Full-Time': 'full-time',
	'Part-Time': 'part-time',
	'Contract': 'contract',
	'Internship': 'internship'
}

const jobLevelValues: Record<string, string> = {
	'Entry Level': 'entry',
	'Junior': 'junior',
	'Mid-Level': 'mid',
	'Senior': 'senior',
	'Principal/Staff': 'principal'
}

function labelToSlug(label: string): string {
	return label
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
}

export const load: PageServerLoad = ({ url, locals }) => {
	const tagsParam = url.searchParams.get('tags')
	if (tagsParam && tagsParam.includes(',')) {
		const params = new URLSearchParams()

		url.searchParams.forEach((value, key) => {
			if (key !== 'tags') {
				params.append(key, value)
			}
		})

		const tags = tagsParam.split(',').filter(Boolean)
		for (const tag of tags) {
			params.append('tags', tag.trim())
		}

		const queryString = params.toString()
		redirect(301, queryString ? `/?${queryString}` : '/')
	}

	const q = url.searchParams.get('q')

	if (q) {
		const params = new URLSearchParams(url.searchParams)
		params.delete('q')

		const datalistSelection = parseDatalistSelection(q)

		if (datalistSelection) {
			if (datalistSelection.type === 'category') {
				params.append('type', datalistSelection.label.toLowerCase())
			} else if (datalistSelection.type === 'tag') {
				const allTags = locals.tagService.getAllTags()
				const matchingTag = allTags.find(
					(t) => t.name.toLowerCase() === datalistSelection.label.toLowerCase()
				)
				const tagSlug = matchingTag?.slug ?? labelToSlug(datalistSelection.label)
				params.append('tags', tagSlug)
			} else if (datalistSelection.type === 'author') {
				params.append('authors', datalistSelection.label)
			} else if (datalistSelection.type === 'job-location') {
				const value = jobLocationValues[datalistSelection.label] ?? datalistSelection.label.toLowerCase()
				params.append('remote', value)
			} else if (datalistSelection.type === 'job-position') {
				const value = jobPositionValues[datalistSelection.label] ?? datalistSelection.label.toLowerCase()
				params.append('position', value)
			} else if (datalistSelection.type === 'job-level') {
				const value = jobLevelValues[datalistSelection.label] ?? datalistSelection.label.toLowerCase()
				params.append('level', value)
			}
		} else {
			params.set('query', q)
		}

		const queryString = params.toString()
		redirect(303, queryString ? `/?${queryString}` : '/')
	}

	return
}
