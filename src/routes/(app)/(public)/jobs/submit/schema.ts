import { z } from 'zod/v4'

// Transform empty strings to undefined for optional URL fields
const optionalUrl = z.string().transform((val) => (val === '' ? undefined : val)).pipe(
	z.url({ message: 'Must be a valid URL' }).optional()
)

// Transform empty strings to undefined for optional number fields
const optionalNumber = z.string().transform((val) => (val === '' ? undefined : Number(val))).pipe(
	z.number().positive().optional()
)

export const jobSubmissionSchema = z.object({
	// Company details
	company_name: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
	company_logo: optionalUrl,
	company_website: optionalUrl,
	employer_email: z.email({ message: 'Please enter a valid email address' }),

	// Job details
	title: z.string().min(5, { message: 'Job title must be at least 5 characters' }),
	description: z.string().min(50, { message: 'Description must be at least 50 characters' }),
	body: z.string().min(100, { message: 'Job details must be at least 100 characters' }),

	// Job type
	position_type: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
		message: 'Please select a position type'
	}),
	seniority_level: z.enum(['entry', 'junior', 'mid', 'senior', 'principal'], {
		message: 'Please select a seniority level'
	}),

	// Location
	remote_status: z.enum(['on-site', 'hybrid', 'remote'], {
		message: 'Please select a remote status'
	}),
	remote_restrictions: z.string().optional(),
	location: z.string().optional(),

	// Salary (optional)
	salary_min: optionalNumber,
	salary_max: optionalNumber,
	salary_currency: z.string().default('USD'),

	// Tier selection
	tier_id: z.string().min(1, { message: 'Please select a pricing tier' })
})

export type JobSubmissionData = z.infer<typeof jobSubmissionSchema>
