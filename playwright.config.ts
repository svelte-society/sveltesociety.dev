import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'bun --bun --env-file=.env.test run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		env: {
			DB_PATH: 'test.db',
			NODE_ENV: 'test'
		}
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
}

export default config
