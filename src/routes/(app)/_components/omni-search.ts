export type HighlightSegment = {
	text: string
	highlighted: boolean
}

export function splitHighlight(text: string, search: string): HighlightSegment[] {
	if (!search) return [{ text, highlighted: false }]
	const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const matches = [...text.matchAll(new RegExp(escaped, 'gi'))]
	if (matches.length === 0) return [{ text, highlighted: false }]

	const segments: HighlightSegment[] = []
	let offset = 0
	for (const match of matches) {
		const index = match.index ?? 0
		if (index > offset) segments.push({ text: text.slice(offset, index), highlighted: false })
		segments.push({ text: match[0], highlighted: true })
		offset = index + match[0].length
	}
	if (offset < text.length) segments.push({ text: text.slice(offset), highlighted: false })
	return segments
}
