import type { RequestHandler } from './$types';
import { create_session, delete_session } from '$lib/server/db/session';
import { get_user_by_github_id, create_user, update_user_from_github_info } from '$lib/server/db/user';
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

    let user;

    if (!user_info) {
        return new Response('Error getting user info', { status: 500 });
    }

    // Check if user exists
    let user_result = await get_user_by_github_id(user_info.id)

    if (!user_result.data) {
        // Create user
        const create_user_result = await create_user(user_info)

        if (!create_user_result.success) {
            return new Response('Error creating user', { status: 500 });
        }

        user = create_user_result.data

    } else {
        const update_result = await update_user_from_github_info(user_result.data.id as number, user_info)

        if (!update_result.success) {
            return new Response('Error updating user', { status: 500 });
        }

        user = update_result.data

        if (!user) {
            return new Response('Error creating user', { status: 500 });
        }
    }

    if (!user) {
        return new Response('Error creating user', { status: 500 });
    }

    // Delete old user session
    const old_session_token = cookies.get('session_id')

    if (old_session_token) {
        const delete_session_result = await delete_session(old_session_token)

        if (!delete_session_result.success) {
            return new Response('Error deleting old session', { status: 500 });
        }
    }

    // Create new user session
    const session_create_result = await create_session(user.id as number)

    if (!session_create_result?.data) {
        return new Response('Error creating session', { status: 500 });
    }

    cookies.set('session_id', session_create_result?.data, {
        path: '/',
        httpOnly: true,
        secure: !dev,
    })

    redirect(302, '/')
};