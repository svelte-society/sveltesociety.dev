import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { JobApplicationService, type JobApplication } from './job-application'
import { createTestDatabase } from '../../db/test-helpers'

describe('JobApplicationService', () => {
	let db: Database
	let jobApplicationService: JobApplicationService
	let testJobId: string
	let testUserId: string

	beforeAll(() => {
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear applications table
		db.prepare('DELETE FROM job_applications').run()

		// Create a test job
		const job = db
			.prepare(
				`INSERT INTO content (title, slug, type, status, description, body)
			 VALUES ('Test Job', 'test-job-app', 'job', 'published', 'Test description', 'Job body')
			 RETURNING id`
			)
			.get() as { id: string }
		testJobId = job.id

		// Create a test user
		const existingUser = db.prepare('SELECT id FROM users WHERE username = $username').get({ username: 'test_applicant' }) as
			| { id: string }
			| undefined

		if (existingUser) {
			testUserId = existingUser.id
		} else {
			const role = db.prepare('SELECT id FROM roles LIMIT 1').get() as { id: number }
			const user = db
				.prepare(
					`INSERT INTO users (username, email, name, role)
				 VALUES ('test_applicant', 'applicant@test.com', 'Test Applicant', $role)
				 RETURNING id`
				)
				.get({ role: role.id }) as { id: string }
			testUserId = user.id
		}

		jobApplicationService = new JobApplicationService(db)
	})

	describe('createApplication', () => {
		test('should create a new application', () => {
			const applicationData = {
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			}

			const applicationId = jobApplicationService.createApplication(applicationData)

			expect(applicationId).toBeDefined()
			expect(typeof applicationId).toBe('string')
		})

		test('should create application with pending status by default', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			const application = jobApplicationService.getApplicationById(applicationId)

			expect(application?.status).toBe('pending')
		})

		test('should create application with optional message', () => {
			const message = 'I am very interested in this position!'
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com',
				message
			})

			const application = jobApplicationService.getApplicationById(applicationId)

			expect(application?.message).toBe(message)
		})

		test('should not allow duplicate applications from same user to same job', () => {
			// First application should succeed
			jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			// Second application should throw
			expect(() => {
				jobApplicationService.createApplication({
					job_id: testJobId,
					applicant_id: testUserId,
					applicant_email: 'applicant@test.com'
				})
			}).toThrow()
		})
	})

	describe('getApplicationById', () => {
		test('should return application by id', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			const application = jobApplicationService.getApplicationById(applicationId)

			expect(application).toBeDefined()
			expect(application?.id).toBe(applicationId)
		})

		test('should return null for non-existent id', () => {
			const application = jobApplicationService.getApplicationById('non-existent-id')

			expect(application).toBeNull()
		})
	})

	describe('hasApplied', () => {
		test('should return true if user has applied to job', () => {
			jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			const hasApplied = jobApplicationService.hasApplied(testJobId, testUserId)

			expect(hasApplied).toBe(true)
		})

		test('should return false if user has not applied to job', () => {
			const hasApplied = jobApplicationService.hasApplied(testJobId, testUserId)

			expect(hasApplied).toBe(false)
		})
	})

	describe('getApplicationsForJob', () => {
		test('should return all applications for a job', () => {
			// Create multiple users and applications
			for (let i = 0; i < 3; i++) {
				const role = db.prepare('SELECT id FROM roles LIMIT 1').get() as { id: number }
				const user = db
					.prepare(
						`INSERT INTO users (username, email, name, role)
					 VALUES ($username, $email, $name, $role)
					 RETURNING id`
					)
					.get({
						username: `applicant_${i}`,
						email: `applicant${i}@test.com`,
						name: `Applicant ${i}`,
						role: role.id
					}) as { id: string }

				jobApplicationService.createApplication({
					job_id: testJobId,
					applicant_id: user.id,
					applicant_email: `applicant${i}@test.com`
				})
			}

			const applications = jobApplicationService.getApplicationsForJob(testJobId)

			expect(applications.length).toBe(3)
		})

		test('should return empty array for job with no applications', () => {
			const applications = jobApplicationService.getApplicationsForJob(testJobId)

			expect(applications).toEqual([])
		})

		test('should return applications ordered by created_at desc', () => {
			// Create two applications
			const role = db.prepare('SELECT id FROM roles LIMIT 1').get() as { id: number }
			const user1 = db
				.prepare(
					`INSERT INTO users (username, email, name, role)
				 VALUES ('first_app', 'first@test.com', 'First', $role)
				 RETURNING id`
				)
				.get({ role: role.id }) as { id: string }
			const user2 = db
				.prepare(
					`INSERT INTO users (username, email, name, role)
				 VALUES ('second_app', 'second@test.com', 'Second', $role)
				 RETURNING id`
				)
				.get({ role: role.id }) as { id: string }

			jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: user1.id,
				applicant_email: 'first@test.com'
			})
			jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: user2.id,
				applicant_email: 'second@test.com'
			})

			const applications = jobApplicationService.getApplicationsForJob(testJobId)

			// Most recent should be first
			expect(applications[0].applicant_email).toBe('second@test.com')
		})
	})

	describe('getApplicationsByUser', () => {
		test('should return all applications by a user', () => {
			// Create multiple jobs
			const jobs: string[] = []
			for (let i = 0; i < 3; i++) {
				const job = db
					.prepare(
						`INSERT INTO content (title, slug, type, status, description, body)
					 VALUES ($title, $slug, 'job', 'published', 'Desc', 'Body')
					 RETURNING id`
					)
					.get({
						title: `Job ${i}`,
						slug: `job-${i}`
					}) as { id: string }
				jobs.push(job.id)

				jobApplicationService.createApplication({
					job_id: job.id,
					applicant_id: testUserId,
					applicant_email: 'applicant@test.com'
				})
			}

			const applications = jobApplicationService.getApplicationsByUser(testUserId)

			expect(applications.length).toBe(3)
		})

		test('should return empty array for user with no applications', () => {
			const applications = jobApplicationService.getApplicationsByUser(testUserId)

			expect(applications).toEqual([])
		})
	})

	describe('updateApplicationStatus', () => {
		test('should update application status to viewed', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			jobApplicationService.updateApplicationStatus(applicationId, 'viewed')

			const application = jobApplicationService.getApplicationById(applicationId)
			expect(application?.status).toBe('viewed')
		})

		test('should update application status to contacted', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			jobApplicationService.updateApplicationStatus(applicationId, 'contacted')

			const application = jobApplicationService.getApplicationById(applicationId)
			expect(application?.status).toBe('contacted')
		})

		test('should update application status to rejected', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			jobApplicationService.updateApplicationStatus(applicationId, 'rejected')

			const application = jobApplicationService.getApplicationById(applicationId)
			expect(application?.status).toBe('rejected')
		})

		test('should set viewed_at when status changes to viewed', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			jobApplicationService.updateApplicationStatus(applicationId, 'viewed')

			const application = jobApplicationService.getApplicationById(applicationId)
			expect(application?.viewed_at).toBeDefined()
		})
	})

	describe('getApplicationCount', () => {
		test('should return count of applications for a job', () => {
			// Create multiple applications
			for (let i = 0; i < 5; i++) {
				const role = db.prepare('SELECT id FROM roles LIMIT 1').get() as { id: number }
				const user = db
					.prepare(
						`INSERT INTO users (username, email, name, role)
					 VALUES ($username, $email, $name, $role)
					 RETURNING id`
					)
					.get({
						username: `count_user_${i}`,
						email: `count${i}@test.com`,
						name: `User ${i}`,
						role: role.id
					}) as { id: string }

				jobApplicationService.createApplication({
					job_id: testJobId,
					applicant_id: user.id,
					applicant_email: `count${i}@test.com`
				})
			}

			const count = jobApplicationService.getApplicationCount(testJobId)

			expect(count).toBe(5)
		})

		test('should return 0 for job with no applications', () => {
			const count = jobApplicationService.getApplicationCount(testJobId)

			expect(count).toBe(0)
		})
	})

	describe('deleteApplication', () => {
		test('should delete an application', () => {
			const applicationId = jobApplicationService.createApplication({
				job_id: testJobId,
				applicant_id: testUserId,
				applicant_email: 'applicant@test.com'
			})

			const success = jobApplicationService.deleteApplication(applicationId)

			expect(success).toBe(true)
			expect(jobApplicationService.getApplicationById(applicationId)).toBeNull()
		})

		test('should return false for non-existent application', () => {
			const success = jobApplicationService.deleteApplication('non-existent-id')

			expect(success).toBe(false)
		})
	})
})
