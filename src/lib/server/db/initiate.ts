import { Database } from 'bun:sqlite'
import fs from 'fs'
import path from 'path'
import { config } from './seeds/utils'

const TRIGGERS_FOLDER = './src/lib/server/db/triggers'
const VIEWS_FOLDER = './src/lib/server/db/views'

// Create database directory if it doesn't exist
const dbDir = path.dirname(config.DB_PATH)
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true })
}

export const db = new Database(config.DB_PATH)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')


const read_and_import_dir = (folder: string, db: Database) => {
	try {
		const files = fs.readdirSync(folder)
		files.forEach((file) => {
			const filePath = path.join(folder, file)
			read_and_import_file(filePath, db)
		})
	} catch (error) {
		console.error(`Error reading directory ${folder}:`, error)
	}
}

const read_and_import_file = (filePath: string, db: Database) => {
	try {
		const content = fs.readFileSync(filePath, 'utf8')
		try {
			db.exec(content)
			console.log(`Successfully executed SQL from ${filePath}`)
		} catch (sqlError) {
			console.error(`Error executing SQL from ${filePath}:`, sqlError)
		}
	} catch (fileError) {
		console.error(`Error reading file ${filePath}:`, fileError)
	}
}

const initiate_db = async () => {
	console.log('Initiating database...')

	// Read schema.sql file, should probably split this up into multiple files eventually
	read_and_import_file('./src/lib/server/db/schema/schema.sql', db)

	// Read triggers and insert them into the database
	read_and_import_dir(TRIGGERS_FOLDER, db)
	// Read views and insert them into the database
	read_and_import_dir(VIEWS_FOLDER, db)

	console.log('Database initialization completed.')
}

initiate_db()
