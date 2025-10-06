import { existsSync, mkdirSync } from 'fs'
import { join, basename } from 'path'
import { $ } from 'bun'

const DB_PATH = process.env.DB_PATH || 'local.db'
const OUTPUT_DIR = process.argv[2] || 'backups'
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5)
const BACKUP_FILE = join(OUTPUT_DIR, `backup_${TIMESTAMP}.sql`)

const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_BUCKET = process.env.S3_BUCKET
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_KEY = process.env.S3_SECRET_KEY

if (!existsSync(DB_PATH)) {
	console.error(`Error: Database file '${DB_PATH}' not found`)
	process.exit(1)
}

if (!existsSync(OUTPUT_DIR)) {
	mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function uploadToS3(filePath: string, content: ArrayBuffer) {
	if (!S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
		console.log('S3 credentials not configured, skipping upload')
		return
	}

	const s3 = new Bun.S3Client({
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY,
		bucket: S3_BUCKET,
		endpoint: S3_ENDPOINT,
		region: 'auto'
	})

	const fileName = basename(filePath)

	await s3.write(fileName, content)

	console.log(`Backup uploaded to S3: s3://${S3_BUCKET}/${fileName}`)
}

console.log(`Creating backup of ${DB_PATH}...`)

try {
	await $`sqlite3 ${DB_PATH} ".dump" > ${BACKUP_FILE}`
	console.log(`Backup created successfully: ${BACKUP_FILE}`)

	const dumpContent = await Bun.file(BACKUP_FILE).arrayBuffer()
	const compressed = Bun.gzipSync(dumpContent)
	const compressedPath = `${BACKUP_FILE}.gz`
	await Bun.write(compressedPath, compressed)
	console.log(`Backup compressed: ${compressedPath}`)

	await $`rm -f ${BACKUP_FILE}`

	const compressedFile = Bun.file(compressedPath)
	const compressedContent = await compressedFile.arrayBuffer()

	await uploadToS3(compressedPath, compressedContent)
} catch (error) {
	console.error('Error: Backup failed', error)
	process.exit(1)
}
