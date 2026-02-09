import type { RequestHandler } from './$types'
import { GITHUB_OAUTH_STATE_COOKIE, getGitHubAuthUrl } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'

export const GET: RequestHandler = async ({ cookies }) => {
	const state = crypto.randomUUID()
	cookies.set(GITHUB_OAUTH_STATE_COOKIE, state, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 10 * 60 // 10 minutes
	})

	redirect(302, getGitHubAuthUrl(state))
}
