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
// Using static Inter fonts from the same directory as this endpoint
const fontRegular = readFileSync(join(import.meta.dirname, 'Inter_24pt-Regular.ttf'))
const fontBold = readFileSync(join(import.meta.dirname, 'Inter_24pt-Bold.ttf'))
const fontSemiBold = readFileSync(join(import.meta.dirname, 'Inter_24pt-SemiBold.ttf'))

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
		// Generate SVG using Satori
		// Note: Satori is CPU-bound but runs quickly (<100ms for simple templates)
		// Sharp handles the PNG conversion in native worker threads
		const svg = await satori(
			{
				type: 'div',
				props: {
					style: {
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						height: '100%',
						padding: '80px',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						color: 'white',
						position: 'relative'
					},
					children: [
						// Type badge
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
												background: 'rgba(255, 255, 255, 0.2)',
												padding: '12px 24px',
												borderRadius: '8px',
												fontSize: '24px',
												fontWeight: '600',
												letterSpacing: '1px',
												textTransform: 'uppercase'
											},
											children: typeLabel
										}
									}
								]
							}
						},
						// Title
						{
							type: 'div',
							props: {
								style: {
									fontSize: '64px',
									fontWeight: '700',
									lineHeight: '1.2',
									marginBottom: 'auto',
									maxWidth: '100%',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									display: '-webkit-box',
									WebkitLineClamp: '3',
									WebkitBoxOrient: 'vertical'
								},
								children: title
							}
						},
						// Branding footer
						{
							type: 'div',
							props: {
								style: {
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginTop: '40px',
									paddingTop: '40px',
									borderTop: '2px solid rgba(255, 255, 255, 0.2)'
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												fontSize: '36px',
												fontWeight: '700',
												display: 'flex',
												alignItems: 'center',
												gap: '16px'
											},
											children: [
												// Svelte logo placeholder (orange circle)
												{
													type: 'div',
													props: {
														style: {
															width: '48px',
															height: '48px',
															background: '#FF3E00',
															borderRadius: '50%'
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
												opacity: 0.8
											},
											children: 'sveltesociety.dev'
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
