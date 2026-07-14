import { describe, expect, test } from 'bun:test'
import { readdir } from 'node:fs/promises'
import { relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as ts from 'typescript'

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

type RemoteFunctionExport = {
	name: string
	handler?: ts.ArrowFunction | ts.FunctionExpression
}

type RemoteModuleInspection = {
	remoteFunctions: RemoteFunctionExport[]
	unsupportedRuntimeExports: string[]
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
	if (
		ts.isParenthesizedExpression(expression) ||
		ts.isAsExpression(expression) ||
		ts.isSatisfiesExpression(expression) ||
		ts.isNonNullExpression(expression) ||
		ts.isTypeAssertionExpression(expression)
	) {
		return unwrapExpression(expression.expression)
	}

	return expression
}

function isRemoteFunctionCall(expression: ts.Expression): expression is ts.CallExpression {
	if (!ts.isCallExpression(expression)) return false

	const callee = unwrapExpression(expression.expression)
	if (ts.isIdentifier(callee)) {
		return ['query', 'form', 'command', 'prerender'].includes(callee.text)
	}

	return (
		ts.isPropertyAccessExpression(callee) &&
		ts.isIdentifier(callee.expression) &&
		callee.expression.text === 'query' &&
		callee.name.text === 'batch'
	)
}

function hasModifier(node: ts.Node, modifier: ts.SyntaxKind) {
	return ts.canHaveModifiers(node) && ts.getModifiers(node)?.some(({ kind }) => kind === modifier)
}

function getUnsupportedDeclarationName(statement: ts.Statement) {
	if (hasModifier(statement, ts.SyntaxKind.DefaultKeyword)) return 'default'

	if (
		ts.isFunctionDeclaration(statement) ||
		ts.isClassDeclaration(statement) ||
		ts.isEnumDeclaration(statement)
	) {
		return statement.name?.text ?? ts.SyntaxKind[statement.kind]
	}

	if (
		ts.isModuleDeclaration(statement) ||
		ts.isImportEqualsDeclaration(statement) ||
		ts.isNamespaceExportDeclaration(statement)
	) {
		return statement.name.text
	}

	return ts.SyntaxKind[statement.kind]
}

function inspectRemoteModule(source: string): RemoteModuleInspection {
	const sourceFile = ts.createSourceFile(
		'admin.remote.ts',
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
	const remoteFunctions: RemoteFunctionExport[] = []
	const unsupportedRuntimeExports: string[] = []

	for (const statement of sourceFile.statements) {
		if (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) continue

		if (ts.isExportDeclaration(statement)) {
			if (statement.isTypeOnly) continue

			const exportClause = statement.exportClause
			if (!exportClause) {
				unsupportedRuntimeExports.push('*')
			} else if (ts.isNamespaceExport(exportClause)) {
				unsupportedRuntimeExports.push(exportClause.name.text)
			} else {
				unsupportedRuntimeExports.push(
					...exportClause.elements
						.filter(({ isTypeOnly }) => !isTypeOnly)
						.map(({ name }) => name.text)
				)
			}

			continue
		}

		if (ts.isExportAssignment(statement)) {
			unsupportedRuntimeExports.push(statement.isExportEquals ? 'export =' : 'default')
			continue
		}

		if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword)) continue

		if (ts.isVariableStatement(statement)) {
			const isConst = Boolean(statement.declarationList.flags & ts.NodeFlags.Const)

			for (const declaration of statement.declarationList.declarations) {
				const name = declaration.name.getText(sourceFile)
				if (!isConst || !ts.isIdentifier(declaration.name) || !declaration.initializer) {
					unsupportedRuntimeExports.push(name)
					continue
				}

				const initializer = unwrapExpression(declaration.initializer)
				if (!isRemoteFunctionCall(initializer)) {
					unsupportedRuntimeExports.push(name)
					continue
				}

				const handler = initializer.arguments
					.map(unwrapExpression)
					.findLast(
						(argument): argument is ts.ArrowFunction | ts.FunctionExpression =>
							ts.isArrowFunction(argument) || ts.isFunctionExpression(argument)
					)

				remoteFunctions.push({ name: declaration.name.text, handler })
			}

			continue
		}

		unsupportedRuntimeExports.push(getUnsupportedDeclarationName(statement))
	}

	return { remoteFunctions, unsupportedRuntimeExports }
}

function findRemoteFunctionExports(source: string) {
	return inspectRemoteModule(source).remoteFunctions
}

function findUnsupportedRuntimeExports(source: string) {
	return inspectRemoteModule(source).unsupportedRuntimeExports
}

function hasExpectedGuard(exported: RemoteFunctionExport, permission: string) {
	const body = exported.handler?.body
	if (!body || !ts.isBlock(body)) return false

	const [firstStatement] = body.statements
	if (!firstStatement || !ts.isExpressionStatement(firstStatement)) return false

	const expression = unwrapExpression(firstStatement.expression)
	if (
		!ts.isCallExpression(expression) ||
		!ts.isIdentifier(expression.expression) ||
		expression.expression.text !== 'requireRoles' ||
		expression.arguments.length !== 1
	) {
		return false
	}

	const [permissionArgument] = expression.arguments

	return ts.isIdentifier(permissionArgument) && permissionArgument.text === permission
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
	test('recognizes Remote Function exports across TypeScript syntax', () => {
		const source = `
export const generic = query<string>(() => {
	requireRoles(ADMIN_ONLY)
})
export const annotated: RemoteQueryFunction<void, string> = form(schema, () => {
	requireRoles(ADMIN_ONLY)
})
export const commented /* declaration comment */ = command(() => {
	requireRoles(ADMIN_ONLY)
})
export const batched = query.batch('unchecked', async (inputs) => {
	requireRoles(ADMIN_ONLY)
})
export const rendered = prerender(() => {
	requireRoles(ADMIN_ONLY)
})`

		expect(findRemoteFunctionExports(source).map(({ name }) => name)).toEqual([
			'generic',
			'annotated',
			'commented',
			'batched',
			'rendered'
		])
	})

	test('ignores export-looking code inside comments', () => {
		const source = `
/*
export const fake = query(() => {
	requireRoles(ADMIN_ONLY)
})
*/
export const real = query(() => {
	requireRoles(ADMIN_ONLY)
})`

		expect(findRemoteFunctionExports(source).map(({ name }) => name)).toEqual(['real'])
	})

	test('checks the actual handler instead of a schema helper callback', () => {
		const source = `
export const deceptive = form(
	schema.transform((value) => {
		requireRoles(ADMIN_ONLY)
		return value
	}),
	async (data) => {
		requireRoles(CONTENT_MANAGERS)
		return data
	}
)`
		const [exported] = findRemoteFunctionExports(source)

		expect(exported).toBeDefined()
		expect(hasExpectedGuard(exported!, 'ADMIN_ONLY')).toBe(false)
	})

	test('rejects runtime exports hidden behind export lists', () => {
		const source = `
const hidden = query(() => {
	requireRoles(ADMIN_ONLY)
})
export { hidden }`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['hidden'])
	})

	test('rejects Remote Function constructors imported under aliases', () => {
		const source = `
import { query as q } from '$app/server'
export const hidden = q(() => {
	requireRoles(ADMIN_ONLY)
})`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['hidden'])
	})

	test('allows type-only exports and ignores export syntax in comments and template text', () => {
		const source = [
			'export type PublicType = { id: string }',
			'interface LocalType { id: string }',
			'export { type LocalType }',
			"export type { ExternalType } from './types'",
			'const example = `export const fake = q(() => {})`',
			'/* export default query(() => {}) */'
		].join('\n')

		expect(findUnsupportedRuntimeExports(source)).toEqual([])
		expect(findRemoteFunctionExports(source)).toEqual([])
	})

	test('rejects non-Remote Function declarations, default exports, and star exports', () => {
		const source = `
export const metadata = {}
export function helper() {}
export default query(() => {})
export * from './runtime'`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['metadata', 'helper', 'default', '*'])
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

	test('admin Remote Function modules have no unsupported runtime exports', async () => {
		const violations = (
			await Promise.all(
				modules.map(async ([relativePath]) => {
					const source = await Bun.file(new URL(relativePath, import.meta.url)).text()

					return findUnsupportedRuntimeExports(source).map(
						(exportName) => `${relativePath}:${exportName}`
					)
				})
			)
		).flat()

		expect(violations).toEqual([])
	})

	for (const [relativePath, permission] of modules) {
		test(`${relativePath} guards every export with ${permission}`, async () => {
			const source = await Bun.file(new URL(relativePath, import.meta.url)).text()
			expect(source).not.toContain('checkAdminAuth')
			expect(source).not.toContain('authorization.remote')

			const exports = findRemoteFunctionExports(source)
			expect(exports.length).toBeGreaterThan(0)

			const missingGuards = exports
				.filter((exported) => !hasExpectedGuard(exported, permission))
				.map(({ name }) => name)

			expect(missingGuards).toEqual([])
		})
	}
})
