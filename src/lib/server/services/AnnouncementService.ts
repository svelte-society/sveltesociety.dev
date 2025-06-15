import type { Database } from 'better-sqlite3'

export interface PlacementLocation {
	id: string
	key: string
	name: string
	description: string | null
	is_active: number
	created_at: string
	updated_at: string
}

export interface AnnouncementPlacement {
	id: string
	content_id: string
	placement_location_id: string
	start_date: string | null
	end_date: string | null
	is_active: number
	priority: number
	created_at: string
	updated_at: string
	created_by: string | null
}

export interface AnnouncementPlacementWithContent extends AnnouncementPlacement {
	title: string
	description: string
	body: string
	metadata: any
	slug: string
	placement_key: string
	placement_name: string
}

export class AnnouncementService {
	private db: Database
	
	// Placement location statements
	private createLocationStatement: any
	private updateLocationStatement: any
	private deleteLocationStatement: any
	private getLocationByIdStatement: any
	private getLocationByKeyStatement: any
	private getAllLocationsStatement: any
	private getActiveLocationsStatement: any
	
	// Announcement placement statements
	private createPlacementStatement: any
	private updatePlacementStatement: any
	private deletePlacementStatement: any
	private getPlacementByIdStatement: any
	private getPlacementsByLocationKeyStatement: any
	private getActivePlacementsByLocationKeyStatement: any
	private getAllPlacementsStatement: any
	private getPlacementsByContentIdStatement: any

	constructor(db: Database) {
		this.db = db

		// Placement location prepared statements
		this.createLocationStatement = this.db.prepare(`
			INSERT INTO placement_locations (key, name, description, is_active)
			VALUES ($key, $name, $description, $is_active)
			RETURNING *
		`)

		this.updateLocationStatement = this.db.prepare(`
			UPDATE placement_locations
			SET key = $key, name = $name, description = $description, is_active = $is_active
			WHERE id = $id
			RETURNING *
		`)

		this.deleteLocationStatement = this.db.prepare(`
			DELETE FROM placement_locations WHERE id = $id
		`)

		this.getLocationByIdStatement = this.db.prepare(`
			SELECT * FROM placement_locations WHERE id = $id
		`)

		this.getLocationByKeyStatement = this.db.prepare(`
			SELECT * FROM placement_locations WHERE key = $key
		`)

		this.getAllLocationsStatement = this.db.prepare(`
			SELECT * FROM placement_locations ORDER BY name
		`)

		this.getActiveLocationsStatement = this.db.prepare(`
			SELECT * FROM placement_locations WHERE is_active = 1 ORDER BY name
		`)

		// Announcement placement prepared statements
		this.createPlacementStatement = this.db.prepare(`
			INSERT INTO announcement_placements (content_id, placement_location_id, start_date, end_date, is_active, priority, created_by)
			VALUES ($content_id, $placement_location_id, $start_date, $end_date, $is_active, $priority, $created_by)
			RETURNING *
		`)

		this.updatePlacementStatement = this.db.prepare(`
			UPDATE announcement_placements
			SET content_id = $content_id,
				placement_location_id = $placement_location_id,
				start_date = $start_date,
				end_date = $end_date,
				is_active = $is_active,
				priority = $priority
			WHERE id = $id
			RETURNING *
		`)

		this.deletePlacementStatement = this.db.prepare(`
			DELETE FROM announcement_placements WHERE id = $id
		`)

		this.getPlacementByIdStatement = this.db.prepare(`
			SELECT ap.*, c.title, c.description, c.body, c.metadata, c.slug,
				   pl.key as placement_key, pl.name as placement_name
			FROM announcement_placements ap
			JOIN content c ON ap.content_id = c.id
			JOIN placement_locations pl ON ap.placement_location_id = pl.id
			WHERE ap.id = $id
		`)

		this.getPlacementsByLocationKeyStatement = this.db.prepare(`
			SELECT ap.*, c.title, c.description, c.body, c.metadata, c.slug,
				   pl.key as placement_key, pl.name as placement_name
			FROM announcement_placements ap
			JOIN content c ON ap.content_id = c.id
			JOIN placement_locations pl ON ap.placement_location_id = pl.id
			WHERE pl.key = $key
			ORDER BY ap.priority DESC, ap.created_at DESC
		`)

		this.getActivePlacementsByLocationKeyStatement = this.db.prepare(`
			SELECT ap.*, c.title, c.description, c.body, c.metadata, c.slug,
				   pl.key as placement_key, pl.name as placement_name
			FROM announcement_placements ap
			JOIN content c ON ap.content_id = c.id
			JOIN placement_locations pl ON ap.placement_location_id = pl.id
			WHERE pl.key = $key
				AND ap.is_active = 1
				AND c.status = 'published'
				AND (ap.start_date IS NULL OR ap.start_date <= CURRENT_TIMESTAMP)
				AND (ap.end_date IS NULL OR ap.end_date > CURRENT_TIMESTAMP)
			ORDER BY ap.priority DESC, ap.created_at DESC
		`)

		this.getAllPlacementsStatement = this.db.prepare(`
			SELECT ap.*, c.title, c.description, c.body, c.metadata, c.slug,
				   pl.key as placement_key, pl.name as placement_name
			FROM announcement_placements ap
			JOIN content c ON ap.content_id = c.id
			JOIN placement_locations pl ON ap.placement_location_id = pl.id
			ORDER BY pl.name, ap.priority DESC, ap.created_at DESC
		`)

		this.getPlacementsByContentIdStatement = this.db.prepare(`
			SELECT ap.*, pl.key as placement_key, pl.name as placement_name
			FROM announcement_placements ap
			JOIN placement_locations pl ON ap.placement_location_id = pl.id
			WHERE ap.content_id = $content_id
			ORDER BY pl.name, ap.created_at DESC
		`)
	}

	// Placement location methods
	createLocation(data: {
		key: string
		name: string
		description?: string | null
		is_active?: boolean
	}): PlacementLocation | null {
		try {
			const result = this.createLocationStatement.get({
				key: data.key,
				name: data.name,
				description: data.description || null,
				is_active: data.is_active !== false ? 1 : 0
			})
			return result as PlacementLocation
		} catch (error) {
			console.error('Error creating placement location:', error)
			return null
		}
	}

	updateLocation(
		id: string,
		data: {
			key?: string
			name?: string
			description?: string | null
			is_active?: boolean
		}
	): PlacementLocation | null {
		try {
			const existing = this.getLocationById(id)
			if (!existing) return null

			const result = this.updateLocationStatement.get({
				id,
				key: data.key ?? existing.key,
				name: data.name ?? existing.name,
				description: data.description !== undefined ? data.description : existing.description,
				is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active
			})
			return result as PlacementLocation
		} catch (error) {
			console.error('Error updating placement location:', error)
			return null
		}
	}

	deleteLocation(id: string): boolean {
		try {
			const result = this.deleteLocationStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting placement location:', error)
			return false
		}
	}

	getLocationById(id: string): PlacementLocation | null {
		try {
			return this.getLocationByIdStatement.get({ id }) as PlacementLocation | null
		} catch (error) {
			console.error('Error getting placement location by id:', error)
			return null
		}
	}

	getLocationByKey(key: string): PlacementLocation | null {
		try {
			return this.getLocationByKeyStatement.get({ key }) as PlacementLocation | null
		} catch (error) {
			console.error('Error getting placement location by key:', error)
			return null
		}
	}

	getAllLocations(): PlacementLocation[] {
		try {
			return this.getAllLocationsStatement.all() as PlacementLocation[]
		} catch (error) {
			console.error('Error getting all placement locations:', error)
			return []
		}
	}

	getActiveLocations(): PlacementLocation[] {
		try {
			return this.getActiveLocationsStatement.all() as PlacementLocation[]
		} catch (error) {
			console.error('Error getting active placement locations:', error)
			return []
		}
	}

	// Announcement placement methods
	createPlacement(data: {
		content_id: string
		placement_location_id: string
		start_date?: string | null
		end_date?: string | null
		is_active?: boolean
		priority?: number
		created_by?: string | null
	}): AnnouncementPlacement | null {
		try {
			const result = this.createPlacementStatement.get({
				content_id: data.content_id,
				placement_location_id: data.placement_location_id,
				start_date: data.start_date || null,
				end_date: data.end_date || null,
				is_active: data.is_active !== false ? 1 : 0,
				priority: data.priority || 0,
				created_by: data.created_by || null
			})
			return result as AnnouncementPlacement
		} catch (error) {
			console.error('Error creating announcement placement:', error)
			return null
		}
	}

	updatePlacement(
		id: string,
		data: {
			content_id?: string
			placement_location_id?: string
			start_date?: string | null
			end_date?: string | null
			is_active?: boolean
			priority?: number
		}
	): AnnouncementPlacement | null {
		try {
			const existing = this.getPlacementById(id)
			if (!existing) return null

			const result = this.updatePlacementStatement.get({
				id,
				content_id: data.content_id ?? existing.content_id,
				placement_location_id: data.placement_location_id ?? existing.placement_location_id,
				start_date: data.start_date !== undefined ? data.start_date : existing.start_date,
				end_date: data.end_date !== undefined ? data.end_date : existing.end_date,
				is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active,
				priority: data.priority ?? existing.priority
			})
			return result as AnnouncementPlacement
		} catch (error) {
			console.error('Error updating announcement placement:', error)
			return null
		}
	}

	deletePlacement(id: string): boolean {
		try {
			const result = this.deletePlacementStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting announcement placement:', error)
			return false
		}
	}

	getPlacementById(id: string): AnnouncementPlacementWithContent | null {
		try {
			return this.getPlacementByIdStatement.get({ id }) as AnnouncementPlacementWithContent | null
		} catch (error) {
			console.error('Error getting announcement placement by id:', error)
			return null
		}
	}

	getPlacementsByLocationKey(key: string): AnnouncementPlacementWithContent[] {
		try {
			return this.getPlacementsByLocationKeyStatement.all({ key }) as AnnouncementPlacementWithContent[]
		} catch (error) {
			console.error('Error getting placements by location key:', error)
			return []
		}
	}

	getActivePlacementsByLocationKey(key: string): AnnouncementPlacementWithContent[] {
		try {
			return this.getActivePlacementsByLocationKeyStatement.all({ key }) as AnnouncementPlacementWithContent[]
		} catch (error) {
			console.error('Error getting active placements by location key:', error)
			return []
		}
	}

	getAllPlacements(): AnnouncementPlacementWithContent[] {
		try {
			return this.getAllPlacementsStatement.all() as AnnouncementPlacementWithContent[]
		} catch (error) {
			console.error('Error getting all placements:', error)
			return []
		}
	}

	getPlacementsByContentId(content_id: string): (AnnouncementPlacement & { placement_key: string; placement_name: string })[] {
		try {
			return this.getPlacementsByContentIdStatement.all({ content_id }) as (AnnouncementPlacement & { placement_key: string; placement_name: string })[]
		} catch (error) {
			console.error('Error getting placements by content id:', error)
			return []
		}
	}

	togglePlacementStatus(id: string): AnnouncementPlacement | null {
		const placement = this.getPlacementById(id)
		if (!placement) return null

		return this.updatePlacement(id, { is_active: !placement.is_active })
	}
}