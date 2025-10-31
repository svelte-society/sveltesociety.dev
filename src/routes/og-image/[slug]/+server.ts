import { error } from '@sveltejs/kit'
import sharp from 'sharp'
import satori from 'satori'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { RequestHandler } from './$types'

/**
 * Dynamic OG Image Generation Endpoint
 *
 * Generates 1200x630px PNG images for content pages with:
 * - Svelte Society branding
 * - Content title
 * - Content type badge
 * - Gradient background
 *
 * Images are cached to the filesystem in STATE_DIRECTORY/files/og/
 * This follows the same pattern as YouTube thumbnails and other cached files
 */

const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630

// Use the same STATE_DIRECTORY as other services (YouTube importer, etc.)
const { STATE_DIRECTORY = '.state_directory' } = process.env
const CACHE_DIR = join(STATE_DIRECTORY, 'files', 'og')

// Ensure cache directory exists
if (!existsSync(CACHE_DIR)) {
	mkdirSync(CACHE_DIR, { recursive: true })
}

// In-flight request tracking to prevent duplicate generation
// If multiple requests come in for the same slug simultaneously,
// only generate once and share the result
const inflightRequests = new Map<string, Promise<Buffer>>()

// Load fonts for Satori (load once at startup)
// Note: Satori requires TTF/OTF fonts, not WOFF/WOFF2
// Fonts are stored in static/fonts/og directory
const fontRegular = readFileSync(join(process.cwd(), 'static/fonts/og/Inter_24pt-Regular.ttf'))
const fontBold = readFileSync(join(process.cwd(), 'static/fonts/og/Inter_24pt-Bold.ttf'))
const fontSemiBold = readFileSync(join(process.cwd(), 'static/fonts/og/Inter_24pt-SemiBold.ttf'))

export const GET: RequestHandler = async ({ params, locals, setHeaders }) => {
	const { slug } = params

	// Check filesystem cache first
	const cacheFilePath = join(CACHE_DIR, `${slug}.png`)
	if (existsSync(cacheFilePath)) {
		try {
			const cachedImage = readFileSync(cacheFilePath)
			setHeaders({
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age=31536000, immutable'
			})
			return new Response(cachedImage)
		} catch (err) {
			console.error(`Error reading cached OG image for ${slug}:`, err)
			// Continue to generate new image if cache read fails
		}
	}

	// Check if generation is already in progress for this slug
	// This prevents duplicate work if multiple requests come in simultaneously
	let generationPromise = inflightRequests.get(slug)

	if (!generationPromise) {
		// Start new generation
		generationPromise = generateImage(slug, locals)
		inflightRequests.set(slug, generationPromise)

		// Clean up after generation completes (success or failure)
		generationPromise.finally(() => {
			inflightRequests.delete(slug)
		})
	}

	try {
		const pngBuffer = await generationPromise

		setHeaders({
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		})

		return new Response(pngBuffer)
	} catch (err) {
		console.error('Error generating OG image:', err)
		throw error(500, 'Failed to generate OG image')
	}
}

/**
 * Generate OG image for a given slug
 * Extracted into separate function for request deduplication
 */
async function generateImage(slug: string, locals: App.Locals): Promise<Buffer> {
	// Get content by slug
	const content = locals.contentService.getContentBySlug(slug)

	// Default fallback for missing content
	const title = content?.title || 'Svelte Society'
	const contentType = content?.type || 'content'
	const typeLabel = contentType.charAt(0).toUpperCase() + contentType.slice(1)


	try {
		// Generate SVG using Satori with Svelte Society branding
		// Colors from app.css theme: Svelte orange (FF3E00) and complementary colors
		const svg = await satori(
			{
				type: 'div',
				props: {
					style: {
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						height: '100%',
						background: '#1e293b', // Dark slate background
						color: 'white',
						position: 'relative',
						fontFamily: 'Inter'
					},
					children: [
						// Top accent bar - Svelte orange gradient
						{
							type: 'div',
							props: {
								style: {
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									height: '8px',
									background: 'linear-gradient(90deg, #FF3E00 0%, #FF6B35 100%)'
								}
							}
						},
						// Content container
						{
							type: 'div',
							props: {
								style: {
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									padding: '80px'
								},
								children: [
									// Type badge with Svelte orange
									{
										type: 'div',
										props: {
											style: {
												display: 'flex',
												alignItems: 'center',
												marginBottom: '40px'
											},
											children: [
												{
													type: 'div',
													props: {
														style: {
															background: '#FF3E00',
															padding: '10px 20px',
															borderRadius: '6px',
															fontSize: '20px',
															fontWeight: '700',
															letterSpacing: '0.5px',
															textTransform: 'uppercase',
															color: 'white'
														},
														children: typeLabel
													}
												}
											]
										}
									},
									// Title with better spacing
									{
										type: 'div',
										props: {
											style: {
												fontSize: '72px',
												fontWeight: '800',
												lineHeight: '1.1',
												marginBottom: 'auto',
												maxWidth: '100%',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												display: '-webkit-box',
												WebkitLineClamp: '3',
												WebkitBoxOrient: 'vertical',
												color: 'white'
											},
											children: title
										}
									},
									// Branding footer with Svelte orange accent
									{
										type: 'div',
										props: {
											style: {
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												marginTop: '40px'
											},
											children: [
												{
													type: 'div',
													props: {
														style: {
															fontSize: '32px',
															fontWeight: '700',
															display: 'flex',
															alignItems: 'center',
															gap: '16px',
															color: 'white'
														},
														children: [
															// Svelte Society logo as base64 SVG
															{
																type: 'img',
																props: {
																	src: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 223 222" fill="none"><g clip-path="url(#a)"><path fill="#FF3E00" d="M111.44 221.28c61.1 0 110.64-49.53 110.64-110.64C222.08 49.54 172.54 0 111.43 0 50.34 0 .8 49.54.8 110.64s49.54 110.64 110.64 110.64Z"/><path fill="#EEE" stroke="#000" stroke-width="3.16" d="M111.44 191.55a79.9 79.9 0 1 0 0-159.82 79.9 79.9 0 0 0 0 159.82Z"/><path fill="#EEE" d="m192.17 150.15 11.44-1.9 5.58 2.1 1.02-2.7-5.58-2.1-7.33-9-1.15 3.07 5.23 6.16-.05.14-8 1.16-1.16 3.06ZM174.03 177.13l3.45-3.53 9.7 9.49 2-2.05-9.69-9.5 3.47-3.53-1.74-1.7-8.93 9.12 1.74 1.7ZM149.31 207.35l9.46-4.46-1.03-2.2-6.85 3.23-1.86-3.95 6.3-2.97-1.04-2.2-6.3 2.98-1.85-3.93 6.79-3.2-1.04-2.2-9.4 4.44 6.82 14.46ZM113.33 199.35h-2.9v16h2.9v-16ZM83.06 200.82c1.19-3.38-.3-6.46-3.45-8.08-3.72-1.91-7.9-.64-10.27 3.95-2.36 4.6-1 8.73 2.76 10.66 3.38 1.74 6.75.7 8.54-1.81l-2.6-1.35c-1.17 1.5-3.02 1.74-4.72.86-2.3-1.18-3.07-3.76-1.39-7.03 1.65-3.2 4.2-4.15 6.53-2.95 1.73.89 2.58 2.56 2 4.42l2.6 1.33ZM46.93 183.19c4.2-3.01 4.84-7.35 2.4-10.76-2.46-3.41-6.76-4.2-10.96-1.18-4.2 3.01-4.84 7.35-2.4 10.76 2.45 3.4 6.76 4.2 10.96 1.18Zm-1.7-2.37c-2.95 2.12-5.62 1.8-7.14-.33-1.52-2.11-.98-4.75 1.97-6.87 2.96-2.13 5.64-1.79 7.15.33 1.52 2.12.98 4.75-1.97 6.87ZM25.86 146.8l.84 2.65c2.56-.88 3.68-3.66 2.64-6.9-1.02-3.2-3.59-5.02-6.28-4.15-2.18.7-2.94 2.65-2.79 5.36l.11 1.88c.11 1.78-.06 3.03-1.24 3.41-1.3.41-2.57-.55-3.14-2.34-.55-1.73-.2-3.32 1.36-3.94l-.87-2.71c-3 1.08-3.98 3.87-2.84 7.42 1.17 3.65 3.67 5.2 6.35 4.34 2.64-.85 3.15-3.42 2.96-5.88l-.1-1.54c-.1-1.35 0-2.87 1.27-3.26 1.15-.36 2.32.4 2.87 2.12.52 1.65.1 2.98-1.14 3.53ZM185.7 63.35l4.93 9.23 2.14-1.14-3.56-6.68 3.85-2.05 3.28 6.14 2.14-1.14-3.28-6.15 3.83-2.04 3.53 6.62 2.15-1.15-4.9-9.17-14.11 7.53ZM167.62 25.81l3.98 2.93-8.04 10.92 2.31 1.7 8.04-10.91 3.98 2.93 1.44-1.96-10.27-7.56-1.44 1.95ZM124.03 24.07l9.82 1.55.38-2.4-6.96-1.1 2.1-13.4-2.86-.44-2.48 15.8ZM84.39 27.16l10.06-2.87-.67-2.34-7.27 2.08-1.2-4.2 6.7-1.9-.67-2.34-6.7 1.91-1.2-4.17 7.22-2.06L90 8.93 80 11.8l4.4 15.37ZM44.04 31.68l-2.38 2.11L56.5 42l2.67-2.37-6.42-15.7-2.38 2.12 5.26 12.16-.12.11-11.47-6.63ZM24.63 59.8l1.24-2.5c-2.45-1.15-5.18.06-6.7 3.1-1.5 3.02-.92 6.12 1.61 7.37 2.06 1.02 3.97.14 5.74-1.91l1.23-1.42c1.16-1.35 2.15-2.13 3.27-1.59 1.22.62 1.46 2.18.62 3.88-.8 1.62-2.16 2.52-3.72 1.87l-1.26 2.56c2.9 1.3 5.55-.02 7.2-3.35 1.71-3.44.99-6.28-1.53-7.54-2.49-1.23-4.64.26-6.22 2.16l-1 1.17c-.87 1.04-2 2.07-3.18 1.46-1.08-.55-1.39-1.9-.58-3.53.77-1.54 2-2.2 3.28-1.73ZM15.25 107a2.5 2.5 0 1 0 0-4.98 2.5 2.5 0 0 0 0 4.98ZM206.63 107a2.5 2.5 0 1 0 0-4.98 2.5 2.5 0 0 0 0 4.98Z"/><path fill="#FF3E00" d="M152.92 66.98c-11.24-16.22-33.44-21.02-49.5-10.71l-28.19 18.1a32.73 32.73 0 0 0-14.61 21.8 34.6 34.6 0 0 0 3.35 22.06 32.78 32.78 0 0 0-4.83 12.18 35 35 0 0 0 5.9 26.29c11.23 16.21 33.43 21.02 49.48 10.7l28.2-18.03a32.56 32.56 0 0 0 14.6-21.8 34.59 34.59 0 0 0-3.35-22.04 32.98 32.98 0 0 0 4.84-12.18 35.03 35.03 0 0 0-5.89-26.28"/><path fill="#EEE" d="M101.19 157.57c-4.46 1.15-9.17.91-13.49-.67a22.48 22.48 0 0 1-10.67-8.19 20.45 20.45 0 0 1-3.55-15.57c.16-.88.39-1.75.68-2.6l.53-1.6 1.45 1.07a36.86 36.86 0 0 0 11.05 5.44l1.08.3-.1 1.08a6.28 6.28 0 0 0 1.2 4.14 6.77 6.77 0 0 0 9 1.91l28.29-17.85a5.86 5.86 0 0 0 2.6-6.37 6.78 6.78 0 0 0-10.04-4.15l-10.86 6.82a20.9 20.9 0 0 1-5.75 2.5c-4.45 1.13-9.15.9-13.46-.69a22.47 22.47 0 0 1-10.65-8.17 20.46 20.46 0 0 1-3.53-15.57 19.22 19.22 0 0 1 8.83-12.96l28.37-17.85a20.8 20.8 0 0 1 5.71-2.49c4.46-1.14 9.17-.9 13.48.68a22.46 22.46 0 0 1 10.67 8.18 20.46 20.46 0 0 1 3.56 15.58c-.17.88-.4 1.75-.68 2.6l-.54 1.62-1.44-1.08a36.86 36.86 0 0 0-11.08-5.47l-1.09-.31.1-1.08a6.25 6.25 0 0 0-1.15-4.17 6.76 6.76 0 0 0-8.97-1.83L92.4 98.64a5.89 5.89 0 0 0-2.6 6.36 6.77 6.77 0 0 0 9.98 4.16l10.87-6.82a20.33 20.33 0 0 1 5.75-2.5 22.71 22.71 0 0 1 13.48.67 22.45 22.45 0 0 1 10.67 8.18 20.47 20.47 0 0 1 3.56 15.58 19.22 19.22 0 0 1-8.83 12.95l-28.34 17.85a20.99 20.99 0 0 1-5.75 2.5Z"/></g><clipPath id="a"><path fill="#fff" d="M.8 0h221.27v221.28H.8z"/></clipPath></svg>`).toString('base64')}`,
																	style: {
																		width: '56px',
																		height: '56px'
																	}
																}
															},
															{
																type: 'div',
																props: {
																	children: 'Svelte Society'
																}
															}
														]
													}
												},
												{
													type: 'div',
													props: {
														style: {
															fontSize: '24px',
															color: '#94a3b8', // slate-400
															fontWeight: '500'
														},
														children: 'sveltesociety.dev'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			},
			{
				width: OG_IMAGE_WIDTH,
				height: OG_IMAGE_HEIGHT,
				fonts: [
					{
						name: 'Inter',
						data: fontRegular,
						weight: 400,
						style: 'normal'
					},
					{
						name: 'Inter',
						data: fontSemiBold,
						weight: 600,
						style: 'normal'
					},
					{
						name: 'Inter',
						data: fontBold,
						weight: 700,
						style: 'normal'
					}
				]
			}
		)

		// Convert SVG to PNG using Sharp (non-blocking, uses worker threads)
		const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()

		// Cache the result to filesystem
		const cacheFilePath = join(CACHE_DIR, `${slug}.png`)
		try {
			writeFileSync(cacheFilePath, pngBuffer)
		} catch (err) {
			console.error(`Error writing OG image cache for ${slug}:`, err)
			// Continue even if cache write fails - we can still return the image
		}

		return pngBuffer
	} catch (err) {
		console.error(`Error generating OG image for ${slug}:`, err)
		throw new Error('Failed to generate OG image')
	}
}
