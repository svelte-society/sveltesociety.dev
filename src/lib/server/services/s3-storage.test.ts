import { describe, test, expect } from 'bun:test'
import { isS3Configured, getPublicUrl } from './s3-storage'

describe('S3 Storage Service', () => {
	describe('isS3Configured', () => {
		test('checks if S3 is configured with current environment', () => {
			// This test validates the function works with actual env vars
			// The result depends on whether .env has S3 credentials
			const result = isS3Configured()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('getPublicUrl', () => {
		test('generates public URL with correct format', () => {
			// Test with actual env var if configured
			if (!isS3Configured()) {
				console.log('Skipping getPublicUrl tests - S3 not configured')
				return
			}

			const key = 'yt/abc123/thumbnail.jpg'
			const url = getPublicUrl(key)

			// URL should start with http/https and contain the key
			expect(url).toMatch(/^https?:\/\//)
			expect(url).toContain('yt/abc123/thumbnail.jpg')
		})

		test('handles keys with leading slash', () => {
			if (!isS3Configured()) {
				return
			}

			const keyWithSlash = '/yt/abc123/thumbnail.jpg'
			const keyWithoutSlash = 'yt/abc123/thumbnail.jpg'

			const urlWithSlash = getPublicUrl(keyWithSlash)
			const urlWithoutSlash = getPublicUrl(keyWithoutSlash)

			// Both should produce the same URL
			expect(urlWithSlash).toBe(urlWithoutSlash)
		})

		test('handles GitHub library paths', () => {
			if (!isS3Configured()) {
				return
			}

			const key = 'gh/sveltejs/kit/thumbnail.png'
			const url = getPublicUrl(key)

			expect(url).toMatch(/^https?:\/\//)
			expect(url).toContain('gh/sveltejs/kit/thumbnail.png')
		})

		test('handles GitHub monorepo paths', () => {
			if (!isS3Configured()) {
				return
			}

			const key = 'gh/sveltejs/svelte/packages/svelte/thumbnail.png'
			const url = getPublicUrl(key)

			expect(url).toMatch(/^https?:\/\//)
			expect(url).toContain('gh/sveltejs/svelte/packages/svelte/thumbnail.png')
		})
	})
})
