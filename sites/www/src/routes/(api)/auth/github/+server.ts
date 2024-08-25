import type { RequestHandler } from './$types';
import { GITHUB_AUTH_URL } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	redirect(302, GITHUB_AUTH_URL);
};
