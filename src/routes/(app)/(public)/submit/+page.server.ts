import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';

// Define the submission schema with Zod
const contentSchema = z.object({
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
	content_type: z.enum(['article', 'component', 'recipe', 'tutorial', 'snippet', 'other'], {
		required_error: 'Please select a content type'
	}),
	tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
	url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
	github_repo: z.string().optional().or(z.literal('')),
	author_name: z.string().min(2, { message: 'Author name must be at least 2 characters long' }),
	author_email: z.string().email({ message: 'Please enter a valid email address' }),
	notes: z.string().optional().or(z.literal(''))
});

export const load = (async ({ locals }) => {
	// Get all available tags for the form
	const tags = locals.tagService.getTags({ limit: 50 });
	
	// Create the form using Superforms with the zod adapter
	const form = await superValidate(zod(contentSchema));
	
	return { form, tags };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(contentSchema));
		
		// Validate the form data
		if (!form.valid) {
			return fail(400, { form });
		}
		
		try {
			// Add submission to moderation queue
			const userId = locals.user?.id || 'anonymous';
			
			// Prepare submission data
			const submissionData = {
				type: 'content', 
				title: form.data.title,
				data: JSON.stringify(form.data),
				submitted_by: userId
			};
			
			// Add to moderation queue
			const submissionId = locals.moderationService.addToModerationQueue(submissionData);
			
			// Return success message
			return {
				form,
				success: true,
				message: 'Your submission has been received and is pending moderation.'
			};
		} catch (error) {
			console.error('Error adding content to moderation queue:', error);
			return message(form, {
				type: 'error',
				text: 'There was an error processing your submission. Please try again.'
			});
		}
	}
} satisfies Actions;
