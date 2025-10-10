import { sequence } from '@sveltejs/kit/hooks'
import { add_user_data } from './hooks/add_user_data'
import { protect_routes } from './hooks/protect_routes'
import { attach_services } from './hooks/attach_services'
import type { ServerInit } from '@sveltejs/kit'
import { initiate_db } from './lib/server/db/initiate'

export const init: ServerInit = async () => {
	initiate_db()
}

export const handle = sequence(attach_services, add_user_data, protect_routes)
