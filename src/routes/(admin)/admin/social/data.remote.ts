import { query } from '$app/server'
import { getRequestEvent } from '$app/server'

export const getPosts = query(async () => {
	const { locals } = getRequestEvent()
	return locals.socialService.getPosts()
})

export const getAccounts = query(async () => {
	const { locals } = getRequestEvent()
	return locals.socialService.getAccounts()
})
