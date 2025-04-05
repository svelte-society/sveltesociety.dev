import type { Handle } from '@sveltejs/kit'
import { search } from '$lib/server/services/new_search'

export const attach_search: Handle = async ({ event, resolve }) => {
	event.locals.search = search

	return resolve(event)
}
