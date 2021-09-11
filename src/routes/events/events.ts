/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(): Promise<EndpointOutput> {
	const events = await Promise.all(
		Object.entries(import.meta.glob('./*.svx')).map(async ([path, page]) => {
			const { metadata } = await page();
			const filename = path.split('/').pop();
			return { ...metadata, filename };
		})
	);

	if (events) {
		events.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

		return {
			body: {
				events
			}
		};
	}
	return {
		error: new Error(),
		body: undefined
	};
}
