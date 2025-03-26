import type { RequestHandler } from './$types'
import { redirect } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ cookies, locals }) => {
	const session_id = cookies.get('session_id')

	if (!session_id) {
		return new Response('No session id provided', { status: 400 })
	}

	locals.sessionService.deleteSession(session_id)
	cookies.delete('session_id', { path: '/' })

	throw redirect(302, '/')
}
