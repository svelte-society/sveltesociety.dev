import { Database } from 'bun:sqlite'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

// Import S3 functions - note: using process.env since this is a script
const {
	STATE_DIRECTORY = '.state_directory',
	DB_PATH = 'local.db',
	S3_THUMBNAILS_ENDPOINT,
	S3_THUMBNAILS_BUCKET,
	S3_THUMBNAILS_ACCESS_KEY,
	S3_THUMBNAILS_SECRET_KEY,
	S3_THUMBNAILS_PUBLIC_URL
} = process.env

// Check if S3 is configured
const isS3Configured =
	S3_THUMBNAILS_BUCKET &&
	S3_THUMBNAILS_ACCESS_KEY &&
	S3_THUMBNAILS_SECRET_KEY &&
	S3_THUMBNAILS_PUBLIC_URL

if (!isS3Configured) {
	console.error('Error: S3 storage is not configured')
	console.error(
		'Required: S3_THUMBNAILS_BUCKET, S3_THUMBNAILS_ACCESS_KEY, S3_THUMBNAILS_SECRET_KEY, S3_THUMBNAILS_PUBLIC_URL'
	)
	process.exit(1)
}

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const skipExisting = args.includes('--skip-existing')

if (isDryRun) {
	console.log('🔍 DRY RUN MODE - No changes will be made\n')
}

// S3 Client setup
const s3 = new Bun.S3Client({
	accessKeyId: S3_THUMBNAILS_ACCESS_KEY!,
	secretAccessKey: S3_THUMBNAILS_SECRET_KEY!,
	bucket: S3_THUMBNAILS_BUCKET!,
	endpoint: S3_THUMBNAILS_ENDPOINT,
	region: 'auto'
})

function getPublicUrl(key: string): string {
	const cleanKey = key.startsWith('/') ? key.slice(1) : key
	const baseUrl = S3_THUMBNAILS_PUBLIC_URL!.endsWith('/')
		? S3_THUMBNAILS_PUBLIC_URL!.slice(0, -1)
		: S3_THUMBNAILS_PUBLIC_URL!
	return `${baseUrl}/${cleanKey}`
}

interface FileToMigrate {
	localPath: string
	s3Key: string
	s3Url: string
	oldDbPath: string
	type: 'yt' | 'gh' | 'og'
}

/**
 * Recursively scan directory for thumbnail files
 */
function scanDirectory(
	dirPath: string,
	baseDir: string,
	type: 'yt' | 'gh' | 'og'
): FileToMigrate[] {
	const files: FileToMigrate[] = []

	if (!existsSync(dirPath)) {
		return files
	}

	const items = readdirSync(dirPath)

	for (const item of items) {
		const itemPath = join(dirPath, item)
		const stats = statSync(itemPath)

		if (stats.isDirectory()) {
			// Recurse into subdirectories
			files.push(...scanDirectory(itemPath, baseDir, type))
		} else if (stats.isFile() && item.startsWith('thumbnail.')) {
			// Found a thumbnail file
			const relativePath = itemPath.replace(baseDir, '').replace(/^\//, '')
			const s3Key = relativePath
			const s3Url = getPublicUrl(s3Key)
			const oldDbPath = `/files/${relativePath}`

			files.push({
				localPath: itemPath,
				s3Key,
				s3Url,
				oldDbPath,
				type
			})
		}
	}

	return files
}

/**
 * Check if file already exists in S3
 */
async function existsInS3(key: string): Promise<boolean> {
	try {
		const file = s3.file(key)
		return await file.exists()
	} catch (error) {
		return false
	}
}

/**
 * Upload file to S3
 */
async function uploadToS3(file: FileToMigrate): Promise<boolean> {
	try {
		const content = readFileSync(file.localPath)
		const ext = extname(file.localPath).toLowerCase()

		// Determine content type
		const contentTypeMap: Record<string, string> = {
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.webp': 'image/webp',
			'.avif': 'image/avif'
		}

		const contentType = contentTypeMap[ext] || 'image/jpeg'

		await s3.write(file.s3Key, content, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000'
			}
		})

		return true
	} catch (error) {
		console.error(`  ❌ Failed to upload: ${error}`)
		return false
	}
}

/**
 * Update database records with new S3 URLs
 */
function updateDatabase(
	files: FileToMigrate[],
	db: Database
): { updated: number; skipped: number } {
	let updated = 0
	let skipped = 0

	for (const file of files) {
		try {
			// Find content with this thumbnail path
			const rows = db
				.query(`SELECT id, metadata FROM content WHERE json_extract(metadata, '$.thumbnail') = ?`)
				.all(file.oldDbPath) as Array<{ id: string; metadata: string }>

			if (rows.length === 0) {
				skipped++
				continue
			}

			for (const row of rows) {
				if (isDryRun) {
					console.log(`  Would update content ${row.id}: ${file.oldDbPath} → ${file.s3Url}`)
					updated++
				} else {
					const metadata = JSON.parse(row.metadata)
					metadata.thumbnail = file.s3Url

					db.query(`UPDATE content SET metadata = ? WHERE id = ?`).run(
						JSON.stringify(metadata),
						row.id
					)

					updated++
				}
			}
		} catch (error) {
			console.error(`  ❌ Failed to update database for ${file.oldDbPath}: ${error}`)
		}
	}

	return { updated, skipped }
}

/**
 * Main migration logic
 */
async function migrate() {
	console.log('🚀 Starting thumbnail migration to S3...\n')

	const filesDir = join(STATE_DIRECTORY, 'files')

	if (!existsSync(filesDir)) {
		console.log('📁 No files directory found. Nothing to migrate.')
		return
	}

	// Scan for all thumbnail files
	console.log('📂 Scanning for thumbnails...')
	const ytFiles = scanDirectory(join(filesDir, 'yt'), filesDir, 'yt')
	const ghFiles = scanDirectory(join(filesDir, 'gh'), filesDir, 'gh')
	const ogFiles = scanDirectory(join(filesDir, 'og'), filesDir, 'og')

	const allFiles = [...ytFiles, ...ghFiles, ...ogFiles]

	console.log(`Found ${allFiles.length} thumbnail files:`)
	console.log(`  - YouTube: ${ytFiles.length}`)
	console.log(`  - GitHub: ${ghFiles.length}`)
	console.log(`  - OG Images: ${ogFiles.length}\n`)

	if (allFiles.length === 0) {
		console.log('✅ No thumbnails to migrate.')
		return
	}

	// Upload files to S3
	console.log('☁️  Uploading to S3...')
	let uploadSuccess = 0
	let uploadSkipped = 0
	let uploadFailed = 0

	for (const file of allFiles) {
		// Check if already exists in S3
		if (skipExisting) {
			const exists = await existsInS3(file.s3Key)
			if (exists) {
				console.log(`  ⏭️  Skipping (already exists): ${file.s3Key}`)
				uploadSkipped++
				continue
			}
		}

		if (isDryRun) {
			console.log(`  Would upload: ${file.s3Key}`)
			uploadSuccess++
		} else {
			process.stdout.write(`  Uploading: ${file.s3Key}...`)
			const success = await uploadToS3(file)
			if (success) {
				console.log(' ✅')
				uploadSuccess++
			} else {
				console.log(' ❌')
				uploadFailed++
			}
		}
	}

	console.log(`\nUpload Summary:`)
	console.log(`  ✅ Success: ${uploadSuccess}`)
	if (uploadSkipped > 0) console.log(`  ⏭️  Skipped: ${uploadSkipped}`)
	if (uploadFailed > 0) console.log(`  ❌ Failed: ${uploadFailed}`)

	// Update database
	console.log('\n💾 Updating database...')
	const db = new Database(DB_PATH)
	const { updated, skipped } = updateDatabase(allFiles, db)
	db.close()

	console.log(`\nDatabase Update Summary:`)
	console.log(`  ✅ Updated: ${updated}`)
	if (skipped > 0) console.log(`  ⏭️  Skipped (no DB entry): ${skipped}`)

	// Summary
	console.log('\n' + '='.repeat(50))
	console.log('✨ Migration Complete!')
	console.log('='.repeat(50))
	console.log(`Total files processed: ${allFiles.length}`)
	console.log(`S3 uploads: ${uploadSuccess} success, ${uploadFailed} failed`)
	console.log(`Database records updated: ${updated}`)

	if (isDryRun) {
		console.log('\n⚠️  This was a DRY RUN - no changes were made')
		console.log('Run without --dry-run to perform the migration')
	}
}

// Run migration
migrate().catch((error) => {
	console.error('\n❌ Migration failed:', error)
	process.exit(1)
})
