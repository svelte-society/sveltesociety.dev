import { describe, expect, test } from 'bun:test'
import { readdir } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
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
	handler: ts.ArrowFunction | ts.FunctionExpression
	authorizationBindings: ReadonlySet<string>
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

type RemoteFunctionKind = 'command' | 'form' | 'prerender' | 'query' | 'query.batch'

function getInlineHandler(expression: ts.Expression) {
	const unwrapped = unwrapExpression(expression)

	return ts.isArrowFunction(unwrapped) || ts.isFunctionExpression(unwrapped) ? unwrapped : undefined
}

function getRemoteFunctionKind(
	callee: ts.Expression,
	constructorBindings: ReadonlySet<string>
): RemoteFunctionKind | undefined {
	const unwrapped = unwrapExpression(callee)
	if (
		ts.isIdentifier(unwrapped) &&
		constructorBindings.has(unwrapped.text) &&
		['query', 'form', 'command', 'prerender'].includes(unwrapped.text)
	) {
		return unwrapped.text as Exclude<RemoteFunctionKind, 'query.batch'>
	}

	if (
		ts.isPropertyAccessExpression(unwrapped) &&
		ts.isIdentifier(unwrapped.expression) &&
		constructorBindings.has('query') &&
		unwrapped.expression.text === 'query' &&
		unwrapped.name.text === 'batch'
	) {
		return 'query.batch'
	}
}

function inspectRemoteFunctionCall(
	expression: ts.Expression,
	constructorBindings: ReadonlySet<string>
) {
	if (!ts.isCallExpression(expression)) return

	const kind = getRemoteFunctionKind(expression.expression, constructorBindings)
	if (!kind) return

	const args = expression.arguments.map(unwrapExpression)
	if (kind === 'query.batch') {
		if (args.length !== 1 && args.length !== 2) return

		const handler = getInlineHandler(args[args.length - 1])
		return handler ? { handler } : undefined
	}

	if (kind === 'prerender') {
		const firstArgumentHandler = args[0] && getInlineHandler(args[0])
		if (firstArgumentHandler) {
			if (args.length === 1) return { handler: firstArgumentHandler }
			if (args.length === 2 && !getInlineHandler(args[1])) {
				return { handler: firstArgumentHandler }
			}

			return
		}

		if (args.length !== 2 && args.length !== 3) return

		const handler = getInlineHandler(args[1])
		if (!handler || (args.length === 3 && getInlineHandler(args[2]))) return

		return { handler }
	}

	if (args.length !== 1 && args.length !== 2) return

	const handler = getInlineHandler(args[args.length - 1])
	return handler ? { handler } : undefined
}

function findCanonicalNamedImports(sourceFile: ts.SourceFile, moduleSpecifier: string) {
	const bindings = new Set<string>()

	for (const statement of sourceFile.statements) {
		if (
			!ts.isImportDeclaration(statement) ||
			!ts.isStringLiteral(statement.moduleSpecifier) ||
			statement.moduleSpecifier.text !== moduleSpecifier ||
			!statement.importClause ||
			statement.importClause.isTypeOnly ||
			!statement.importClause.namedBindings ||
			!ts.isNamedImports(statement.importClause.namedBindings)
		) {
			continue
		}

		for (const element of statement.importClause.namedBindings.elements) {
			if (!element.isTypeOnly && !element.propertyName) bindings.add(element.name.text)
		}
	}

	return bindings
}

function getAuthorizationImportPath(modulePath: string) {
	const moduleDirectory = dirname(resolve(adminDirectory, modulePath))
	const authorizationFile = resolve(adminDirectory, 'authorization.server')
	const importPath = relative(moduleDirectory, authorizationFile).split(sep).join('/')

	return importPath.startsWith('.') ? importPath : `./${importPath}`
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

function inspectRemoteModule(
	source: string,
	modulePath = 'fixture.remote.ts'
): RemoteModuleInspection {
	const sourceFile = ts.createSourceFile(
		'admin.remote.ts',
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
	const constructorBindings = findCanonicalNamedImports(sourceFile, '$app/server')
	const authorizationBindings = findCanonicalNamedImports(
		sourceFile,
		getAuthorizationImportPath(modulePath)
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
				const remoteFunctionCall = inspectRemoteFunctionCall(initializer, constructorBindings)
				if (!remoteFunctionCall) {
					unsupportedRuntimeExports.push(name)
					continue
				}

				remoteFunctions.push({
					name: declaration.name.text,
					handler: remoteFunctionCall.handler,
					authorizationBindings
				})
			}

			continue
		}

		unsupportedRuntimeExports.push(getUnsupportedDeclarationName(statement))
	}

	return { remoteFunctions, unsupportedRuntimeExports }
}

function findRemoteFunctionExports(source: string, modulePath?: string) {
	return inspectRemoteModule(source, modulePath).remoteFunctions
}

function findUnsupportedRuntimeExports(source: string, modulePath?: string) {
	return inspectRemoteModule(source, modulePath).unsupportedRuntimeExports
}

function isSupportedRemoteModuleFilename(filename: string) {
	return ['.remote.ts', '.remote.js'].some((suffix) => filename.endsWith(suffix))
}

function bindingNameIncludes(name: ts.BindingName, bindings: ReadonlySet<string>): boolean {
	if (ts.isIdentifier(name)) return bindings.has(name.text)

	return name.elements.some(
		(element) => !ts.isOmittedExpression(element) && bindingNameIncludes(element.name, bindings)
	)
}

function handlerShadowsAuthorization(
	handler: ts.ArrowFunction | ts.FunctionExpression,
	bindings: ReadonlySet<string>
) {
	if (handler.name && bindings.has(handler.name.text)) return true
	if (handler.parameters.some(({ name }) => bindingNameIncludes(name, bindings))) return true

	let shadowsAuthorization = false
	const visit = (node: ts.Node) => {
		if (shadowsAuthorization) return

		if (ts.isFunctionDeclaration(node)) {
			shadowsAuthorization = Boolean(node.name && bindings.has(node.name.text))
			return
		}

		if (ts.isFunctionLike(node)) return

		if (ts.isClassDeclaration(node) || ts.isEnumDeclaration(node)) {
			shadowsAuthorization = Boolean(node.name && bindings.has(node.name.text))
			return
		}

		if (ts.isClassExpression(node)) return

		if (ts.isVariableDeclaration(node) && bindingNameIncludes(node.name, bindings)) {
			shadowsAuthorization = true
			return
		}

		if (
			ts.isCatchClause(node) &&
			node.variableDeclaration &&
			bindingNameIncludes(node.variableDeclaration.name, bindings)
		) {
			shadowsAuthorization = true
			return
		}

		ts.forEachChild(node, visit)
	}

	ts.forEachChild(handler.body, visit)

	return shadowsAuthorization
}

function hasExpectedGuard(exported: RemoteFunctionExport, permission: string) {
	if (
		!exported.authorizationBindings.has('requireRoles') ||
		!exported.authorizationBindings.has(permission) ||
		handlerShadowsAuthorization(exported.handler, new Set(['requireRoles', permission]))
	) {
		return false
	}

	const body = exported.handler.body
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
			if (entry.isFile() && isSupportedRemoteModuleFilename(entry.name)) return [path]

			return []
		})
	)

	return nestedModules.flat()
}

describe('admin Remote Function authorization coverage', () => {
	test('recognizes Remote Function exports across TypeScript syntax', () => {
		const source = `
import { command, form, prerender, query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
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
import { query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
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
import { form } from '$app/server'
import { ADMIN_ONLY, CONTENT_MANAGERS, requireRoles } from './authorization.server'
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
import { query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
const hidden = query(() => {
	requireRoles(ADMIN_ONLY)
})
export { hidden }`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['hidden'])
	})

	test('rejects Remote Function constructors imported under aliases', () => {
		const source = `
import { query as q } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
export const hidden = q(() => {
	requireRoles(ADMIN_ONLY)
})`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['hidden'])
	})

	test('rejects a local constructor wrapper named query', () => {
		const source = `
import { query as remoteQuery } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
const query = (_decoy) => remoteQuery(() => 'unguarded')
export const hidden = query(() => {
	requireRoles(ADMIN_ONLY)
})`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['hidden'])
	})

	test('rejects handler bindings that shadow authorization imports', () => {
		const permissionParameter = `
import { query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
export const hidden = query('unchecked', (ADMIN_ONLY) => {
	requireRoles(ADMIN_ONLY)
})`
		const guardLocal = `
import { query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
export const hidden = query(() => {
	requireRoles(ADMIN_ONLY)
	function requireRoles() {}
})`

		expect(
			[permissionParameter, guardLocal].map((source) => {
				const [exported] = findRemoteFunctionExports(source)

				return exported && hasExpectedGuard(exported, 'ADMIN_ONLY')
			})
		).toEqual([false, false])
	})

	test('rejects authorization bindings imported from another module', () => {
		const source = `
import { query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './decoy-authorization.server'
export const hidden = query(() => {
	requireRoles(ADMIN_ONLY)
})`
		const [exported] = findRemoteFunctionExports(source)

		expect(exported).toBeDefined()
		expect(hasExpectedGuard(exported!, 'ADMIN_ONLY')).toBe(false)
	})

	test('rejects a guarded decoy callback after the real handler', () => {
		const source = `
import { query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
export const hidden = query(
	schema,
	() => 'unguarded',
	() => {
		requireRoles(ADMIN_ONLY)
	}
)`

		expect(findUnsupportedRuntimeExports(source)).toEqual(['hidden'])
	})

	test('selects handlers from every supported Remote Function overload shape', () => {
		const source = `
import { command, form, prerender, query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
const schema = {}
export const queryOne = query(() => {
	requireRoles(ADMIN_ONLY)
})
export const queryTwo = query(schema, () => {
	requireRoles(ADMIN_ONLY)
})
export const formOne = form(() => {
	requireRoles(ADMIN_ONLY)
})
export const formTwo = form(schema, () => {
	requireRoles(ADMIN_ONLY)
})
export const commandOne = command(() => {
	requireRoles(ADMIN_ONLY)
})
export const commandTwo = command(schema, () => {
	requireRoles(ADMIN_ONLY)
})
export const batchOne = query.batch(async () => {
	requireRoles(ADMIN_ONLY)
	return () => null
})
export const batchTwo = query.batch(schema, async () => {
	requireRoles(ADMIN_ONLY)
	return () => null
})
export const prerenderOne = prerender(() => {
	requireRoles(ADMIN_ONLY)
})
export const prerenderWithOptions = prerender(
	() => {
		requireRoles(ADMIN_ONLY)
	},
	{ inputs: () => [], dynamic: true }
)
export const prerenderTwo = prerender(schema, () => {
	requireRoles(ADMIN_ONLY)
})
export const prerenderThree = prerender(
	schema,
	() => {
		requireRoles(ADMIN_ONLY)
	},
	{ inputs: () => [] }
)`
		const exports = findRemoteFunctionExports(source)

		expect(exports.map(({ name }) => name)).toEqual([
			'queryOne',
			'queryTwo',
			'formOne',
			'formTwo',
			'commandOne',
			'commandTwo',
			'batchOne',
			'batchTwo',
			'prerenderOne',
			'prerenderWithOptions',
			'prerenderTwo',
			'prerenderThree'
		])
		expect(exports.every((exported) => hasExpectedGuard(exported, 'ADMIN_ONLY'))).toBe(true)
		expect(findUnsupportedRuntimeExports(source)).toEqual([])
	})

	test('rejects extra callback arguments for every Remote Function constructor', () => {
		const source = `
import { command, form, prerender, query } from '$app/server'
import { ADMIN_ONLY, requireRoles } from './authorization.server'
const schema = {}
const options = {}
const guardedDecoy = () => {
	requireRoles(ADMIN_ONLY)
}
export const badQuery = query(schema, () => 'unguarded', guardedDecoy)
export const badForm = form(schema, () => 'unguarded', guardedDecoy)
export const badCommand = command(schema, () => 'unguarded', guardedDecoy)
export const badBatch = query.batch(schema, () => 'unguarded', guardedDecoy)
export const badPrerenderOne = prerender(() => 'unguarded', options, guardedDecoy)
export const badPrerenderTwo = prerender(schema, () => 'unguarded', () => {
	requireRoles(ADMIN_ONLY)
})
export const badPrerenderThree = prerender(
	schema,
	() => 'unguarded',
	options,
	guardedDecoy
)`

		expect(findUnsupportedRuntimeExports(source)).toEqual([
			'badQuery',
			'badForm',
			'badCommand',
			'badBatch',
			'badPrerenderOne',
			'badPrerenderTwo',
			'badPrerenderThree'
		])
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
import { query } from '$app/server'
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

	test('recognizes TypeScript and JavaScript Remote Function module filenames', () => {
		expect(
			['feature.remote.ts', 'feature.remote.js'].filter(isSupportedRemoteModuleFilename)
		).toEqual(['feature.remote.ts', 'feature.remote.js'])
	})

	test('covers exactly 65 Remote Function exports', async () => {
		const exports = (
			await Promise.all(
				modules.map(async ([relativePath]) => {
					const source = await Bun.file(new URL(relativePath, import.meta.url)).text()

					return findRemoteFunctionExports(source, relativePath)
				})
			)
		).flat()

		expect(exports).toHaveLength(65)
	})

	test('admin Remote Function modules have no unsupported runtime exports', async () => {
		const violations = (
			await Promise.all(
				modules.map(async ([relativePath]) => {
					const source = await Bun.file(new URL(relativePath, import.meta.url)).text()

					return findUnsupportedRuntimeExports(source, relativePath).map(
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

			const exports = findRemoteFunctionExports(source, relativePath)
			expect(exports.length).toBeGreaterThan(0)

			const missingGuards = exports
				.filter((exported) => !hasExpectedGuard(exported, permission))
				.map(({ name }) => name)

			expect(missingGuards).toEqual([])
		})
	}
})
