import { type MagnitudeConfig } from 'magnitude-test'

export default {
	url: 'http://localhost:5173',
	executor: {
		provider: 'moondream',
		options: {
			baseUrl: 'http://localhost:2020/v1'
		}
	}
} satisfies MagnitudeConfig
