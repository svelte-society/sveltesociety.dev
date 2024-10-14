import type { RequestHandler } from './$types'
import { redirect } from '@sveltejs/kit'
import { delete_session } from '$lib/server/db/session'

export const GET: RequestHandler = async ({ cookies, request }) => {
	const session_id = cookies.get('session_id')

	if (!session_id) {
		return new Response('No session id provided', { status: 400 })
	}

	delete_session(session_id)
	cookies.delete('session_id', { path: '/' })

	redirect(302, '/')
}
