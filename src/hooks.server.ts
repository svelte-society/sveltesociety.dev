import { env } from '$env/dynamic/private'

import { sequence } from '@sveltejs/kit/hooks'
import { add_user_data } from './hooks/add_user_data'
import { protect_routes } from './hooks/protect_routes'
import { attach_services } from './hooks/attach_services'
import { initiate_db } from './lib/server/db/initiate'

import type { ServerInit } from '@sveltejs/kit'
import type { HandleServerError } from '@sveltejs/kit'

export const init: ServerInit = async () => {
	await initiate_db()
}

export const handle = sequence(attach_services, add_user_data, protect_routes)

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	if (status !== 500) return

	if (!env.DISCORD_WEBHOOK) return

	const json = JSON.stringify(
		{
			status,
			event: {
				method: event.request.method,
				url: event.url.href
			},
			error: {
				message: error.message,
				stack: error.stack
			}
		},
		null,
		2
	)

	const content = '```json\n' + json.substring(0, 2000) + '\n```'

	fetch(env.DISCORD_WEBHOOK, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ content })
	}).catch((error) => {
		console.error('Failed to reach Discord Webhook')
	})
}
