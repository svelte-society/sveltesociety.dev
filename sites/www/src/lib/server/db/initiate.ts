import { db } from './index'
import fs from 'fs'
import path from 'path'

const TRIGGERS_FOLDER = './src/lib/server/db/triggers'
const VIEWS_FOLDER = './src/lib/server/db/views'

export const initiate_db = async () => {
    console.log('Initiating database...')

    // Read schema.sql file, should probably split this up into multiple files eventually
    const schema = fs.readFileSync('./src/lib/server/db/schema/schema.sql', 'utf8')
    db.exec(schema)

    // Read triggers and insert them into the database
    const triggers = fs.readdir(TRIGGERS_FOLDER, (e, files) => {
        files.forEach(file => {
            console.log(file)
            const filePath = path.join(TRIGGERS_FOLDER, file);
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                db.exec(content)
            });
        });
    })

    // Read views and insert them into the database
    const views = fs.readdir(VIEWS_FOLDER, (e, files) => {
        files.forEach(file => {
            console.log(file)
            const filePath = path.join(VIEWS_FOLDER, file);
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                db.exec(content)
            });
        });
    })
}

initiate_db()