import { db } from './index'

export type Event = {
	timestamp: string
	userId: number
	eventType: string
	contentId: number | null
	additionalInfo: { [key: string]: any } | null
}

export const get_events_by_interval = async (
	interval: string = '1 century',
	start = '2024-01-01',
	end = '2024-12-31'
) => {
	const stmt = await db.prepare(`
        SELECT 
            time_bucket(?, timestamp) AS time,
            SUM(CASE WHEN event_type = 'like' THEN 1 ELSE 0 END) AS like_count,
            SUM(CASE WHEN event_type = 'save' THEN 1 ELSE 0 END) AS save_count,
            SUM(CASE WHEN event_type = 'signup' THEN 1 ELSE 0 END) AS signup_count
        FROM user_events
        WHERE event_type IN ('like', 'save', 'signup')
        GROUP BY time
        ORDER BY time;
    `)

	const result = await stmt.all(interval)

	return result
}

export const get_events_count_by_type = async () => {
	const stmt = await db.prepare(` 
        SELECT 
            event_type,
            COUNT(*) AS count
        FROM user_events
        GROUP BY event_type
    `)

	const result = await stmt.all()

	return result.reduce(
		(acc, { event_type, count }) => {
			acc[event_type] = count
			return acc
		},
		{} as Record<string, bigint>
	)
}
