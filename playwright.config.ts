import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: './tests',
	testMatch: /.*\.(test|spec)\.ts$/,
	// Maximum time one test can run
	timeout: 30 * 1000,
	// Test suite timeout
	globalTimeout: 10 * 60 * 1000, // 10 minutes
	// Assertion timeout - align with action timeout for consistency
	// Previously 5s which was too short relative to action timeout (10s)
	expect: { timeout: 10000 },
	// Run tests in files in parallel
	fullyParallel: true, // Enable parallel execution where safe
	// Fail the build on CI if you accidentally left test.only
	forbidOnly: !!process.env.CI,
	// Retry on CI only
	retries: process.env.CI ? 2 : 0,
	// Workers - allow parallel execution for read-only tests
	workers: process.env.CI ? 4 : 4,
	// Reporter configuration
	reporter: process.env.CI
		? [['html'], ['github'], ['list']]
		: [['html', { open: 'never' }], ['list']],
	use: {
		// Base URL
		baseURL: 'http://localhost:4173',
		// Collect trace when retrying the failed test
		trace: 'retain-on-failure',
		// Screenshot on failure
		screenshot: 'only-on-failure',
		// Video on failure
		video: 'retain-on-failure',
		// Action timeout (click, fill, etc.)
		actionTimeout: 15000,
		// Navigation timeout
		navigationTimeout: 30000
	},
	// Configure projects for major browsers
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	], // Uncomment for multi-browser testing (Phase 8)
	// {
	//   name: 'firefox',
	//   use: { ...devices['Desktop Firefox'] },
	// },
	// {
	//   name: 'webkit',
	//   use: { ...devices['Desktop Safari'] },
	// },
	// Run local server before starting tests
	webServer: {
		command: 'bun run --bun build && bun run --bun preview',
		port: 4173,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
		env: {
			DB_PATH: 'test.db',
			NODE_ENV: 'test',
			// Auth mocks
			GITHUB_CLIENT_ID: 'test_client',
			GITHUB_CLIENT_SECRET: 'test_secret',
			GITHUB_AUTHORIZATION_CALLBACK_URL: 'http://localhost:4173/auth/callback',
			// API mocks - use localhost:3001 to trigger test mode in email service
			PLUNK_API_SECRET_KEY: 'mock_plunk_key',
			PLUNK_API_URL: 'http://localhost:3001',
			STRIPE_SECRET_KEY: 'sk_test_mock',
			STRIPE_WEBHOOK_SECRET: 'whsec_test_mock',
			// Disable seeding
			SEED_DATABASE: 'none'
		}
	},
	// Global setup to pre-create isolated test databases
	globalSetup: './tests/setup/global-setup.ts',
	// Global teardown to cleanup isolated test databases
	globalTeardown: './tests/setup/global-teardown.ts'
}

export default config
