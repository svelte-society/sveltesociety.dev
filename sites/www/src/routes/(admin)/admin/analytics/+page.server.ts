
import { get_events_by_interval, get_events_count_by_type } from '$lib/server/event_db/user_events';
import type { PageServerLoad } from './$types';

type TimeFrame = 'day' | 'week' | 'month' | 'year';

export const load = (async ({ url }) => {
    let interval = url.searchParams.get('interval') as TimeFrame || 'week';

    return {
        time_series: await get_events_by_interval(`1 ${interval}`),
        counts: await get_events_count_by_type(),
        interval
    };
}) satisfies PageServerLoad;
