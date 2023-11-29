import { error } from '@sveltejs/kit';
import { getPages } from '../pageList';
import type { SvxMetadata } from '../pageList';
import type { EventMetadata } from '$lib/Mdsvx';

export async function load() {
	const events = await getPages<EventMetadata>(
		import.meta.glob<SvxMetadata<EventMetadata>>('./**/*.svx')
	);

	if (events) {
		events.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

		return {
			events
		};
	}
	throw error(500);
}
