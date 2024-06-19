import type { RequestHandler } from './$types';
import { create_session } from '$lib/server/db/session';
import { get_user_by_github_id, create_user, update_user_info } from '$lib/server/db/user';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        return new Response('No code provided', { status: 400 });
    }

    // Get access token
    const token_response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code
        })
    })

    const { error, access_token } = await token_response.json()

    if (error) {
        return new Response('Error getting access token', { status: 500 });
    }

    // Get user info
    const user_info_response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })

    const user_info = await user_info_response.json()

    if (!user_info) {
        return new Response('Error getting user info', { status: 500 });
    }

    // Check if user exists
    let user = await get_user_by_github_id(user_info.id)

    if (!user) {
        // Create user
        const result = await create_user(user_info)

        if (!result.success) {
            return new Response('Error creating user', { status: 500 });
        }

        user = result.user
    }

    if (!user) {
        return new Response('Error creating user', { status: 500 });
    }

    // Update user info + Create Session and store in cookie
    const [session_id] = await Promise.all([
        create_session(user.id as number),
        update_user_info(user.id as number, user_info)
    ])

    if (!session_id) {
        return new Response('Error creating session', { status: 500 });
    }

    cookies.set('session_id', session_id, {
        path: '/',
        httpOnly: true,
        secure: !dev,
    })

    redirect(302, '/')
};