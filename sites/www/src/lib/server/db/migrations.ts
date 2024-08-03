import { db } from './index'
import fs from 'fs'

export const run_migrations = async () => {
  console.log('Running migrations...')
  const schema = fs.readFileSync('./src/lib/server/db/schema.sql', 'utf8')
  console.log('Schema:', schema)
  db.exec(schema)
}

run_migrations()