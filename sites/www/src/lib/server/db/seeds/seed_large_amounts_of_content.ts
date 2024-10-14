import { faker } from '@faker-js/faker'

// Function to insert content into the database
function insertContent(db) {
	// Prepare SQL statements
	const getAllTagsStmt = db.prepare(`SELECT id, slug FROM tags`)
	const insertContentStmt = db.prepare(`
    INSERT INTO content (title, type, body, rendered_body, slug, description, children, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING id
  `)
	const insertContentTagStmt = db.prepare(`
    INSERT INTO content_to_tags (content_id, tag_id)
    VALUES (?, ?)
  `)

	// Fetch all tags
	const tagIds = getAllTagsStmt.all()
	const tagMap = new Map(tagIds.map((tag) => [tag.slug, tag.id]))

	const title = faker.lorem.sentence({ min: 6, max: 12 })
	const body = faker.lorem.paragraph({ min: 5, max: 10 })

	const slug = title
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
	const description = body.split('.')[0] // Use the first sentence as description
	const children = JSON.stringify([])
	const now = new Date().toISOString()

	const info = insertContentStmt.get(
		title,
		'recipe',
		body,
		body, // Using body as rendered_body for simplicity
		slug,
		description,
		children,
		'published',
		now,
		now
	)

	const contentId = info.id

	// Randomly assign 1-3 tags
	const tagKeys = Array.from(tagMap.keys())
	const numTags = Math.floor(Math.random() * 3) + 1
	for (let i = 0; i < numTags; i++) {
		const randomTag = tagKeys[Math.floor(Math.random() * tagKeys.length)]
		insertContentTagStmt.run(contentId, tagMap.get(randomTag))
	}

	return contentId
}

// Main function to seed content
export async function seedContent(db, count) {
	console.log(`Seeding ${count} content items...`)
	for (let i = 0; i < count; i++) {
		try {
			const contentId = insertContent(db)
			console.log(`Inserted content with ID: ${contentId}`)
		} catch (error) {
			console.error(`Error inserting content: ${error}`)
		}
	}
	console.log('Content seeding completed.')
}
