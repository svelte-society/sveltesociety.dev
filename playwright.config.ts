import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: './tests',
	testMatch: /.*\.(test|spec)\.ts$/,
	// Maximum time one test can run
	timeout: 30 * 1000,
	// Test suite timeout
	globalTimeout: 10 * 60 * 1000, // 10 minutes
	expect: { timeout: 5000 },
	// Run tests in files in parallel
	fullyParallel: false, // Database concerns - sequential execution
	// Fail the build on CI if you accidentally left test.only
	forbidOnly: !!process.env.CI,
	// Retry on CI only
	retries: process.env.CI ? 2 : 0,
	// Limit workers to prevent database conflicts
	workers: process.env.CI ? 1 : 1, // Sequential for DB safety
	// Reporter configuration
	reporter: process.env.CI ? [['html'], ['github'], ['list']] : [['html'], ['list']],
	use: {
		// Base URL
		baseURL: 'http://localhost:4173',
		// Collect trace when retrying the failed test
		trace: 'retain-on-failure',
		// Screenshot on failure
		screenshot: 'only-on-failure',
		// Video on failure
		video: 'retain-on-failure',
		// Action timeout
		actionTimeout: 10000
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
		env: { DB_PATH: 'test.db', NODE_ENV: 'test' }
	}
} // Global setup/teardown will be added in Phase 2b
// globalSetup: './tests/setup/global-setup.ts',
// globalTeardown: './tests/setup/global-teardown.ts',

export default config
