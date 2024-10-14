import { db } from './index'
import { Status } from '$lib/server/db/common'

export type Collection = {
	id: number
	title: string
	type: 'collection'
	description: string
	children: string
	created_at: string
	updated_at: string
	status: Status
	published_at: string | null
	slug: string
}

export const get_collections = (): Collection[] => {
	console.warn('get_collections: No limit provided, risk of memory exhaustion')
	const stmt = db.prepare(`
        SELECT * FROM collections_view
    `)
	return stmt.all() as Collection[]
}
