import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test'
import { GET } from './+server'

const repository = {
	name: 'uipkge-registry',
	description: 'Components for Svelte',
	owner: { login: 'uday-a', avatar_url: 'https://example.test/avatar.png' },
	stargazers_count: 42,
	language: 'Svelte'
}
const apiUrl = 'https://api.github.com/repos/uday-a/uipkge-registry'
const rootId = 'uday-a/uipkge-registry'
const packageId = `${rootId}/packages/svelte`
const fetchMock = mock(async (input: RequestInfo | URL): Promise<Response> => {
	if (String(input) === apiUrl) return Response.json(repository)
	if (String(input) === `${apiUrl}/readme`) return new Response('Repository README')
	throw new Error(`Unexpected request: ${String(input)}`)
})

type ExistingContent = {
	id: string
	title: string
	status: string
	type: string
	slug: string
}
const publishedContent: ExistingContent = {
	id: 'existing',
	title: 'Existing package',
	status: 'published',
	type: 'library',
	slug: 'existing-package'
}

function preview(
	input: string | null,
	{ authenticated = true, existing = new Map<string, ExistingContent>() } = {}
) {
	const url = new URL('https://example.test/api/preview/github')
	if (input !== null) url.searchParams.set('repo', input)
	const lookup = mock((_source: string, id: string) => existing.get(id) ?? null)
	const event = {
		url,
		locals: {
			user: authenticated ? { id: 'submitter' } : null,
			externalContentService: { getContentByExternalId: lookup }
		}
	} as unknown as Parameters<typeof GET>[0]
	return { response: GET(event), lookup }
}

beforeEach(() => {
	fetchMock.mockClear()
	spyOn(globalThis, 'fetch').mockImplementation(fetchMock)
})

afterEach(() => {
	mock.restore()
})

describe('GitHub library preview', () => {
	test.each([
		[rootId, rootId],
		[`https://github.com/${rootId}`, rootId],
		[`https://github.com/${rootId}.git`, rootId],
		[packageId, packageId],
		[`https://github.com/${rootId}/tree/main/packages/svelte`, packageId]
	])('accepts %s and fetches repository-level metadata', async (input, expectedId) => {
		const { response, lookup } = preview(input)
		const result = await response
		expect(result.status).toBe(200)
		expect(await result.json()).toMatchObject({
			exists: false,
			preview: {
				title: repository.name,
				owner: 'uday-a',
				stars: 42,
				readme: 'Repository README...'
			}
		})
		expect(lookup).toHaveBeenCalledWith('github', expectedId)
		expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([apiUrl, `${apiUrl}/readme`])
	})

	test.each([
		[packageId, rootId],
		[`https://github.com/${rootId}/tree/main/packages/svelte`, `${rootId}/packages/react`],
		[rootId, packageId]
	])('does not treat %s as the distinct existing entry %s', async (input, existingId) => {
		const { response } = preview(input, { existing: new Map([[existingId, publishedContent]]) })
		const result = await response
		expect(result.status).toBe(200)
		expect(await result.json()).toHaveProperty('exists', false)
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})

	test.each([
		[rootId, rootId],
		[packageId, packageId],
		[`https://github.com/${rootId}/tree/main/packages/svelte`, packageId]
	])(
		'returns the exact existing entry for %s without fetching GitHub',
		async (input, existingId) => {
			const { response, lookup } = preview(input, {
				existing: new Map([[existingId, publishedContent]])
			})
			const result = await response
			expect(result.status).toBe(200)
			expect(await result.json()).toEqual({
				exists: true,
				content: {
					id: 'existing',
					title: 'Existing package',
					status: 'published',
					url: '/library/existing-package'
				}
			})
			expect(lookup).toHaveBeenCalledWith('github', existingId)
			expect(fetchMock).not.toHaveBeenCalled()
		}
	)

	test('does not expose a public link for a pending package', async () => {
		const { response } = preview(packageId, {
			existing: new Map([[packageId, { ...publishedContent, status: 'pending_review' }]])
		})
		expect(await (await response).json()).toMatchObject({
			exists: true,
			content: { status: 'pending_review', url: null }
		})
		expect(fetchMock).not.toHaveBeenCalled()
	})

	test('requires authentication before lookup or fetching', async () => {
		const { response, lookup } = preview(packageId, { authenticated: false })
		const result = await response
		expect(result.status).toBe(401)
		expect(await result.json()).toEqual({ error: 'Authentication required' })
		expect(lookup).not.toHaveBeenCalled()
		expect(fetchMock).not.toHaveBeenCalled()
	})

	test.each([null, '', 'not-a-repository', 'https://example.test/owner/repo'])(
		'rejects missing or invalid input %s before lookup or fetching',
		async (input) => {
			const { response, lookup } = preview(input)
			const result = await response
			expect(result.status).toBe(400)
			expect(await result.json()).toHaveProperty('error')
			expect(lookup).not.toHaveBeenCalled()
			expect(fetchMock).not.toHaveBeenCalled()
		}
	)

	test('preserves the repository-not-found response', async () => {
		fetchMock.mockResolvedValueOnce(new Response('', { status: 404 }))
		const { response } = preview(packageId)
		const result = await response
		expect(result.status).toBe(404)
		expect(await result.json()).toEqual({ error: 'Repository not found' })
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	test('returns an error when GitHub metadata is unavailable', async () => {
		spyOn(console, 'error').mockImplementation(() => {})
		fetchMock.mockResolvedValueOnce(new Response('', { status: 503 }))
		const { response } = preview(packageId)
		const result = await response
		expect(result.status).toBe(500)
		expect(await result.json()).toEqual({ error: 'Failed to fetch repository preview' })
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	test('keeps a valid preview when the optional README request fails', async () => {
		fetchMock.mockResolvedValueOnce(Response.json(repository))
		fetchMock.mockRejectedValueOnce(new Error('README unavailable'))
		const { response } = preview(packageId)
		const result = await response
		expect(result.status).toBe(200)
		expect(await result.json()).toMatchObject({
			exists: false,
			preview: { title: repository.name, readme: '' }
		})
	})
})
