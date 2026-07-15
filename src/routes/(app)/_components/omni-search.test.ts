import { describe, expect, test } from 'bun:test'
import { splitHighlight } from './omni-search'

describe('splitHighlight', () => {
	test('preserves malicious markup as plain text segments', () => {
		expect(splitHighlight('<img src=x onerror=alert(1)>Alice', 'ali')).toEqual([
			{ text: '<img src=x onerror=alert(1)>', highlighted: false },
			{ text: 'Ali', highlighted: true },
			{ text: 'ce', highlighted: false }
		])
	})

	test('matches case-insensitively and treats regex characters literally', () => {
		expect(splitHighlight('Svelte [5] and [5]', '[5]')).toEqual([
			{ text: 'Svelte ', highlighted: false },
			{ text: '[5]', highlighted: true },
			{ text: ' and ', highlighted: false },
			{ text: '[5]', highlighted: true }
		])
	})

	test('returns one plain segment for an empty search', () => {
		expect(splitHighlight('Alice', '')).toEqual([{ text: 'Alice', highlighted: false }])
	})
})
