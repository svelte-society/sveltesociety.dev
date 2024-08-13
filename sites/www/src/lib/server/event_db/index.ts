import { Database } from "duckdb-async";

export const db = await Database.create('local_event.db')
