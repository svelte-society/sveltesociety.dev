/**
 * S3-compatible storage service for thumbnails (Tigris)
 *
 * Handles uploading and retrieving thumbnails from S3-compatible storage.
 * Supports feature flag to enable/disable S3 storage.
 */
import { env } from '$env/dynamic/private'

// Use dynamic env to allow optional S3 configuration (not all environments have S3)
export const isS3Enabled = env.USE_S3_THUMBNAILS === 'true'

/**
 * Check if S3 storage is properly configured
 */
export function isS3Configured(): boolean {
  return !!(
    env.S3_THUMBNAILS_BUCKET &&
    env.S3_THUMBNAILS_ACCESS_KEY &&
    env.S3_THUMBNAILS_SECRET_KEY &&
    env.S3_THUMBNAILS_PUBLIC_URL
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
    accessKeyId: env.S3_THUMBNAILS_ACCESS_KEY!,
    secretAccessKey: env.S3_THUMBNAILS_SECRET_KEY!,
    bucket: env.S3_THUMBNAILS_BUCKET!,
    endpoint: env.S3_THUMBNAILS_ENDPOINT,
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
export async function uploadThumbnail(
  key: string,
  content: ArrayBuffer,
): Promise<string> {
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
  if (!env.S3_THUMBNAILS_PUBLIC_URL) {
    throw new Error('S3_THUMBNAILS_PUBLIC_URL is not configured.')
  }

  // Ensure key doesn't start with a slash
  const cleanKey = key.startsWith('/') ? key.slice(1) : key

  // Ensure public URL doesn't end with a slash
  const baseUrl = env.S3_THUMBNAILS_PUBLIC_URL.endsWith('/')
    ? env.S3_THUMBNAILS_PUBLIC_URL.slice(0, -1)
    : env.S3_THUMBNAILS_PUBLIC_URL

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
