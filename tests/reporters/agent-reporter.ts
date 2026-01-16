/**
 * Agent Reporter for Playwright
 *
 * A context-efficient reporter that minimizes output for coding agents:
 * - On success: outputs "✓ N tests passed in Xs"
 * - On failure: outputs failing test names + error messages
 *
 * Usage:
 *   AGENT_MODE=1 playwright test
 *
 * Or in playwright.config.ts:
 *   reporter: process.env.AGENT_MODE
 *     ? [['./tests/reporters/agent-reporter.ts']]
 *     : [['html'], ['list']]
 */

import type {
	FullConfig,
	FullResult,
	Reporter,
	Suite,
	TestCase,
	TestResult
} from '@playwright/test/reporter'

interface FailedTest {
	title: string
	file: string
	error: string
}

class AgentReporter implements Reporter {
	private passed = 0
	private failed = 0
	private skipped = 0
	private failedTests: FailedTest[] = []
	private startTime = 0
	private jsonMode = false

	constructor(options?: { json?: boolean }) {
		this.jsonMode = options?.json ?? process.env.AGENT_JSON === '1'
	}

	onBegin(_config: FullConfig, _suite: Suite) {
		this.startTime = Date.now()
		this.passed = 0
		this.failed = 0
		this.skipped = 0
		this.failedTests = []
	}

	onTestEnd(test: TestCase, result: TestResult) {
		switch (result.status) {
			case 'passed':
				this.passed++
				break
			case 'failed':
			case 'timedOut':
				this.failed++
				this.failedTests.push({
					title: test.title,
					file: test.location.file.split('/').slice(-2).join('/'),
					error: this.extractErrorMessage(result)
				})
				break
			case 'skipped':
				this.skipped++
				break
		}
	}

	onEnd(result: FullResult) {
		const duration = ((Date.now() - this.startTime) / 1000).toFixed(1)
		const total = this.passed + this.failed + this.skipped

		if (this.jsonMode) {
			this.outputJson(result, duration, total)
		} else {
			this.outputText(result, duration, total)
		}
	}

	private outputJson(result: FullResult, duration: string, total: number) {
		const output = {
			status: result.status === 'passed' ? 'passed' : 'failed',
			summary: {
				total,
				passed: this.passed,
				failed: this.failed,
				skipped: this.skipped,
				duration: `${duration}s`
			},
			failures: this.failedTests.map((t) => ({
				title: t.title,
				file: t.file,
				error: t.error
			}))
		}
		console.log(JSON.stringify(output, null, 2))
	}

	private outputText(result: FullResult, duration: string, total: number) {
		console.log('')

		if (result.status === 'passed') {
			console.log(`✓ ${this.passed} tests passed in ${duration}s`)
			if (this.skipped > 0) {
				console.log(`  (${this.skipped} skipped)`)
			}
		} else {
			console.log(`✗ ${this.failed}/${total} tests failed in ${duration}s`)
			console.log('')
			console.log('Failed tests:')
			for (const test of this.failedTests) {
				console.log(`  ✗ ${test.file} > ${test.title}`)
				if (test.error) {
					// Indent error message
					const errorLines = test.error.split('\n').slice(0, 5) // Limit to first 5 lines
					for (const line of errorLines) {
						console.log(`    ${line}`)
					}
					if (test.error.split('\n').length > 5) {
						console.log(`    ... (truncated)`)
					}
				}
				console.log('')
			}
		}
	}

	private extractErrorMessage(result: TestResult): string {
		if (result.errors.length === 0) {
			return ''
		}

		const error = result.errors[0]
		if (error.message) {
			// Clean up the error message - remove ANSI codes and excessive whitespace
			return error.message
				.replace(/\x1b\[[0-9;]*m/g, '') // Remove ANSI codes
				.replace(/\s+/g, ' ') // Collapse whitespace
				.trim()
				.slice(0, 500) // Limit length
		}

		return ''
	}
}

export default AgentReporter
