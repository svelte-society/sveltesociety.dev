import type { Database } from 'better-sqlite3'
import type {
	SocialQueueSettings,
	SocialQueueSettingsRaw,
	UpdateSocialQueueSettingsData,
	SocialPlatform
} from '$lib/types/social'

export class SocialQueueService {
	private db: Database

	private getSettingsStatement: ReturnType<Database['prepare']>
	private getAllSettingsStatement: ReturnType<Database['prepare']>
	private updateSettingsStatement: ReturnType<Database['prepare']>
	private createSettingsStatement: ReturnType<Database['prepare']>

	constructor(db: Database) {
		this.db = db

		this.getSettingsStatement = this.db.prepare(`
			SELECT * FROM social_queue_settings WHERE platform = $platform
		`)

		this.getAllSettingsStatement = this.db.prepare(`
			SELECT * FROM social_queue_settings ORDER BY platform
		`)

		this.updateSettingsStatement = this.db.prepare(`
			UPDATE social_queue_settings
			SET posting_times = $posting_times,
				posting_days = $posting_days,
				min_gap_minutes = $min_gap_minutes,
				is_paused = $is_paused,
				timezone = $timezone
			WHERE platform = $platform
			RETURNING *
		`)

		this.createSettingsStatement = this.db.prepare(`
			INSERT INTO social_queue_settings (
				platform, posting_times, posting_days, min_gap_minutes, is_paused, timezone
			)
			VALUES ($platform, $posting_times, $posting_days, $min_gap_minutes, $is_paused, $timezone)
			RETURNING *
		`)
	}

	// ==========================================
	// Parsing Helpers
	// ==========================================

	private parseJsonArray<T>(json: string | null, fallback: T[]): T[] {
		if (!json) return fallback
		try {
			const parsed = JSON.parse(json)
			return Array.isArray(parsed) ? parsed : fallback
		} catch {
			return fallback
		}
	}

	private parseRawSettings(row: SocialQueueSettingsRaw | null): SocialQueueSettings | null {
		if (!row) return null

		return {
			id: row.id,
			platform: row.platform,
			posting_times: this.parseJsonArray<string>(row.posting_times, []),
			posting_days: this.parseJsonArray<number>(row.posting_days, []),
			min_gap_minutes: row.min_gap_minutes,
			is_paused: row.is_paused === 1,
			timezone: row.timezone,
			created_at: row.created_at,
			updated_at: row.updated_at
		}
	}

	// ==========================================
	// CRUD Methods
	// ==========================================

	/**
	 * Get queue settings for a specific platform (or 'global')
	 */
	getSettings(platform: SocialPlatform | 'global'): SocialQueueSettings | null {
		try {
			const result = this.getSettingsStatement.get({ platform }) as
				| SocialQueueSettingsRaw
				| undefined
			return result ? this.parseRawSettings(result) : null
		} catch (error) {
			console.error('Error getting queue settings:', error)
			return null
		}
	}

	/**
	 * Get all queue settings (global + per-platform)
	 */
	getAllSettings(): SocialQueueSettings[] {
		try {
			const rows = this.getAllSettingsStatement.all() as SocialQueueSettingsRaw[]
			return rows
				.map((row) => this.parseRawSettings(row))
				.filter((s): s is SocialQueueSettings => s !== null)
		} catch (error) {
			console.error('Error getting all queue settings:', error)
			return []
		}
	}

	/**
	 * Update queue settings for a specific platform
	 */
	updateSettings(
		platform: SocialPlatform | 'global',
		data: UpdateSocialQueueSettingsData
	): SocialQueueSettings | null {
		try {
			// Get existing settings
			const existing = this.getSettings(platform)

			if (!existing) {
				// Create new settings if they don't exist
				const result = this.createSettingsStatement.get({
					platform,
					posting_times: JSON.stringify(
						data.posting_times ?? ['09:00', '12:00', '15:00', '18:00']
					),
					posting_days: JSON.stringify(data.posting_days ?? [1, 2, 3, 4, 5]),
					min_gap_minutes: data.min_gap_minutes ?? 60,
					is_paused: (data.is_paused ?? false) ? 1 : 0,
					timezone: data.timezone ?? 'America/New_York'
				}) as SocialQueueSettingsRaw | undefined

				return result ? this.parseRawSettings(result) : null
			}

			// Update existing settings
			const result = this.updateSettingsStatement.get({
				platform,
				posting_times: data.posting_times
					? JSON.stringify(data.posting_times)
					: JSON.stringify(existing.posting_times),
				posting_days: data.posting_days
					? JSON.stringify(data.posting_days)
					: JSON.stringify(existing.posting_days),
				min_gap_minutes: data.min_gap_minutes ?? existing.min_gap_minutes,
				is_paused: data.is_paused !== undefined ? (data.is_paused ? 1 : 0) : (existing.is_paused ? 1 : 0),
				timezone: data.timezone ?? existing.timezone
			}) as SocialQueueSettingsRaw | undefined

			return result ? this.parseRawSettings(result) : null
		} catch (error) {
			console.error('Error updating queue settings:', error)
			return null
		}
	}

	/**
	 * Pause or resume the queue for a specific platform
	 */
	setQueuePaused(platform: SocialPlatform | 'global', paused: boolean): SocialQueueSettings | null {
		return this.updateSettings(platform, { is_paused: paused })
	}

	/**
	 * Get the next available posting slot for a platform
	 */
	getNextAvailableSlot(
		platform: SocialPlatform,
		afterDate: Date = new Date()
	): { datetime: Date; slot: string } | null {
		try {
			// Get platform-specific settings, fall back to global
			let settings = this.getSettings(platform)
			if (!settings) {
				settings = this.getSettings('global')
			}
			if (!settings) return null

			if (settings.is_paused) return null
			if (settings.posting_times.length === 0) return null
			if (settings.posting_days.length === 0) return null

			// Find next available slot
			const now = new Date(afterDate)
			const maxDaysToSearch = 14 // Search up to 2 weeks ahead

			for (let dayOffset = 0; dayOffset < maxDaysToSearch; dayOffset++) {
				const checkDate = new Date(now)
				checkDate.setDate(now.getDate() + dayOffset)
				const dayOfWeek = checkDate.getDay()

				// Check if this day is allowed
				if (!settings.posting_days.includes(dayOfWeek)) continue

				for (const timeStr of settings.posting_times) {
					const [hours, minutes] = timeStr.split(':').map(Number)
					const slotDate = new Date(checkDate)
					slotDate.setHours(hours, minutes, 0, 0)

					// Check if this slot is in the future
					if (slotDate > now) {
						return { datetime: slotDate, slot: timeStr }
					}
				}
			}

			return null
		} catch (error) {
			console.error('Error getting next available slot:', error)
			return null
		}
	}
}
