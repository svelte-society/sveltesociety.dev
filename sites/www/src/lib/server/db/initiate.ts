import { Database as DuckDB } from 'duckdb-async';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '$lib/server/db/seeds/utils';

const TRIGGERS_FOLDER = './src/lib/server/db/triggers';
const VIEWS_FOLDER = './src/lib/server/db/views';

export const db = new Database(config.DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export const event_db = await DuckDB.create(config.EVENT_DB_PATH);

const read_and_import_dir = (folder: string, db: Database.Database | DuckDB) => {
	fs.readdir(folder, (e, files) => {
		files.forEach((file) => {
			const filePath = path.join(folder, file);
			read_and_import_file(filePath, db);
		});
	});
};
const read_and_import_file = (filePath: string, db: Database.Database | DuckDB) => {
	fs.readFile(filePath, 'utf8', (err, content) => {
		if (err) {
			console.error('Error reading file %s\nError: %o', filePath, err);
			return;
		}

		db.exec(content);
	});
};

const initiate_db = async () => {
	console.log('Initiating database...');

	// Read schema.sql file, should probably split this up into multiple files eventually
	read_and_import_file('./src/lib/server/db/schema/schema.sql', db);

	// Read triggers and insert them into the database
	read_and_import_dir(TRIGGERS_FOLDER, db);
	// Read views and insert them into the database
	read_and_import_dir(VIEWS_FOLDER, db);
};

const initiate_events_db = async () => {
	console.log('Initiating events database...');
	read_and_import_file('./src/lib/server/event_db/schema/schema.sql', event_db);
};

initiate_db();
initiate_events_db();
