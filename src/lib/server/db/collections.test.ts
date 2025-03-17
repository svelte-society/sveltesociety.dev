import { describe, expect, test, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { CollectionService } from './collections'

describe('CollectionService', () => {
    let db: Database
    let collectionService: CollectionService

    beforeAll(async () => {
        // Create in-memory database for testing
        db = new Database(':memory:', { strict: true })
        db.exec('PRAGMA foreign_keys = ON')

        // Create tables from schema
        const schema = Bun.file('src/lib/server/db/schema/schema.sql')
        const schemaContent = await schema.text()
        db.exec(schemaContent)

        // Create views
        const views = Bun.file('src/lib/server/db/views/collections.sql')
        const viewsContent = await views.text()
        db.exec(viewsContent)

        collectionService = new CollectionService(db)
    })

    beforeEach(() => {
        // Clear content table before each test
        db.prepare('DELETE FROM content').run()

        // Insert test collections
        const insertCollection = db.prepare(`
            INSERT INTO content (id, title, type, description, children, slug, status)
            VALUES (?, ?, 'collection', ?, ?, ?, 'published')
        `)

        // Insert test data
        insertCollection.run('1', 'Test Collection 1', 'Description 1', '[]', 'test-1')
        insertCollection.run('2', 'Test Collection 2', 'Description 2', '[]', 'test-2')
        insertCollection.run('3', 'Test Collection 3', 'Description 3', '[]', 'test-3')
        insertCollection.run('4', 'Test Collection 4', 'Description 4', '[]', 'test-4')
        insertCollection.run('5', 'Test Collection 5', 'Description 5', '[]', 'test-5')
    })

    test('getCollections returns paginated collections', () => {
        const collections = collectionService.getCollections(1, 2)
        expect(collections.length).toBe(2)
        expect(collections[0].title).toBe('Test Collection 1')
        expect(collections[1].title).toBe('Test Collection 2')
    })

    test('getCollections respects offset', () => {
        const collections = collectionService.getCollections(2, 2)
        expect(collections.length).toBe(2)
        expect(collections[0].title).toBe('Test Collection 3')
        expect(collections[1].title).toBe('Test Collection 4')
    })

    test('getCollections returns remaining items when limit exceeds available items', () => {
        const collections = collectionService.getCollections(2, 3)
        expect(collections.length).toBe(2)
        expect(collections[0].title).toBe('Test Collection 4')
        expect(collections[1].title).toBe('Test Collection 5')
    })

    test('getCollections returns empty array when offset exceeds total items', () => {
        const collections = collectionService.getCollections(10, 2)
        expect(collections.length).toBe(0)
    })

    test('getCollectionsCount returns total number of collections', () => {
        const count = collectionService.getCollectionsCount()
        expect(count).toBe(5)
    })

    test('getCollectionsCount returns 0 when no collections exist', () => {
        db.prepare('DELETE FROM content').run()
        const count = collectionService.getCollectionsCount()
        expect(count).toBe(0)
    })
}) 