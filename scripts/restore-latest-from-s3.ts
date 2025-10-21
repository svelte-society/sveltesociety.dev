import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { $ } from 'bun'

const DB_PATH = process.env.DB_PATH || 'local.db'
const OUTPUT_DIR = 'backups'

const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_BUCKET = process.env.S3_BUCKET
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_KEY = process.env.S3_SECRET_KEY

if (!S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
	console.error('Error: S3 credentials not configured')
	console.error('Required environment variables: S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY')
	console.error('Optional: S3_ENDPOINT (defaults to AWS S3)')
	process.exit(1)
}

if (!existsSync(OUTPUT_DIR)) {
	mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function getLatestBackupFromS3(): Promise<string> {
	console.log(`Fetching list of backups from S3 bucket: ${S3_BUCKET}...`)

	const s3 = new Bun.S3Client({
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY,
		bucket: S3_BUCKET,
		endpoint: S3_ENDPOINT,
		region: 'auto'
	})

	// List all objects in the bucket
	const result = await s3.list()

	// The result has a 'contents' property containing the files array
	const filesList = result.contents || []

	// Filter for backup files (backup_*.sql.gz pattern)
	const backupFiles = filesList
		.filter((file) => file.key.startsWith('backup_') && file.key.endsWith('.sql.gz'))
		.sort((a, b) => {
			// Sort by last modified date, newest first
			const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0
			const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0
			return dateB - dateA
		})

	if (backupFiles.length === 0) {
		throw new Error('No backup files found in S3 bucket')
	}

	const latestBackup = backupFiles[0]
	console.log(`Latest backup found: ${latestBackup.key}`)
	console.log(`Last modified: ${latestBackup.lastModified}`)
	console.log(`Size: ${(latestBackup.size / 1024 / 1024).toFixed(2)} MB`)

	return latestBackup.key
}

async function downloadFromS3(fileName: string): Promise<string> {
	const s3 = new Bun.S3Client({
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY,
		bucket: S3_BUCKET,
		endpoint: S3_ENDPOINT,
		region: 'auto'
	})

	const localPath = join(OUTPUT_DIR, fileName)

	console.log(`Downloading backup from S3...`)
	const content = s3.file(fileName)

	if (!content) {
		throw new Error(`Failed to download ${fileName} from S3`)
	}

	await Bun.write(localPath, content)
	console.log(`Downloaded to: ${localPath}`)

	return localPath
}

async function restoreDatabase(backupPath: string) {
	let sqlPath = backupPath

	// If it's a gzipped file, decompress it first
	if (backupPath.endsWith('.gz')) {
		console.log(`Decompressing backup...`)
		const compressed = await Bun.file(backupPath).arrayBuffer()
		const decompressed = Bun.gunzipSync(compressed)
		sqlPath = backupPath.replace('.gz', '')
		await Bun.write(sqlPath, decompressed)
		console.log(`Decompressed to: ${sqlPath}`)
	}

	// Remove existing database
	if (existsSync(DB_PATH)) {
		console.log(`Removing existing database at ${DB_PATH}...`)
		await $`rm -f ${DB_PATH}`
	}

	// Restore the database
	console.log(`Restoring database to ${DB_PATH}...`)
	await $`sqlite3 ${DB_PATH} < ${sqlPath}`

	// Clean up temporary decompressed file
	if (backupPath.endsWith('.gz') && sqlPath !== backupPath) {
		await $`rm -f ${sqlPath}`
	}

	console.log('Database restored successfully!')
}

try {
	// Get the latest backup from S3
	const latestBackupName = await getLatestBackupFromS3()

	// Download it
	const backupPath = await downloadFromS3(latestBackupName)

	// Restore the database
	await restoreDatabase(backupPath)
} catch (error) {
	console.error('Error: Restore from S3 failed', error)
	process.exit(1)
}
