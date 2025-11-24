import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { uploadThumbnail, getPublicUrl, isS3Enabled } from '$lib/server/services/s3-storage'

const { STATE_DIRECTORY = '.state_directory' } = process.env

if (!fs.existsSync(STATE_DIRECTORY)) {
	fs.mkdirSync(STATE_DIRECTORY, { recursive: true })
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request }) {
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

				const og_image_url = `https://opengraph.githubassets.com/${crypto.randomUUID()}/${owner}/${repo}`

				let response

				try {
					response = await fetch(og_image_url)
				} catch (error) {
					console.error(error)
					break
				}

				if (!response.ok) {
					console.log('Could not refresh OG image. Rate limit exceeded: ' + og_image_url)
					break
				}

				const thumbnailBuffer = Buffer.from(await response.arrayBuffer())

				// Ensure directory exists before writing
				const dir = path.dirname(file_path)
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true })
				}

				// Write to local filesystem for caching
				fs.writeFileSync(file_path, thumbnailBuffer)

				// Also upload to S3 if enabled
				if (isS3Enabled) {
					try {
						const extension = response.headers.get('content-type')?.split('/').at(-1) || 'png'
						const s3Key = `gh/${rest.join('/')}`
						await uploadThumbnail(s3Key, thumbnailBuffer, {
							contentType: response.headers.get('content-type') || 'image/png'
						})
						console.log('Refreshed and uploaded to S3: ' + og_image_url)
					} catch (error) {
						console.error('Failed to upload refreshed thumbnail to S3:', error)
					}
				} else {
					console.log('Refreshed OG image: ' + og_image_url)
				}

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
