import type { User } from '$lib/server/db/user'
import type Database from 'better-sqlite3'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
			db: Database
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
