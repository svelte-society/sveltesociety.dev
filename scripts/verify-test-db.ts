import { Database } from 'bun:sqlite'

const db = new Database('test.db')
const tables = db.prepare('SELECT name FROM sqlite_master WHERE type="table" ORDER BY name').all()
console.log('Tables in test.db:')
tables.forEach((t: any) => console.log(`  - ${t.name}`))

// Check a few key tables exist
const expectedTables = ['users', 'roles', 'content', 'sessions', 'migrations', 'tags', 'content_to_tags']
const tableNames = tables.map((t: any) => t.name)
console.log('\nVerifying key tables:')
expectedTables.forEach(table => {
  const exists = tableNames.includes(table)
  console.log(`  ${exists ? '✓' : '✗'} ${table}`)
})

// Check migrations table
const migrations = db.prepare('SELECT version, name FROM migrations ORDER BY version').all()
console.log('\nApplied migrations:')
migrations.forEach((m: any) => console.log(`  ${m.version}: ${m.name}`))

db.close()
