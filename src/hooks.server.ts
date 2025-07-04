import { sequence } from '@sveltejs/kit/hooks'
import { add_user_data } from './hooks/add_user_data'
import { protect_routes } from './hooks/protect_routes'
import { attach_services } from './hooks/attach_services'
import type { ServerInit } from '@sveltejs/kit'
import { initiate_db } from './lib/server/db/initiate'
import { run_seeds } from './lib/server/db/seeds/index'
import { dev } from '$app/environment'
import { hasData } from './lib/server/db/utils'
import { SEED_DATABASE } from '$env/static/private'

export const init: ServerInit = async () => {
	console.log('Database initializing...')
	// Initialize the database structure
	initiate_db()

	if (!hasData()) {
		const seedMode = SEED_DATABASE || (dev ? 'full' : 'minimal')
		console.log(`Seed mode: ${seedMode}`)
		
		if (seedMode !== 'none') {
			run_seeds(seedMode)
			console.log(`Database seeding completed with mode: ${seedMode}`)
		} else {
			console.log('Database seeding disabled by SEED_DATABASE=none')
		}
	}
}

export const handle = sequence(attach_services, add_user_data, protect_routes)
