import { describe, expect, test } from 'bun:test'
import { readdir } from 'node:fs/promises'
import { relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const adminDirectory = fileURLToPath(new URL('.', import.meta.url))

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

function findRemoteFunctionExports(source: string) {
	return [
		...source.matchAll(/^export const \w+\s*=\s*(?:query(?:\.batch)?|form|command|prerender)\(/gm)
	]
}

async function findRemoteModules(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true })
	const nestedModules = await Promise.all(
		entries.map(async (entry) => {
			const path = resolve(directory, entry.name)

			if (entry.isDirectory()) return findRemoteModules(path)
			if (entry.isFile() && entry.name.endsWith('.remote.ts')) return [path]

			return []
		})
	)

	return nestedModules.flat()
}

describe('admin Remote Function authorization coverage', () => {
	test('recognizes query.batch Remote Function exports', () => {
		const source = `export const batched = query.batch('unchecked', async (inputs) => {})`

		expect(findRemoteFunctionExports(source)).toHaveLength(1)
	})

	test('manifest includes every admin Remote Function module', async () => {
		const manifest = modules.map(([relativePath]) => relativePath).sort()
		const discovered = (await findRemoteModules(adminDirectory))
			.map((path) => relative(adminDirectory, path).split(sep).join('/'))
			.sort()

		expect(discovered).toEqual(manifest)
	})

	test('covers exactly 65 Remote Function exports', async () => {
		const sources = await Promise.all(
			modules.map(([relativePath]) => Bun.file(new URL(relativePath, import.meta.url)).text())
		)
		const exports = sources.flatMap(findRemoteFunctionExports)

		expect(exports).toHaveLength(65)
	})

	for (const [relativePath, permission] of modules) {
		test(`${relativePath} guards every export with ${permission}`, async () => {
			const source = await Bun.file(new URL(relativePath, import.meta.url)).text()
			expect(source).not.toContain('checkAdminAuth')
			expect(source).not.toContain('authorization.remote')

			const exports = findRemoteFunctionExports(source)
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
