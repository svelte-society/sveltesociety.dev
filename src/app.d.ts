import type Database from 'bun:sqlite'
import type { User } from '$lib/server/db/user'

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
