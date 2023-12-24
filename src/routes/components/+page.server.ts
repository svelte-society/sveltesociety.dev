import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = async () => {
	redirect(308, '/packages');
};
