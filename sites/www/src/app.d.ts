import type { User } from '$lib/server/db/user';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };

