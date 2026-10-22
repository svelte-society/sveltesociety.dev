import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'
import { createTestDatabase } from '../db/test-helpers'
import { MetadataService } from './metadata'

// Exercise persisted metadata and image bytes, replacing only the external HTTP boundary.
describe('GitHub thumbnail recovery', () => {
	const originalFetch = globalThis.fetch
	const image = Buffer.from('thumbnail fixture')
	const directory = path.join(
		process.env.STATE_DIRECTORY || '.state_directory',
		'files/gh/thumbnail-fixture/repository'
	)
	let db: ReturnType<typeof createTestDatabase>
	let service: MetadataService
	let imageRequests: number

	beforeEach(() => {
		db = createTestDatabase()
		service = new MetadataService(db)
		imageRequests = 0
		db.query(
			'INSERT INTO content (id, title, type, status, slug, metadata) VALUES (?, ?, ?, ?, ?, ?)'
		).run(
			'thumbnail-fixture',
			'Thumbnail fixture',
			'library',
			'pending_review',
			'thumbnail-fixture',
			'{}'
		)
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
		db.close()
		fs.rmSync(directory, { recursive: true, force: true })
	})

	function serveImage(response: (attempt: number) => Response | Promise<Response>) {
		globalThis.fetch = (async (input) => {
			const url = String(input)
			if (url.startsWith('https://api.github.com/repos/thumbnail-fixture/repository')) {
				return Response.json({ updated_at: '2026-10-22T00:00:00Z' })
			}
			if (url.startsWith('https://opengraph.githubassets.com/')) return response(++imageRequests)
			throw new Error(`Unexpected request: ${url}`)
		}) as typeof fetch
	}

	function refresh(thumbnail?: string) {
		return service.refreshMetadataForContent({
			id: 'thumbnail-fixture',
			type: 'library',
			title: 'Thumbnail fixture',
			slug: 'thumbnail-fixture',
			status: 'pending_review',
			metadata: { github: 'https://github.com/thumbnail-fixture/repository', thumbnail }
		} as Parameters<MetadataService['refreshMetadataForContent']>[0])
	}

	test.each([429, 503])('stores a thumbnail automatically after GitHub HTTP %s', async (status) => {
		serveImage((attempt) =>
			attempt === 1
				? new Response('Unavailable', { status })
				: new Response(image, { headers: { 'content-type': 'image/png' } })
		)
		await refresh()
		const row = db.query('SELECT metadata FROM content WHERE id = ?').get('thumbnail-fixture') as {
			metadata: string
		}
		expect(JSON.parse(row.metadata).thumbnail).toBe(
			'/files/gh/thumbnail-fixture/repository/thumbnail.png'
		)
		expect(fs.readFileSync(path.join(directory, 'thumbnail.png'))).toEqual(image)
	})

	test('recovers from a network failure without requiring an admin refresh', async () => {
		serveImage((attempt) => {
			if (attempt === 1) throw new TypeError('Connection reset')
			return new Response(image, { headers: { 'content-type': 'image/png' } })
		})
		expect((await refresh()).thumbnail).toBe('/files/gh/thumbnail-fixture/repository/thumbnail.png')
	})

	test('does not retry a successful non-image response', async () => {
		serveImage(
			() => new Response('<html>Unexpected</html>', { headers: { 'content-type': 'text/html' } })
		)
		expect((await refresh()).thumbnail).toBeUndefined()
		expect(imageRequests).toBe(1)
	})

	test('does not retry a missing repository image', async () => {
		serveImage(() => new Response('Not found', { status: 404 }))
		expect((await refresh()).thumbnail).toBeUndefined()
		expect(imageRequests).toBe(1)
	})

	test('bounds failed retries and preserves an existing thumbnail', async () => {
		serveImage(() => new Response('Unavailable', { status: 503 }))
		expect((await refresh('/existing.png')).thumbnail).toBe('/existing.png')
		expect(imageRequests).toBe(2)
	})
})
