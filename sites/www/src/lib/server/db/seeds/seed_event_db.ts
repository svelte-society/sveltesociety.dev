import type { Database } from "duckdb-async";
import { event_sample_data } from "./data_seed_events";

export async function seedEventUserEvents(db: Database) {
    const stmt = await db.prepare(`
        INSERT INTO user_events (timestamp, user_id, event_type, content_id, additional_info)
        VALUES (?, ?, ?, ?, ?)
    `);

    console.log('Seeding event data...');

    event_sample_data.forEach(async event => {
        stmt.run(
            event.timestamp,
            event.userId,
            event.eventType,
            event.contentId,
            JSON.stringify(event.additionalInfo)
        );
    });

    await stmt.finalize()

    console.log('Event data seeded successfully');

}