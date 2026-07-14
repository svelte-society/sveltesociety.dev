import { describe, expect, test } from 'bun:test'

const modules = [
	['users/users.remote.ts', 'ADMIN_ONLY'],
	['sponsors/data.remote.ts', 'ADMIN_ONLY'],
	['newsletter/data.remote.ts', 'ADMIN_ONLY'],
	['newsletter/[id]/data.remote.ts', 'ADMIN_ONLY'],
	['tags/tags.remote.ts', 'ADMIN_AND_MODERATOR'],
	['announcements/announcements.remote.ts', 'ADMIN_AND_MODERATOR'],
	['feed-builder/data.remote.ts', 'ADMIN_AND_MODERATOR'],
	['shortcuts/shortcuts.remote.ts', 'ADMIN_AND_MODERATOR'],
	['external-content/external-content.remote.ts', 'ADMIN_AND_MODERATOR'],
	['bulk-import/bulk-import.remote.ts', 'ADMIN_AND_MODERATOR'],
	['content/data.remote.ts', 'CONTENT_MANAGERS'],
	['content/content.remote.ts', 'CONTENT_MANAGERS']
] as const

describe('admin Remote Function authorization coverage', () => {
	for (const [relativePath, permission] of modules) {
		test(`${relativePath} guards every export with ${permission}`, async () => {
			const source = await Bun.file(new URL(relativePath, import.meta.url)).text()
			expect(source).not.toContain('checkAdminAuth')
			expect(source).not.toContain('authorization.remote')

			const exports = [...source.matchAll(/^export const \w+\s*=\s*(?:query|form)\(/gm)]
			expect(exports.length).toBeGreaterThan(0)

			for (const [index, exported] of exports.entries()) {
				const start = exported.index ?? 0
				const end = exports[index + 1]?.index ?? source.length
				const callback = source.slice(start, end)
				const bodyStart = callback.indexOf('=> {')
				expect(bodyStart).toBeGreaterThan(-1)
				expect(
					callback
						.slice(bodyStart + 4)
						.trimStart()
						.startsWith(`requireRoles(${permission})`)
				).toBe(true)
			}
		})
	}
})
