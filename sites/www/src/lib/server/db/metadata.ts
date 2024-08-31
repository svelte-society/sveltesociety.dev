import { db } from './index';
import { type Content, get_content_by_id } from '$lib/server/db/content';

export type Metadata = {
	content_id: string;
	created_at: number;
	expired_at: number;
	content?: string;
	status: string;
};
export type ContentMetadata = Pick<Metadata, 'status'> & { content: any };
export type FetchMetadata = Pick<Metadata, 'content' | 'expired_at'>;

export const get_metadata = (content_id: string): ContentMetadata => {
	let query = `
        SELECT 
            content_id, 
            created_at, 
            expired_at, 
            content, 
            status 
        FROM metadata
        WHERE content_id = @content_id
		ORDER BY created_at ASC
    `;

	const stmt = db.prepare(query);
	const results = stmt.all({ content_id }) as Metadata[];

	if (results.length === 0) {
		background_load(content_id);
		return {
			content: {},
			status: 'pending'
		};
	}
	for (const result of results) {
		if (result.status === 'pending') {
			continue;
		}
		if (result.status === 'fresh' && result.expired_at < Date.now()) {
			background_load(content_id);
			return {
				content: JSON.parse(result.content ?? '{}'),
				status: 'stale'
			};
		}
		return {
			content: JSON.parse(result.content ?? '{}'),
			status: result.status
		};
	}

	background_load(content_id);
	return {
		content: {},
		status: 'pending'
	};
};

async function background_load(content_id: string): Promise<void> {
	// Change freshness
	const staleStmt = db.prepare(`
		UPDATE metadata SET status = 'stale' WHERE content_id = @content_id
	`);
	staleStmt.run({ content_id });

	// Create next content
	const pendingStmt = db.prepare(`
		INSERT INTO metadata (content_id, created_at, expired_at, content, status) VALUES (@content_id, CURRENT_TIMESTAMP, 0, null, 'pending')
	`);
	pendingStmt.run({ content_id });

	// --- Start data fetch
	const { content, expired_at } = await get_content_metadata(content_id);
	// --- End data fetch

	// Update to fresh
	const freshStmt = db.prepare(`
		UPDATE metadata SET content = @content, status = 'fresh', expired_at = @expired_at WHERE content_id = @content_id AND status = 'pending'
	`);
	freshStmt.run({ content_id, content, expired_at });
	// Remove stale
	const removeStmt = db.prepare(`
		DELETE FROM metadata WHERE content_id = @content_id AND status = 'stale'
	`);
	removeStmt.run({ content_id });
}

async function get_content_metadata(content_id: string): Promise<FetchMetadata> {
	const content = get_content_by_id(content_id);

	if (content?.type === 'video') {
		return get_video_metadata(content.metadata);
	}
	if (content?.type === 'library') {
		return get_npm_metadata(content.metadata);
	}

	return {
		content: '{}',
		expired_at: Date.now() + 300 * 1000
	};
}
async function get_video_metadata(metadata: Content['metadata']): Promise<FetchMetadata> {
	return {
		content: JSON.stringify({
			embed: `https://www.youtube.com/embed/${metadata.videoId}?controls=0&modestbranding=1&color=white&showinfo=0`
		}),
		expired_at: Date.now() + 30 * 24 * 3600 * 1000
	};
}

async function get_npm_metadata(metadata: Content['metadata']): Promise<FetchMetadata> {
	const npmResponse = (await fetch(`https://registry.npmjs.org/${metadata.npm}`).then((response) =>
		response.json()
	)) as NpmResponse;
	const npmDownload = (await fetch(
		`https://api.npmjs.org/downloads/point/last-week/${metadata.npm}`
	).then((response) => response.json())) as NpmDownloadResponse;

	const get_cover = (repository: string): string | undefined => {
		if (repository.startsWith('https://github.com/')) {
			return npmResponse.repository.url
				.replace('https://github.com/', 'https://opengraph.githubassets.com/HEAD/')
				.replace(/\.git$/, '');
		}
		if (repository.startsWith('git+https://github.com/')) {
			return npmResponse.repository.url
				.replace('git+https://github.com/', 'https://opengraph.githubassets.com/HEAD/')
				.replace(/\.git$/, '');
		}
		return undefined;
	};

	return {
		content: JSON.stringify({
			updated_at: npmResponse.time.modified,
			last: npmResponse['dist-tags'].latest,
			repository: npmResponse.repository.url,
			cover: get_cover(npmResponse.repository.url),
			week_download: npmDownload.downloads
		}),
		expired_at: Date.now() + 24 * 3600 * 1000
	};
}

interface NpmResponse {
	name: string;
	description: string;
	'dist-tags': {
		latest: string;
	};
	time: {
		created: string;
		modified: string;
		[version: string]: string;
	};
	repository: { url: string; type: string };
}
interface NpmDownloadResponse {
	downloads: number;
	start: string;
	end: string;
	package: string;
}
