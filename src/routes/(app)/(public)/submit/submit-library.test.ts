import { describe, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Run the real submission handler in a fresh process so $app/server mocks and
// thumbnail storage settings cannot leak into other service tests.
const submissionCheck = String.raw`
import assert from 'node:assert/strict'
import fs, { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { mock, spyOn } from 'bun:test'

const scenario = process.env.SUBMISSION_SCENARIO
let locals
mock.module('$app/server', () => ({
  form: (schema, handler) => (data) => handler(schema.parse(data)),
  query: (...args) => args.at(-1),
  getRequestEvent: () => ({ locals })
}))
const { createTestDatabase } = await import('./src/lib/server/db/test-helpers')
const { ContentService } = await import('./src/lib/server/services/content')
const { MetadataService } = await import('./src/lib/server/services/metadata')
const { submitLibrary } = await import('./src/routes/(app)/(public)/submit/submit.remote')
const db = createTestDatabase()
db.exec("INSERT INTO users (id, username) VALUES ('submitter', 'submitter')")
db.exec("INSERT INTO tags (id, name, slug) VALUES ('svelte', 'Svelte', 'svelte')")
const contentService = new ContentService(db)
const metadataService = new MetadataService(db)
locals = {
  user: scenario === 'anonymous' ? null : { id: 'submitter' },
  contentService,
  metadataService,
  externalContentService: { getContentByExternalId: () => scenario === 'duplicate'
    ? { type: 'library', slug: 'already-submitted' } : null }
}
const requests = []
const timeouts = []
const timeout = AbortSignal.timeout.bind(AbortSignal)
spyOn(AbortSignal, 'timeout').mockImplementation((ms) => {
  timeouts.push(ms)
  return scenario === 'image-timeout' && timeouts.length === 2
    ? AbortSignal.abort(new DOMException('Timed out', 'TimeoutError')) : timeout(ms)
})
globalThis.fetch = mock(async (url, options) => {
  requests.push(String(url))
  assert(options.signal instanceof AbortSignal)
  options.signal.throwIfAborted()
  if (String(url) === 'https://api.github.com/repos/preview-test/components') {
    return scenario === 'api-error' ? new Response('', { status: 503 }) : Response.json({
      stargazers_count: 42, forks_count: 3, open_issues_count: 2,
      updated_at: '2026-01-01T00:00:00Z'
    })
  }
  assert.match(String(url), /^https:\/\/opengraph\.githubassets\.com\/[^/]+\/preview-test\/components$/)
  return scenario === 'image-error' ? new Response('', { status: 503 })
    : new Response('preview-image', { headers: { 'content-type': 'image/png' } })
})
if (scenario === 'storage-error') {
  spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('Storage unavailable') })
}
if (scenario === 'refresh-error') {
  spyOn(metadataService, 'refreshMetadataForContent').mockRejectedValue(new Error('Storage unavailable'))
}
const result = await submitLibrary({
  type: 'library', github_repo: 'preview-test/components/packages/button',
  description: 'A Svelte component library submitted for review.',
  tags: ['svelte'], notes: 'Please review the button package.'
}).catch((result) => result)
const rows = db.query('SELECT * FROM content').all()
if (scenario === 'anonymous' || scenario === 'duplicate') {
  assert.equal(rows.length, 0)
  assert.equal(requests.length, 0)
  if (scenario === 'anonymous') assert.equal(result.status, 401)
  else assert.equal(result.success, false)
} else {
  assert.equal(result.status, 302)
  assert.equal(result.location, '/submit/thankyou')
  assert.equal(rows.length, 1)
  const content = contentService.getContentById(rows[0].id)
  assert.equal(content.status, 'pending_review')
  assert.equal(content.published_at, null)
  assert.equal(content.title, 'components/packages/button')
  assert.equal(content.description, 'A Svelte component library submitted for review.')
  assert.equal(content.author_id, 'submitter')
  assert.deepEqual(content.tags.map((tag) => tag.id), ['svelte'])
  const metadata = content.metadata
  assert.equal(metadata.github, 'https://github.com/preview-test/components')
  assert.equal(metadata.packagePath, 'packages/button')
  assert.equal(metadata.submitter_notes, 'Please review the button package.')
  assert(metadata.submitted_at)
  assert.equal(metadata.stars, ['api-error', 'refresh-error'].includes(scenario) ? 0 : 42)
  if (scenario !== 'refresh-error') {
    assert.equal(requests.length, 2, 'Fetch repository stats only once, then its preview')
    assert.deepEqual(timeouts, [10000, 10000])
  }
  if (['success', 'api-error'].includes(scenario)) {
    assert.equal(metadata.thumbnail, '/files/gh/preview-test/components/thumbnail.png')
    assert.equal(readFileSync(join(process.env.STATE_DIRECTORY, metadata.thumbnail), 'utf8'), 'preview-image')
  } else assert.equal(metadata.thumbnail, undefined)
}
db.close()
`

describe('library submission previews', () => {
	test.each([
		'success',
		'api-error',
		'image-error',
		'image-timeout',
		'storage-error',
		'refresh-error',
		'anonymous',
		'duplicate'
	])('%s preserves the submission outcome and metadata', (scenario) => {
		const stateDirectory = mkdtempSync(join(tmpdir(), 'library-submission-'))
		try {
			expect(() =>
				execFileSync(process.execPath, ['--eval', submissionCheck], {
					cwd: process.cwd(),
					env: {
						...process.env,
						STATE_DIRECTORY: stateDirectory,
						USE_S3_THUMBNAILS: 'false',
						SUBMISSION_SCENARIO: scenario
					},
					stdio: 'pipe'
				})
			).not.toThrow()
		} finally {
			rmSync(stateDirectory, { recursive: true, force: true })
		}
	})
})
