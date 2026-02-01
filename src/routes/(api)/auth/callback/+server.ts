import type { RequestHandler } from './$types'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const code = url.searchParams.get('code')
	if (!code) {
		return new Response('No code provided', { status: 400 })
	}

	// Get access token
	const token_response = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			client_id: GITHUB_CLIENT_ID,
			client_secret: GITHUB_CLIENT_SECRET,
			code
		})
	})

	const { error, access_token } = await token_response.json()

	if (error) {
		return new Response('Error getting access token', { status: 500 })
	}

	// Get user info
	const user_info_response = await fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	})

	const user_info = await user_info_response.json()

	if (!user_info) {
		return new Response('Error getting user info', { status: 500 })
	}

	try {
		// Make sure user_info matches GitHubUserInfo interface
		const github_user = {
			id: user_info.id,
			login: user_info.login,
			email: user_info.email,
			name: user_info.name,
			avatar_url: user_info.avatar_url,
			bio: user_info.bio,
			location: user_info.location,
			twitter_username: user_info.twitter_username
		}

		// Create or update user using GitHub info
		const user = locals.userService.createOrUpdateUser(github_user)

		// Delete old user session if it exists
		const old_session_token = cookies.get('session_id')
		if (old_session_token) {
			locals.sessionService.deleteSession(old_session_token)
		}

		// Create new session
		const session_token = locals.sessionService.createSession(user.id)

		// Set cookie
		cookies.set('session_id', session_token, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
		})

		// Create a manual redirect response with appropriate headers
		return new Response(null, {
			status: 303,
			headers: {
				Location: '/',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				Pragma: 'no-cache'
			}
		})
	} catch (error) {
		console.error('Auth error:', error)
		if (error instanceof Error && error.message === 'GitHub OAuth provider not found') {
			return new Response('OAuth configuration error. Please contact the administrator.', {
				status: 500
			})
		}
		return new Response(
			'Authentication failed: ' + (error instanceof Error ? error.message : String(error)),
			{ status: 500 }
		)
	}
}
