import { Database } from 'bun:sqlite'

export function seedModerationQueue(db: Database) {
	// Get the first user's ID (assuming we have at least one user)
	const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: string }

	// Get tag IDs to use in the moderation queue data
	const tags = db.prepare('SELECT id, slug FROM tags').all() as Array<{ id: string; slug: string }>
	const getTagId = (slug: string) => tags.find((tag) => tag.slug === slug)?.id || ''

	const insertModerationItemStmt = db.prepare(`
        INSERT INTO moderation_queue (type, status, data, submitted_by, submitted_at)
        VALUES (?, ?, ?, ?, ?)
    `)

	const moderationItems = [
		{
			type: 'recipe',
			status: 'pending',
			data: JSON.stringify({
				title: 'Svelte 5 Runes Tutorial',
				description:
					'A comprehensive guide to understanding and using Svelte 5 runes for state management',
				body: `# Svelte 5 Runes Tutorial

## Introduction
Svelte 5 introduces a new reactivity system called "runes" that provides more explicit control over state and reactivity.

## Basic Usage
\`\`\`javascript
let count = $state(0)
let doubled = $derived(count * 2)

$effect(() => {
  console.log('Count changed:', count)
})
\`\`\`

## Advanced Patterns
- Using $state for reactive variables
- $derived for computed values  
- $effect for side effects

This tutorial will walk you through each concept with practical examples.`,
				type: 'recipe',
				tags: [getTagId('svelte-5'), getTagId('tutorial')].filter(Boolean),
				notes: 'This is a comprehensive tutorial covering all the basics'
			}),
			submitted_by: user.id
		},
		{
			type: 'video',
			status: 'pending',
			data: JSON.stringify({
				title: 'Building a SvelteKit App from Scratch',
				description: 'Complete walkthrough of building a modern web app with SvelteKit',
				url: 'https://www.youtube.com/watch?v=MnpuK0Sl_88',
				type: 'video',
				tags: [getTagId('sveltekit'), getTagId('tutorial')].filter(Boolean),
				notes: 'Great introduction video for beginners'
			}),
			submitted_by: user.id
		},
		{
			type: 'library',
			status: 'pending',
			data: JSON.stringify({
				title: 'Shadcn Svelte Components',
				description:
					'Beautiful and accessible component library for Svelte built on top of Tailwind CSS',
				github_repo: 'huntabyte/shadcn-svelte',
				type: 'library',
				tags: [getTagId('utility')].filter(Boolean),
				notes: 'High-quality component library with great documentation'
			}),
			submitted_by: user.id
		},
		{
			type: 'link',
			status: 'pending',
			data: JSON.stringify({
				title: 'Svelte Society Official Website',
				description: 'The central hub for the Svelte community with resources, events, and more',
				url: 'https://sveltesociety.dev',
				type: 'link',
				tags: [getTagId('official')].filter(Boolean),
				notes: 'Main community website with lots of useful resources'
			}),
			submitted_by: user.id
		},
		{
			type: 'recipe',
			status: 'pending',
			data: JSON.stringify({
				title: 'Building Reactive Components with Svelte 5',
				description:
					'Learn how to create highly reactive and performant components using the new Svelte 5 features',
				body: `# Building Reactive Components with Svelte 5

## Overview
This recipe shows you how to leverage Svelte 5's new reactivity system to build components that automatically update when data changes.

## Step 1: Setup State
\`\`\`javascript
let items = $state([])
let filter = $state('')
\`\`\`

## Step 2: Derived Values
\`\`\`javascript
let filteredItems = $derived(
  items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  )
)
\`\`\`

## Step 3: Effects
\`\`\`javascript
$effect(() => {
  console.log('Filtered items changed:', filteredItems.length)
})
\`\`\`

This pattern allows for clean, declarative components that respond to state changes automatically.`,
				type: 'recipe',
				tags: [getTagId('svelte-5'), getTagId('state')].filter(Boolean),
				notes: 'A practical guide with working examples'
			}),
			submitted_by: user.id
		}
	]

	const insertModerationItemsTransaction = db.transaction((items: typeof moderationItems) => {
		for (const item of items) {
			const now = new Date().toISOString()
			insertModerationItemStmt.run(item.type, item.status, item.data, item.submitted_by, now)
		}
	})

	try {
		insertModerationItemsTransaction(moderationItems)
		console.log('Moderation queue items inserted successfully')
	} catch (error) {
		console.error('Error inserting moderation queue items:', error)
	}
}
