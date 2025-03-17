import { Database } from 'bun:sqlite';

export const ModerationStatus = {
	PENDING: 'pending',
	APPROVED: 'approved',
	REJECTED: 'rejected'
} as const;

export type ModerationStatus = typeof ModerationStatus[keyof typeof ModerationStatus];

export interface ModerationQueueItem {
	id: string;
	type: string;
	title?: string;
	status: ModerationStatus;
	data: string;
	submitted_by: string;
	submitted_at: string;
	moderated_by: string | null;
	moderated_at: string | null;
}

export type PreviewModerationQueueItem = Omit<ModerationQueueItem, 'data'>

interface GetModerationQueueOptions {
	status?: ModerationStatus
	type?: string
	limit?: number
	offset?: number
}

export class ModerationService {
	private getModerationQueueStatement;
	private getModerationQueueItemStatement;
	private addToModerationQueueStatement;
	private updateModerationStatusStatement;
	private getModerationQueueCountStatement;
	private getModerationQueuePaginatedStatement;
	private getModerationQueueCountFilteredStatement;

	constructor(private db: Database) {
		this.getModerationQueueStatement = this.db.prepare(`
			SELECT 
				id, 
				type,
				title, 
				status, 
				submitted_by, 
				submitted_at, 
				moderated_by, 
				moderated_at
			FROM moderation_queue
			WHERE status = $status
			ORDER BY submitted_at DESC
		`);

		this.getModerationQueueItemStatement = this.db.prepare(`
			SELECT *
			FROM moderation_queue
			WHERE id = $id
		`);

		this.addToModerationQueueStatement = this.db.prepare(`
			INSERT INTO moderation_queue (type, status, data, submitted_by, submitted_at)
			VALUES ($type, $status, $data, $submitted_by, CURRENT_TIMESTAMP)
			RETURNING id
		`);

		this.updateModerationStatusStatement = this.db.prepare(`
			UPDATE moderation_queue 
			SET status = $status, moderated_by = $moderated_by, moderated_at = $moderated_at
			WHERE id = $id
			RETURNING *
		`);

		this.getModerationQueueCountStatement = this.db.prepare(`
			SELECT COUNT(*) as count 
			FROM moderation_queue 
			WHERE status = ?
		`);

		this.getModerationQueuePaginatedStatement = this.db.prepare(`
			SELECT 
				id, 
				title,
				type, 
				status, 
				submitted_by, 
				submitted_at, 
				moderated_by, 
				moderated_at
			FROM moderation_queue
			WHERE status = $status
			AND ($type IS NULL OR type = $type)
			ORDER BY submitted_at DESC
			LIMIT $limit OFFSET $offset
		`);

		this.getModerationQueueCountFilteredStatement = this.db.prepare(`
			SELECT COUNT(*) as count
			FROM moderation_queue
			WHERE status = $status
		`);
	}

	getModerationQueue(status: ModerationStatus = ModerationStatus.PENDING): PreviewModerationQueueItem[] {
		return this.getModerationQueueStatement.all({ $status: status }) as PreviewModerationQueueItem[];
	}

	getModerationQueueItem(id: string): ModerationQueueItem | undefined {
		const result = this.getModerationQueueItemStatement.get({ $id: id });
		return result ? result as ModerationQueueItem : undefined;
	}

	addToModerationQueue(
		item: Omit<ModerationQueueItem, 'id' | 'status' | 'submitted_at' | 'moderated_by' | 'moderated_at'>
	): string {
		const result = this.addToModerationQueueStatement.get({
			$type: item.type,
			$status: ModerationStatus.PENDING,
			$data: item.data,
			$submitted_by: item.submitted_by
		}) as { id: string };

		return result.id;
	}

	updateModerationStatus(
		id: string, 
		status: Exclude<ModerationStatus, typeof ModerationStatus.PENDING>, 
		moderated_by: string
	): ModerationQueueItem | undefined {
		const result = this.updateModerationStatusStatement.get({
			$status: status,
			$moderated_by: moderated_by,
			$moderated_at: new Date().toISOString(),
			$id: id
		}) as ModerationQueueItem | null;
		
		return result || undefined;
	}

	getModerationQueueCount(status: ModerationStatus = ModerationStatus.PENDING): number {
		const result = this.getModerationQueueCountStatement.get(status) as { count: number };
		return result.count;
	}

	getModerationQueuePaginated(options: GetModerationQueueOptions): PreviewModerationQueueItem[] {
		const { status = ModerationStatus.PENDING, type, limit = 10, offset = 0 } = options;

		return this.getModerationQueuePaginatedStatement.all({
			$status: status,
			$type: type ?? null,
			$limit: limit,
			$offset: offset
		}) as PreviewModerationQueueItem[];
	}

	getModerationQueueCountFiltered(params: Pick<GetModerationQueueOptions, 'status'>): number {
		const result = this.getModerationQueueCountFilteredStatement.get({
			$status: params.status ?? ModerationStatus.PENDING
		}) as { count: number };
		return result.count;
	}
}