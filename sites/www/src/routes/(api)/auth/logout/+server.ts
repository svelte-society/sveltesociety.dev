import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { sessionService } from '$lib/server/db/services/session';

export const GET: RequestHandler = async ({ cookies }) => {
    const session_id = cookies.get('session_id')

    if (!session_id) {
        return new Response('No session id provided', { status: 400 });
    }

    sessionService.delete_session(session_id)
    cookies.delete('session_id', { path: '/' })

    redirect(302, '/')
};