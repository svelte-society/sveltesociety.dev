/**
 * Global test setup
 * Suppress expected error logs during tests for clean output
 */

// Store original console methods
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

// Suppress console.error and console.warn during tests
// Tests can still explicitly test error handling without noise
console.error = () => {}
console.warn = () => {}

// Export originals in case tests need to verify specific error messages
export const restoreConsole = () => {
	console.error = originalConsoleError
	console.warn = originalConsoleWarn
}

export const mockConsoleError = () => {
	const errorSpy: string[] = []
	console.error = (...args: any[]) => {
		errorSpy.push(args.join(' '))
	}
	return errorSpy
}
