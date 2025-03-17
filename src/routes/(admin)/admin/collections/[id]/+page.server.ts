import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

const schema = z.object({
	id: z.number(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	children: z.array(z.number()).min(1, 'Children are required'),
	slug: z.string().min(1, 'Slug is required')
})

// Define an interface for the collection from the database
interface CollectionFromDB {
	id: string;
	title: string;
	slug: string; 
	description: string;
	content: string;
	type: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	// Directly query the database for the collection
	const collectionStmt = locals.db.prepare(`
		SELECT * FROM content
		WHERE id = ? AND type = 'collection'
	`);
	const collection = collectionStmt.get(params.id) as CollectionFromDB | undefined;

	if (!collection) {
		throw error(404, 'Collection not found')
	}

	// Parse content field which contains the collection children
	let children: number[] = [];
	try {
		if (collection.content) {
			const contentObj = JSON.parse(collection.content);
			children = contentObj.children || [];
		}
	} catch (e) {
		children = [];
	}

	// Create a form data object with the correct types
	const formData = {
		id: Number(collection.id),
		title: collection.title,
		description: collection.description,
		slug: collection.slug,
		children: children
	};

	const form = await superValidate(formData, zod(schema))
	
	// Get all content for the selector
	const allContent = locals.contentService.getFilteredContent({})
	
	return {
		form,
		content: allContent
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema))
		if (!form.valid) {
			return fail(400, { form })
		}

		// Update the collection using locals.db since ContentService doesn't have an update method yet
		const updateStmt = locals.db.prepare(`
			UPDATE content
			SET title = ?, 
			    description = ?, 
			    slug = ?,
			    content = ?
			WHERE id = ?
			RETURNING id
		`);
		
		const collectionContent = JSON.stringify({ children: form.data.children });
		const result = updateStmt.get(
			form.data.title,
			form.data.description,
			form.data.slug,
			collectionContent,
			form.data.id
		) as { id: string } | undefined;

		if (result) {
			throw redirect(303, '/admin/collections')
		} else {
			throw error(500, 'Failed to update collection')
		}
	}
}
