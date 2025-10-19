import { Database } from 'bun:sqlite'

// Create or open database file
const db = new Database('local.db')

const numReads = 100
const timings: number[] = []
const results: any[] = []

console.log('Starting Bun SQLite performance test...\n')

const stmt = db.prepare('SELECT * FROM users LIMIT 1')

// Perform multiple reads from users table
for (let i = 0; i < numReads; i++) {
	const startTime = performance.now()
	const result = stmt.get()
	const endTime = performance.now()

	const duration = endTime - startTime
	timings.push(duration)
	results.push({
		queryNumber: i + 1,
		result: result,
		timeMs: parseFloat(duration.toFixed(2))
	})
}

// Calculate statistics
const average = timings.reduce((a, b) => a + b, 0) / timings.length
const sorted = [...timings].sort((a, b) => a - b)
const median =
	sorted.length % 2 === 0
		? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
		: sorted[Math.floor(sorted.length / 2)]

const stats = {
	totalQueries: numReads,
	averageMs: parseFloat(average.toFixed(2)),
	medianMs: parseFloat(median.toFixed(2)),
	minMs: parseFloat(Math.min(...timings).toFixed(2)),
	maxMs: parseFloat(Math.max(...timings).toFixed(2))
}

// Output results as JSON
console.log(JSON.stringify(stats, null, 2))

// Write results to JSON file
await Bun.write('bun-sqlite-results.json', JSON.stringify(stats, null, 2))

// Close database
db.close()
