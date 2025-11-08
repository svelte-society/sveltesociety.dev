import { describe, expect, test, beforeEach, afterEach, mock } from 'bun:test'
import { Database } from 'bun:sqlite'
import { GitHubImporter } from './github'
import { ExternalContentService } from '../external-content'
import { ContentService } from '../content'
import { SearchService } from '../search'
import { createTestDatabase } from '../../db/test-helpers'

describe('GitHubImporter', () => {
	let db: Database
	let searchService: SearchService
	let contentService: ContentService
	let externalContentService: ExternalContentService
	let githubImporter: GitHubImporter

	// Mock GitHub API responses
	const mockRepoResponse = {
		id: 12345,
		node_id: 'MDEwOlJlcG9zaXRvcnkxMjM0NQ==',
		name: 'test-repo',
		full_name: 'testuser/test-repo',
		description: 'A test repository',
		html_url: 'https://github.com/testuser/test-repo',
		homepage: 'https://example.com',
		language: 'TypeScript',
		stargazers_count: 100,
		watchers_count: 100,
		forks_count: 10,
		open_issues_count: 5,
		topics: ['svelte', 'test'],
		created_at: '2023-01-01T00:00:00Z',
		updated_at: '2023-06-01T00:00:00Z',
		pushed_at: '2023-06-01T00:00:00Z',
		default_branch: 'main',
		owner: {
			login: 'testuser',
			avatar_url: 'https://github.com/testuser.png',
			html_url: 'https://github.com/testuser'
		}
	}

	const mockPackageJson = {
		name: '@testuser/test-package',
		version: '1.0.0',
		description: 'A test package from monorepo'
	}

	const mockReadme = '# Test README\n\nThis is a test.'

	beforeEach(() => {
		db = createTestDatabase()
		searchService = new SearchService(db)
		contentService = new ContentService(db, searchService)
		externalContentService = new ExternalContentService(db, contentService)
		githubImporter = new GitHubImporter(externalContentService)

		// Mock global fetch
		global.fetch = mock(async (url: string | URL) => {
			const urlStr = url.toString()

			// Mock repository endpoint
			if (urlStr.includes('/repos/testuser/test-repo') && !urlStr.includes('/contents/')) {
				return {
					ok: true,
					json: async () => mockRepoResponse
				} as Response
			}

			// Mock README endpoint (root)
			if (urlStr.includes('/repos/testuser/test-repo/readme')) {
				return {
					ok: true,
					json: async () => ({
						content: btoa(mockReadme),
						encoding: 'base64'
					})
				} as Response
			}

			// Mock package.json endpoint (root)
			if (urlStr.includes('/repos/testuser/test-repo/contents/package.json')) {
				return {
					ok: true,
					json: async () => mockPackageJson
				} as Response
			}

			// Mock package.json endpoint (monorepo package)
			if (urlStr.includes('/repos/testuser/test-repo/contents/packages/kit/package.json')) {
				return {
					ok: true,
					json: async () => mockPackageJson
				} as Response
			}

			// Mock README endpoint (monorepo package)
			if (urlStr.includes('/repos/testuser/test-repo/contents/packages/kit/README.md')) {
				return {
					ok: true,
					json: async () => ({
						content: btoa('# Package README\n\nPackage-specific readme.'),
						encoding: 'base64'
					})
				} as Response
			}

			// Mock OG image
			if (urlStr.includes('opengraph.githubassets.com')) {
				return {
					ok: true,
					headers: new Headers({ 'content-type': 'image/png' }),
					arrayBuffer: async () => new ArrayBuffer(0)
				} as Response
			}

			return {
				ok: false,
				statusText: 'Not Found'
			} as Response
		})
	})

	afterEach(() => {
		db.close()
	})

	describe('importRepository - Regular Repository', () => {
		test('should import a regular repository successfully', async () => {
			const contentId = await githubImporter.importRepository('testuser', 'test-repo')

			expect(contentId).toBeTruthy()

			const content = contentService.getContentById(contentId!)
			expect(content).toBeTruthy()
			expect(content?.title).toBe('test-repo')
			expect(content?.description).toBe('A test repository')
			expect(content?.type).toBe('library')
			expect(content?.metadata.npm).toBe('@testuser/test-package')
			expect(content?.metadata.github).toBe('https://github.com/testuser/test-repo')
			expect(content?.metadata.stars).toBe(100)
			expect(content?.metadata.forks).toBe(10)
		})

		test('should create correct external ID for regular repo', async () => {
			const contentId = await githubImporter.importRepository('testuser', 'test-repo')

			const existing = externalContentService.getContentByExternalId('github', 'testuser/test-repo')
			expect(existing).toBeTruthy()
			expect(existing?.id).toBe(contentId)
		})

		test('should update existing repository on re-import', async () => {
			// First import
			const firstId = await githubImporter.importRepository('testuser', 'test-repo')

			// Second import
			const secondId = await githubImporter.importRepository('testuser', 'test-repo')

			expect(firstId).toBe(secondId)

			// Verify only one entry exists
			const content = contentService.getContentById(firstId!)
			expect(content).toBeTruthy()
		})
	})

	describe('importRepository - Monorepo Package', () => {
		test('should import a monorepo package successfully', async () => {
			const contentId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/kit'
			)

			expect(contentId).toBeTruthy()

			const content = contentService.getContentById(contentId!)
			expect(content).toBeTruthy()
			expect(content?.title).toBe('@testuser/test-package')
			expect(content?.description).toBe('A test package from monorepo')
			expect(content?.type).toBe('library')
		})

		test('should create correct external ID for monorepo package', async () => {
			const contentId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/kit'
			)

			const existing = externalContentService.getContentByExternalId(
				'github',
				'testuser/test-repo/packages/kit'
			)
			expect(existing).toBeTruthy()
			expect(existing?.id).toBe(contentId)
		})

		test('should store monorepo-specific metadata', async () => {
			const contentId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/kit'
			)

			const content = contentService.getContentById(contentId!)
			expect(content).toBeTruthy()
			expect(content?.metadata.packagePath).toBe('packages/kit')
			expect(content?.metadata.packageUrl).toBe(
				'https://github.com/testuser/test-repo/tree/main/packages/kit'
			)
			expect(content?.metadata.isMonorepoPackage).toBe(true)
			expect(content?.metadata.github).toBe('https://github.com/testuser/test-repo')
		})

		test('should allow multiple packages from same repository', async () => {
			// Import first package
			const firstId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/kit'
			)

			// Import second package
			const secondId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/adapter-node'
			)

			expect(firstId).toBeTruthy()
			expect(secondId).toBeTruthy()
			expect(firstId).not.toBe(secondId)

			// Verify both exist with correct external IDs
			const firstContent = externalContentService.getContentByExternalId(
				'github',
				'testuser/test-repo/packages/kit'
			)
			const secondContent = externalContentService.getContentByExternalId(
				'github',
				'testuser/test-repo/packages/adapter-node'
			)

			expect(firstContent).toBeTruthy()
			expect(secondContent).toBeTruthy()
			expect(firstContent?.id).toBe(firstId)
			expect(secondContent?.id).toBe(secondId)
		})

		test('should not conflict with root repository import', async () => {
			// Import root repository
			const rootId = await githubImporter.importRepository('testuser', 'test-repo')

			// Import package from same repository
			const packageId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/kit'
			)

			expect(rootId).toBeTruthy()
			expect(packageId).toBeTruthy()
			expect(rootId).not.toBe(packageId)

			// Verify both exist independently
			const rootContent = externalContentService.getContentByExternalId('github', 'testuser/test-repo')
			const packageContent = externalContentService.getContentByExternalId(
				'github',
				'testuser/test-repo/packages/kit'
			)

			expect(rootContent?.id).toBe(rootId)
			expect(packageContent?.id).toBe(packageId)
		})

		test('should use directory name as fallback when package.json name is missing', async () => {
			// Mock package.json without name
			global.fetch = mock(async (url: string | URL) => {
				const urlStr = url.toString()

				if (urlStr.includes('/repos/testuser/test-repo') && !urlStr.includes('/contents/')) {
					return { ok: true, json: async () => mockRepoResponse } as Response
				}

				if (urlStr.includes('/repos/testuser/test-repo/contents/packages/unnamed/package.json')) {
					return {
						ok: true,
						json: async () => ({ version: '1.0.0' }) // No name field
					} as Response
				}

				if (urlStr.includes('opengraph.githubassets.com')) {
					return {
						ok: true,
						headers: new Headers({ 'content-type': 'image/png' }),
						arrayBuffer: async () => new ArrayBuffer(0)
					} as Response
				}

				return { ok: false } as Response
			})

			const contentId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/unnamed'
			)

			const content = contentService.getContentById(contentId!)
			expect(content?.title).toBe('unnamed') // Should use directory name
		})

		test('should fallback to directory name when package.json is not found', async () => {
			// Mock missing package.json
			global.fetch = mock(async (url: string | URL) => {
				const urlStr = url.toString()

				if (urlStr.includes('/repos/testuser/test-repo') && !urlStr.includes('/contents/')) {
					return { ok: true, json: async () => mockRepoResponse } as Response
				}

				if (urlStr.includes('/repos/testuser/test-repo/contents/packages/nopkg/package.json')) {
					return { ok: false } as Response
				}

				if (urlStr.includes('opengraph.githubassets.com')) {
					return {
						ok: true,
						headers: new Headers({ 'content-type': 'image/png' }),
						arrayBuffer: async () => new ArrayBuffer(0)
					} as Response
				}

				return { ok: false } as Response
			})

			const contentId = await githubImporter.importRepository(
				'testuser',
				'test-repo',
				undefined,
				'packages/nopkg'
			)

			const content = contentService.getContentById(contentId!)
			expect(content?.title).toBe('nopkg') // Should use directory name as fallback
		})
	})

	describe('NPM Package Name Extraction', () => {
		test('should extract valid NPM package name', async () => {
			const contentId = await githubImporter.importRepository('testuser', 'test-repo')
			const content = contentService.getContentById(contentId!)

			expect(content?.metadata.npm).toBe('@testuser/test-package')
		})

		test('should filter out monorepo placeholder names', async () => {
			// Mock package.json with invalid name
			global.fetch = mock(async (url: string | URL) => {
				const urlStr = url.toString()

				if (urlStr.includes('/repos/testuser/test-repo') && !urlStr.includes('/contents/')) {
					return { ok: true, json: async () => mockRepoResponse } as Response
				}

				if (urlStr.includes('/repos/testuser/test-repo/contents/package.json')) {
					return {
						ok: true,
						json: async () => ({ name: 'monorepo', private: false })
					} as Response
				}

				if (urlStr.includes('opengraph.githubassets.com')) {
					return {
						ok: true,
						headers: new Headers({ 'content-type': 'image/png' }),
						arrayBuffer: async () => new ArrayBuffer(0)
					} as Response
				}

				return { ok: false } as Response
			})

			const contentId = await githubImporter.importRepository('testuser', 'test-repo')
			const content = contentService.getContentById(contentId!)

			expect(content?.metadata.npm).toBeUndefined() // Should filter out 'monorepo'
		})

		test('should filter out private packages', async () => {
			// Mock private package
			global.fetch = mock(async (url: string | URL) => {
				const urlStr = url.toString()

				if (urlStr.includes('/repos/testuser/test-repo') && !urlStr.includes('/contents/')) {
					return { ok: true, json: async () => mockRepoResponse } as Response
				}

				if (urlStr.includes('/repos/testuser/test-repo/contents/package.json')) {
					return {
						ok: true,
						json: async () => ({ name: '@testuser/private-pkg', private: true })
					} as Response
				}

				if (urlStr.includes('opengraph.githubassets.com')) {
					return {
						ok: true,
						headers: new Headers({ 'content-type': 'image/png' }),
						arrayBuffer: async () => new ArrayBuffer(0)
					} as Response
				}

				return { ok: false } as Response
			})

			const contentId = await githubImporter.importRepository('testuser', 'test-repo')
			const content = contentService.getContentById(contentId!)

			expect(content?.metadata.npm).toBeUndefined() // Should filter out private packages
		})
	})
})
