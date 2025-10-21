import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import { GitHubImporter } from '$lib/server/services/importers/github'

const { STATE_DIRECTORY = '.state_directory' } = process.env

if (!fs.existsSync(STATE_DIRECTORY)) {
	fs.mkdirSync(STATE_DIRECTORY, { recursive: true })
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request, locals }) {
	const p = decodeURIComponent(params.path)

	const file_path = path.normalize(path.join(STATE_DIRECTORY, 'files', p))

	const exists = fs.existsSync(file_path)

	let stats

	if (exists) {
		stats = fs.statSync(file_path)
	}

	const [source, ...rest] = p.split('/')

	switch (source) {
		case 'gh': {
			const T = 1000 * 60 * 3600 * 24 * 14 // 14 days

			if (!exists || Date.now() - stats?.mtime.getTime() >= T) {
				const [owner, repo] = rest

				const importer = new GitHubImporter(locals.externalContentService, locals.cacheService)
				const contentId = await importer.importRepository(owner, repo)

				stats = fs.statSync(file_path)
			}

			break
		}
		case 'yt': {
			break
		}
	}

	if (!stats) {
		return new Response('not found', { status: 404 })
	}

	const etag = `W/"${stats.size}-${stats.mtime.getTime()}"`

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304 })
	}

	const headers = {
		ETag: etag,
		'Content-Type': mimes.lookup(file_path),
		'Content-Length': stats.size,
		'Cache-Control': 'max-age=60',
		'Last-Modified': stats.mtime.toUTCString()
	}

	const nodejs_rstream = fs.createReadStream(file_path)

	const web_rstream = Readable.toWeb(nodejs_rstream)

	return new Response(web_rstream, { headers })
}

const mimes = {
	// Text
	txt: 'text/plain',
	pdf: 'application/pdf',
	// Images
	webp: 'image/webp',
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	avif: 'image/avif',
	// Audio
	mp3: 'audio/mp3',
	// Video
	webm: 'video/webm',
	mp4: 'video/mp4',

	lookup(string) {
		const ext = string.toLowerCase().split('.').at(-1)
		return (ext && this[ext]) ?? 'application/octet-stream'
	}
}
