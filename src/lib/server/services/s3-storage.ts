/**
 * S3-compatible storage service for thumbnails (Tigris)
 *
 * Handles uploading and retrieving thumbnails from S3-compatible storage.
 * Supports feature flag to enable/disable S3 storage.
 *
 * Uses process.env for compatibility with both SvelteKit and bun test environments.
 */

// Use process.env for compatibility with both SvelteKit builds and bun tests
export const isS3Enabled = process.env.USE_S3_THUMBNAILS === 'true'

/**
 * Check if S3 storage is properly configured
 */
export function isS3Configured(): boolean {
	return !!(
		process.env.S3_THUMBNAILS_BUCKET &&
		process.env.S3_THUMBNAILS_ACCESS_KEY &&
		process.env.S3_THUMBNAILS_SECRET_KEY &&
		process.env.S3_THUMBNAILS_PUBLIC_URL
	)
}

/**
 * Get S3 client instance
 * @throws Error if S3 is not configured
 */
function getS3Client() {
	if (!isS3Configured()) {
		throw new Error(
			'S3 storage is not configured. Please set S3_THUMBNAILS_BUCKET, S3_THUMBNAILS_ACCESS_KEY, S3_THUMBNAILS_SECRET_KEY, and S3_THUMBNAILS_PUBLIC_URL environment variables.'
		)
	}

	return new Bun.S3Client({
		accessKeyId: process.env.S3_THUMBNAILS_ACCESS_KEY!,
		secretAccessKey: process.env.S3_THUMBNAILS_SECRET_KEY!,
		bucket: process.env.S3_THUMBNAILS_BUCKET!,
		endpoint: process.env.S3_THUMBNAILS_ENDPOINT,
		region: 'auto'
	})
}

export interface UploadOptions {
	/** Content type of the file (e.g., 'image/jpeg', 'image/png') */
	contentType?: string
	/** Cache control header (default: 'public, max-age=31536000') */
	cacheControl?: string
}

/**
 * Upload a thumbnail to S3 storage
 *
 * @param key - S3 object key (e.g., 'yt/abc123/thumbnail.jpg')
 * @param content - File content as ArrayBuffer
 * @param options - Upload options (content type, cache control)
 * @returns Public URL of the uploaded file
 *
 * @example
 * const url = await uploadThumbnail(
 *   'yt/abc123/thumbnail.jpg',
 *   buffer,
 *   { contentType: 'image/jpeg' }
 * )
 */
export async function uploadThumbnail(key: string, content: ArrayBuffer): Promise<string> {
	if (!isS3Enabled) {
		throw new Error('S3 storage is not enabled. Set USE_S3_THUMBNAILS=true to enable.')
	}

	if (!isS3Configured()) {
		throw new Error('S3 storage is not configured.')
	}

	const s3 = getS3Client()

	try {
		await s3.write(key, content)

		return getPublicUrl(key)
	} catch (error) {
		console.error(`Failed to upload thumbnail to S3: ${key}`, error)
		throw new Error(`Failed to upload thumbnail to S3: ${error}`)
	}
}

/**
 * Get the public URL for a thumbnail
 *
 * @param key - S3 object key (e.g., 'yt/abc123/thumbnail.jpg')
 * @returns Public URL of the file
 *
 * @example
 * const url = getPublicUrl('yt/abc123/thumbnail.jpg')
 * // Returns: 'https://thumbnails.yourdomain.com/yt/abc123/thumbnail.jpg'
 */
export function getPublicUrl(key: string): string {
	if (!process.env.S3_THUMBNAILS_PUBLIC_URL) {
		throw new Error('S3_THUMBNAILS_PUBLIC_URL is not configured.')
	}

	// Ensure key doesn't start with a slash
	const cleanKey = key.startsWith('/') ? key.slice(1) : key

	// Ensure public URL doesn't end with a slash
	const baseUrl = process.env.S3_THUMBNAILS_PUBLIC_URL.endsWith('/')
		? process.env.S3_THUMBNAILS_PUBLIC_URL.slice(0, -1)
		: process.env.S3_THUMBNAILS_PUBLIC_URL

	return `${baseUrl}/${cleanKey}`
}

/**
 * Delete a thumbnail from S3 storage
 *
 * @param key - S3 object key (e.g., 'yt/abc123/thumbnail.jpg')
 *
 * @example
 * await deleteThumbnail('yt/abc123/thumbnail.jpg')
 */
export async function deleteThumbnail(key: string): Promise<void> {
	if (!isS3Enabled) {
		throw new Error('S3 storage is not enabled. Set USE_S3_THUMBNAILS=true to enable.')
	}

	if (!isS3Configured()) {
		throw new Error('S3 storage is not configured.')
	}

	const s3 = getS3Client()

	try {
		await s3.delete(key)
	} catch (error) {
		console.error(`Failed to delete thumbnail from S3: ${key}`, error)
		throw new Error(`Failed to delete thumbnail from S3: ${error}`)
	}
}

/**
 * Check if a thumbnail exists in S3 storage
 *
 * @param key - S3 object key (e.g., 'yt/abc123/thumbnail.jpg')
 * @returns True if the file exists, false otherwise
 *
 * @example
 * const exists = await thumbnailExists('yt/abc123/thumbnail.jpg')
 */
export async function thumbnailExists(key: string): Promise<boolean> {
	if (!isS3Enabled || !isS3Configured()) {
		return false
	}

	const s3 = getS3Client()

	try {
		const file = s3.file(key)
		return file.exists()
	} catch (error) {
		return false
	}
}

/**
 * Upload an image file to S3 storage with auto-generated key
 *
 * @param file - File object to upload
 * @param keyPrefix - Prefix for the S3 key (e.g., 'jobs/company-name')
 * @returns Public URL of the uploaded file, or null if upload fails or S3 is disabled
 *
 * @example
 * const url = await uploadImageFile(logoFile, 'jobs/acme-inc')
 * // Returns: 'https://thumbnails.yourdomain.com/jobs/acme-inc-1234567890/logo.png'
 */
export async function uploadImageFile(file: File, keyPrefix: string): Promise<string | null> {
	if (!isS3Enabled) {
		console.warn('S3 storage is not enabled. File will not be uploaded.')
		return null
	}

	try {
		const ext = file.type.split('/')[1] || 'png'
		const arrayBuffer = await file.arrayBuffer()
		const timestamp = Date.now()
		const key = `${keyPrefix}-${timestamp}/logo.${ext}`
		return await uploadThumbnail(key, arrayBuffer)
	} catch (error) {
		console.error('Error uploading file to S3:', error)
		return null
	}
}
