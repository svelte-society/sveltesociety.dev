import { sequence } from '@sveltejs/kit/hooks'
import { add_user_data } from './hooks/add_user_data'
import { protect_routes } from './hooks/protect_routes'
import { attach_services } from './hooks/attach_services'
import { request_guard } from './hooks/request_guard'
import type { ServerInit } from '@sveltejs/kit'
import { initiate_db } from './lib/server/db/initiate'

export const init: ServerInit = async () => {
	await initiate_db()
}

export const handle = sequence(request_guard, attach_services, add_user_data, protect_routes)
