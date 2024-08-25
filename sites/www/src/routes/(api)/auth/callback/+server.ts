import type { RequestHandler } from './$types';
import { create_or_update_user } from '$lib/server/db/user';
import { delete_session, create_session } from '$lib/server/db/session';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		return new Response('No code provided', { status: 400 });
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
	});

	const { error, access_token } = await token_response.json();

	if (error) {
		return new Response('Error getting access token', { status: 500 });
	}

	// Get user info
	const user_info_response = await fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});

	const user_info = await user_info_response.json();

	if (!user_info) {
		return new Response('Error getting user info', { status: 500 });
	}

	// Create or update user
	let user_result = create_or_update_user(user_info);

	if (!user_result) {
		return new Response('Error creating or updating user', { status: 500 });
	}

	// Delete old user session
	const old_session_token = cookies.get('session_id');

	if (old_session_token) {
		delete_session(old_session_token);
	}

	// Create new user session
	const session_create_result = create_session(user_result.id as number);

	cookies.set('session_id', session_create_result, {
		path: '/',
		httpOnly: true,
		secure: !dev
	});

	redirect(302, '/');
};
