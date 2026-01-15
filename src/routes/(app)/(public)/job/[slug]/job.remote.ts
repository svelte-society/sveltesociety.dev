import { getRequestEvent, form } from '$app/server'
import { z } from 'zod/v4'

// Schema for job application
const applyToJobSchema = z.object({
	jobId: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.email('Please enter a valid email address'),
	message: z.string().optional()
})

/**
 * Apply to a job
 */
export const applyToJob = form(applyToJobSchema, async (data) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return {
			success: false,
			error: 'Authentication required',
			message: 'You must be logged in to apply for jobs.'
		}
	}

	if (!locals.user.email) {
		return {
			success: false,
			error: 'Email required',
			message: 'Your account must have an email address to apply for jobs.'
		}
	}

	// Get the job
	const job = locals.contentService.getContentById(data.jobId)
	if (!job || job.type !== 'job') {
		return {
			success: false,
			error: 'Job not found',
			message: 'The job you are trying to apply for does not exist.'
		}
	}

	// Check if job is expired
	const now = new Date().toISOString()
	if (job.metadata?.expires_at && job.metadata.expires_at < now) {
		return {
			success: false,
			error: 'Job expired',
			message: 'This job posting has expired and is no longer accepting applications.'
		}
	}

	// Check if user has already applied
	if (locals.jobApplicationService.hasApplied(data.jobId, locals.user.id)) {
		return {
			success: false,
			error: 'Already applied',
			message: 'You have already applied for this position.'
		}
	}

	try {
		// Create the application
		locals.jobApplicationService.createApplication({
			job_id: data.jobId,
			applicant_id: locals.user.id,
			applicant_name: data.name,
			applicant_email: data.email,
			message: data.message
		})

		// Send notification email to employer
		const employerEmail = job.metadata?.employer_email
		if (employerEmail) {
			await locals.emailService.sendJobApplicationEmail({
				employerEmail,
				jobTitle: job.title,
				applicantName: data.name,
				applicantEmail: data.email,
				applicantProfileUrl: `https://sveltesociety.dev/user/${locals.user.username}`,
				applicationMessage: data.message
			})
		}

		return { success: true, message: 'Application submitted successfully!' }
	} catch (error) {
		console.error('Error creating job application:', error)
		return {
			success: false,
			error: 'Application failed',
			message: 'Failed to submit your application. Please try again.'
		}
	}
})
