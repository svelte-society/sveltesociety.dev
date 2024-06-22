import type { db } from "$lib/server/db";
import { InferSelectModel } from "drizzle-orm";
import { users } from "./lib/server/db/schema";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: InferSelectModel<typeof users, 'id'> | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
