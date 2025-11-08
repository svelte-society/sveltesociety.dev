import { error } from '@sveltejs/kit'
import sharp from 'sharp'
import satori from 'satori'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { RequestHandler } from './$types'
import { read } from '$app/server'

import fontRegularFile from './Inter_24pt-Regular.ttf'
import fontBoldFile from './Inter_24pt-Bold.ttf'
import fontSemiBoldFile from './Inter_24pt-SemiBold.ttf'

import type { ContentData } from './types'
import { OG_IMAGE_DIMENSIONS } from './constants'
import { createRecipeLayout } from './layouts/recipe'
import { createLibraryLayout } from './layouts/library'
import { createCollectionLayout } from './layouts/collection'
import { createAnnouncementLayout } from './layouts/announcement'
import { createVideoLayout } from './layouts/video'

/**
 * Dynamic OG Image Generation Endpoint
 *
 * Generates 1200x630px PNG images for content pages with:
 * - Content-type-specific layouts
 * - Svelte Society branding
 * - Recipes: title + description
 * - Libraries: title + owner + GitHub stats
 * - Collections: title + preview of items
 * - Announcements: title + description
 * - Videos: thumbnail background + title overlay
 *
 * Images are cached to the filesystem in STATE_DIRECTORY/files/og/
 * This follows the same pattern as YouTube thumbnails and other cached files
 */

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

// Load fonts for Satori
// Note: Satori requires TTF/OTF fonts, not WOFF/WOFF2
// Fonts are loaded from the filesystem and cached in memory
let fontRegular: Buffer | null = null
let fontBold: Buffer | null = null
let fontSemiBold: Buffer | null = null

// Load fonts once on first request
async function ensureFontsLoaded(origin: string): Promise<void> {
	if (fontRegular && fontBold && fontSemiBold) return

	// Load fonts from the static directory via fetch
	// Using the origin from the request to construct the full URL
	const [regular, bold, semiBold] = await Promise.all([
		read(fontRegularFile).arrayBuffer(),
		read(fontBoldFile).arrayBuffer(),
		read(fontSemiBoldFile).arrayBuffer()
	])

	fontRegular = await regular
	fontBold = await bold
	fontSemiBold = await semiBold
}

export const GET: RequestHandler = async ({ params, locals, setHeaders, url }) => {
	const { slug } = params

	// Get the origin from the request URL
	const origin = url.origin

	// Ensure fonts are loaded before proceeding
	await ensureFontsLoaded(origin)

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

	try {
		// Build content data with type-specific handling
		let layoutNode

		if (!content) {
			// Fallback for missing content
			layoutNode = createRecipeLayout({
				type: 'recipe',
				title: 'Svelte Society',
				description: 'Community-driven collection of Svelte resources'
			})
		} else {
			// Prepare content data based on type
			const contentData: ContentData = {
				title: content.title,
				type: content.type,
				description: content.description || '',
				metadata: content.metadata,
				children: undefined
			} as ContentData

			// For collections, fetch child content titles
			if (content.type === 'collection' && Array.isArray(content.children)) {
				const childrenData = content.children
					.slice(0, 3)
					.map((childIdOrObj: string | { id: string }) => {
						// Handle both string IDs and objects with id property
						const childId = typeof childIdOrObj === 'string' ? childIdOrObj : childIdOrObj.id
						try {
							const child = locals.contentService.getContentById(childId)
							return child ? { title: child.title, type: child.type } : null
						} catch (err) {
							console.error(`Error fetching child content ${childId}:`, err)
							return null
						}
					})
					.filter((child): child is { title: string; type: string } => child !== null)

				contentData.children = childrenData
			}

			// Generate layout based on content type
			switch (content.type) {
				case 'recipe':
					layoutNode = createRecipeLayout(contentData as any)
					break
				case 'library':
					layoutNode = await createLibraryLayout(contentData as any)
					break
				case 'collection':
					layoutNode = createCollectionLayout(contentData as any)
					break
				case 'announcement':
					layoutNode = createAnnouncementLayout(contentData as any)
					break
				case 'video':
					layoutNode = await createVideoLayout(contentData as any)
					break
				default:
					// Fallback to recipe layout for unknown types
					layoutNode = createRecipeLayout({
						type: 'recipe',
						title: content.title,
						description: content.description || ''
					})
			}
		}

		// Generate SVG using Satori
		const svg = await satori(layoutNode, {
			width: OG_IMAGE_DIMENSIONS.width,
			height: OG_IMAGE_DIMENSIONS.height,
			fonts: [
				{
					name: 'Inter',
					data: fontRegular!,
					weight: 400,
					style: 'normal'
				},
				{
					name: 'Inter',
					data: fontSemiBold!,
					weight: 600,
					style: 'normal'
				},
				{
					name: 'Inter',
					data: fontBold!,
					weight: 700,
					style: 'normal'
				}
			]
		})

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
