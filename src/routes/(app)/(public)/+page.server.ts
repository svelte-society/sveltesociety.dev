import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {
	remoteOptionsLabelMap,
	positionTypeLabelMap,
	seniorityLevelLabelMap
} from '$lib/constants/job-options'

function parseDatalistSelection(q: string): { label: string; type: string } | null {
	const match = q.match(/^(.+)\s+\((category|tag|author|job-location|job-position|job-level)\)$/)
	if (match) {
		return { label: match[1], type: match[2] }
	}
	return null
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
				const value =
					remoteOptionsLabelMap[datalistSelection.label] ?? datalistSelection.label.toLowerCase()
				params.append('remote', value)
			} else if (datalistSelection.type === 'job-position') {
				const value =
					positionTypeLabelMap[datalistSelection.label] ?? datalistSelection.label.toLowerCase()
				params.append('position', value)
			} else if (datalistSelection.type === 'job-level') {
				const value =
					seniorityLevelLabelMap[datalistSelection.label] ?? datalistSelection.label.toLowerCase()
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
