import { describe, expect, test } from 'bun:test'
import { ADMIN_AND_MODERATOR, ADMIN_ONLY, CONTENT_MANAGERS, assertRoles } from './authorization'

const user = { role: 1 }
const role = (value: string, active = true) => ({ value, active })

function expectStatus(run: () => void, status: number) {
	try {
		run()
		throw new Error('Expected authorization to fail')
	} catch (cause) {
		expect(cause).toMatchObject({ status })
	}
}

describe('assertRoles', () => {
	test('returns 401 without an authenticated user', () => {
		expectStatus(() => assertRoles(null, undefined, ADMIN_ONLY), 401)
	})

	test.each([
		[undefined, ADMIN_ONLY],
		[role('admin', false), ADMIN_ONLY],
		[role('member'), CONTENT_MANAGERS],
		[role('moderator'), ADMIN_ONLY],
		[role('editor'), ADMIN_AND_MODERATOR]
	])('returns 403 for a missing, inactive, or disallowed role', (currentRole, allowed) => {
		expectStatus(() => assertRoles(user, currentRole, allowed), 403)
	})

	test.each([
		['admin', ADMIN_ONLY],
		['admin', ADMIN_AND_MODERATOR],
		['moderator', ADMIN_AND_MODERATOR],
		['admin', CONTENT_MANAGERS],
		['moderator', CONTENT_MANAGERS],
		['editor', CONTENT_MANAGERS]
	])('allows %s in its approved permission class', (value, allowed) => {
		expect(() => assertRoles(user, role(value), allowed)).not.toThrow()
	})
})
