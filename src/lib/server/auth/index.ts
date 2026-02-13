import {
	GITHUB_AUTHORIZATION_CALLBACK_URL,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$env/static/private'

export const GITHUB_OAUTH_STATE_COOKIE = 'github_oauth_state'

export const getGitHubAuthUrl = (state: string) => {
	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: GITHUB_AUTHORIZATION_CALLBACK_URL,
		state
	})

	return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export const exchangeGitHubCodeForToken = async (code: string) => {
	const response = await fetch('https://github.com/login/oauth/access_token', {
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

	const data = await response.json()
	return data
}

export const getGitHubUserInfo = async (accessToken: string) => {
	const response = await fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	})

	const data = await response.json()
	return data
}
