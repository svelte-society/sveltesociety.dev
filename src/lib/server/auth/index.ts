import { env } from '$env/dynamic/private'

export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.GITHUB_AUTHORIZATION_CALLBACK_URL}`

export const exchangeGitHubCodeForToken = async (code: string) => {
	const response = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			client_id: env.GITHUB_CLIENT_ID,
			client_secret: env.GITHUB_CLIENT_SECRET,
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
