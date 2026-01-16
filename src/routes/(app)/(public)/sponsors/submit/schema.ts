import { z } from 'zod/v4'

// Transform empty strings to undefined for optional URL fields
const optionalUrl = z
	.string()
	.transform((val) => (val === '' ? undefined : val))
	.pipe(z.url({ message: 'Must be a valid URL' }).optional())

// Accept File for image uploads
const requiredFile = z.custom<File>(
	(val) => {
		if (val === undefined || val === null) return false
		// Check for file-like properties (works with both File and LazyFile)
		return typeof val === 'object' && 'name' in val && 'type' in val && 'arrayBuffer' in val
	},
	{ message: 'Logo is required' }
)

export const sponsorSubmissionSchema = z.object({
	// Company details
	company_name: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
	logo: requiredFile,
	tagline: z.string().min(10, { message: 'Tagline must be at least 10 characters' }),
	website_url: z.url({ message: 'Please enter a valid website URL' }),

	// Optional discount information
	discount_code: z.string().optional(),
	discount_description: z
		.string()
		.transform((val) => (val === '' ? undefined : val))
		.pipe(
			z
				.string()
				.max(100, { message: 'Discount description must be under 100 characters' })
				.optional()
		),

	// Plan selection
	tier_id: z.string().min(1, { message: 'Please select a sponsor tier' }),
	billing_type: z.enum(['monthly', 'yearly', 'one_time'], {
		message: 'Please select a billing type'
	})
})

export type SponsorSubmissionData = z.infer<typeof sponsorSubmissionSchema>
