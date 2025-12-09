import type { RequestHandler } from './$types'
import { dev } from '$app/environment'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	if (!dev) {
		throw error(404, 'Not found')
	}

	const userType = url.searchParams.get('user') || 'admin'

	const testUsers: Record<string, { github_id: number; login: string; name: string }> = {
		admin: { github_id: 1, login: 'test_admin', name: 'Test Admin' },
		contributor: { github_id: 2, login: 'test_contributor', name: 'Test Contributor' },
		viewer: { github_id: 3, login: 'test_viewer', name: 'Test Viewer' }
	}

	const testUser = testUsers[userType]
	if (!testUser) {
		throw error(400, `Invalid user type: ${userType}. Use: admin, contributor, or viewer`)
	}

	try {
		const user = locals.userService.createOrUpdateUser({
			id: testUser.github_id,
			login: testUser.login,
			name: testUser.name,
			email: `${testUser.login}@test.local`,
			avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${testUser.login}`,
			bio: null,
			location: null,
			twitter_username: null
		})

		const oldSessionToken = cookies.get('session_id')
		if (oldSessionToken) {
			locals.sessionService.deleteSession(oldSessionToken)
		}

		const sessionToken = locals.sessionService.createSession(user.id)

		cookies.set('session_id', sessionToken, {
			path: '/',
			httpOnly: true,
			secure: false
		})

		return new Response(null, {
			status: 303,
			headers: {
				Location: '/',
				'Cache-Control': 'no-store'
			}
		})
	} catch (err) {
		console.error('Dev login error:', err)
		throw error(500, 'Failed to create dev session')
	}
}
