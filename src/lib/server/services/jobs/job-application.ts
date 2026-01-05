import { Database } from 'bun:sqlite'

export type ApplicationStatus = 'pending' | 'viewed' | 'contacted' | 'rejected'

export interface JobApplication {
	id: string
	job_id: string
	applicant_id: string
	applicant_email: string
	message: string | null
	status: ApplicationStatus
	viewed_at: string | null
	created_at: string
}

export interface CreateApplicationData {
	job_id: string
	applicant_id: string
	applicant_email: string
	message?: string
}

export class JobApplicationService {
	constructor(private db: Database) {}

	/**
	 * Create a new job application
	 * @returns The ID of the created application
	 * @throws Error if user has already applied to this job
	 */
	createApplication(data: CreateApplicationData): string {
		const stmt = this.db.prepare(`
			INSERT INTO job_applications (
				job_id,
				applicant_id,
				applicant_email,
				message,
				status
			) VALUES (
				$job_id,
				$applicant_id,
				$applicant_email,
				$message,
				'pending'
			)
			RETURNING id
		`)

		const result = stmt.get({
			job_id: data.job_id,
			applicant_id: data.applicant_id,
			applicant_email: data.applicant_email,
			message: data.message || null
		}) as { id: string }

		return result.id
	}

	/**
	 * Get an application by its ID
	 */
	getApplicationById(id: string): JobApplication | null {
		const stmt = this.db.prepare('SELECT * FROM job_applications WHERE id = $id')
		const row = stmt.get({ id }) as JobApplication | undefined
		return row || null
	}

	/**
	 * Check if a user has already applied to a specific job
	 */
	hasApplied(jobId: string, applicantId: string): boolean {
		const stmt = this.db.prepare(`
			SELECT COUNT(*) as count FROM job_applications
			WHERE job_id = $job_id AND applicant_id = $applicant_id
		`)
		const result = stmt.get({ job_id: jobId, applicant_id: applicantId }) as { count: number }
		return result.count > 0
	}

	/**
	 * Get all applications for a specific job
	 * Ordered by created_at descending (most recent first)
	 */
	getApplicationsForJob(jobId: string): JobApplication[] {
		const stmt = this.db.prepare(`
			SELECT * FROM job_applications
			WHERE job_id = $job_id
			ORDER BY created_at DESC, rowid DESC
		`)
		return stmt.all({ job_id: jobId }) as JobApplication[]
	}

	/**
	 * Get all applications by a specific user
	 * Ordered by created_at descending (most recent first)
	 */
	getApplicationsByUser(applicantId: string): JobApplication[] {
		const stmt = this.db.prepare(`
			SELECT * FROM job_applications
			WHERE applicant_id = $applicant_id
			ORDER BY created_at DESC, rowid DESC
		`)
		return stmt.all({ applicant_id: applicantId }) as JobApplication[]
	}

	/**
	 * Update the status of an application
	 * Sets viewed_at timestamp when status changes to 'viewed'
	 */
	updateApplicationStatus(applicationId: string, status: ApplicationStatus): void {
		const stmt = this.db.prepare(`
			UPDATE job_applications
			SET
				status = $status,
				viewed_at = CASE WHEN $status = 'viewed' AND viewed_at IS NULL THEN CURRENT_TIMESTAMP ELSE viewed_at END
			WHERE id = $id
		`)
		stmt.run({ id: applicationId, status })
	}

	/**
	 * Get the count of applications for a specific job
	 */
	getApplicationCount(jobId: string): number {
		const stmt = this.db.prepare(`
			SELECT COUNT(*) as count FROM job_applications
			WHERE job_id = $job_id
		`)
		const row = stmt.get({ job_id: jobId }) as { count: number }
		return row.count
	}

	/**
	 * Delete an application
	 * @returns true if an application was deleted, false if not found
	 */
	deleteApplication(applicationId: string): boolean {
		const stmt = this.db.prepare('DELETE FROM job_applications WHERE id = $id')
		const result = stmt.run({ id: applicationId })
		return result.changes > 0
	}
}
