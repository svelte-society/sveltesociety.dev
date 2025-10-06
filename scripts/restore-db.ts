import { existsSync } from 'fs'
import { join } from 'path'
import { $ } from 'bun'

const BACKUP_FILE = process.argv[2]
const DB_PATH = process.env.DB_PATH || 'local.db'
const RESTORE_CONFIRM = process.env.RESTORE_CONFIRM === 'true'

const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_BUCKET = process.env.S3_BUCKET
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_KEY = process.env.S3_SECRET_KEY

if (!BACKUP_FILE) {
	console.error('Usage: bun run --bun restore-db <backup-filename>')
	console.error('Example: bun run --bun restore-db backup_2025-01-09_123456.sql.gz')
	console.error('Will first check locally in backups/, then try S3 if not found')
	process.exit(1)
}

async function downloadFromS3(fileName: string): Promise<string> {
	if (!S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
		throw new Error('S3 credentials not configured')
	}

	const s3 = new Bun.S3Client({
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY,
		bucket: S3_BUCKET,
		endpoint: S3_ENDPOINT,
		region: 'auto'
	})

	const localPath = join('backups', fileName)

	console.log(`Downloading backup from S3: ${fileName}...`)
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

	// Check if database already exists
	if (existsSync(DB_PATH) && !RESTORE_CONFIRM) {
		console.error(`Error: Database already exists at ${DB_PATH}`)
		console.error('To overwrite, set RESTORE_CONFIRM=true environment variable')
		process.exit(1)
	}

	// Remove existing database if confirmed
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
	let backupPath = BACKUP_FILE

	// If it's just a filename, check in backups folder first
	if (!backupPath.includes('/')) {
		const localPath = join('backups', backupPath)
		if (existsSync(localPath)) {
			backupPath = localPath
		} else {
			// Try to download from S3 if file doesn't exist locally
			console.log(`Local file not found, attempting to download from S3...`)
			backupPath = await downloadFromS3(backupPath)
		}
	} else if (!existsSync(backupPath)) {
		throw new Error(`Backup file not found: ${backupPath}`)
	}

	await restoreDatabase(backupPath)
} catch (error) {
	console.error('Error: Restore failed', error)
	process.exit(1)
}
