export interface ContentSourceLink {
	label: string
	url: string
}

function httpUrl(value: unknown): string | undefined {
	if (typeof value !== 'string' || !/^https?:\/\//i.test(value.trim())) return

	try {
		const url = new URL(value.trim())
		if (url.username || url.password) return
		return url.href
	} catch {
		return
	}
}

/** Source links for moderation; metadata can contain unvalidated submission fields. */
export function getContentSourceLinks(
	type: string | undefined,
	metadata: Record<string, unknown> | null | undefined
): ContentSourceLink[] {
	if (!metadata) return []

	const links: ContentSourceLink[] = []
	function add(label: string, value: unknown) {
		const url = httpUrl(value)
		if (url && !links.some((link) => link.url === url)) links.push({ label, url })
	}

	if (type === 'library') {
		add('Package', metadata.packageUrl)
		add('Repository', metadata.github)
	} else if (type === 'resource') {
		add('Resource', metadata.link)
	} else if (type === 'video') {
		add('Video', metadata.watchUrl)
	}

	const externalSource = metadata.externalSource
	if (externalSource && typeof externalSource === 'object' && 'url' in externalSource) {
		add('Imported source', externalSource.url)
	}

	if (
		type === 'video' &&
		links.length === 0 &&
		typeof metadata.youtubeVideoId === 'string' &&
		/^[\w-]{11}$/.test(metadata.youtubeVideoId)
	) {
		add('Video', `https://www.youtube.com/watch?v=${metadata.youtubeVideoId}`)
	}

	return links
}
