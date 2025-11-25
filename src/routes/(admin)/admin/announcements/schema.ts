import { z } from 'zod/v4'

export const placementSchema = z.object({
	content_id: z.string().min(1, 'Announcement is required'),
	placement_location_id: z.string().min(1, 'Placement location is required'),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	priority: z.number().int().min(0).default(0),
	is_active: z.boolean().default(true)
})
