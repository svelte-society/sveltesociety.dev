import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { contentSchema } from '$lib/schema/content';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
  // Create a new form with default values
  const form = await superValidate(zod(contentSchema));
  
  // Get all tags for the tag selector
  const tags = await locals.tagService.getTags();
  
  return {
    form,
    tags
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // Get form data and validate
    const form = await superValidate(request, zod(contentSchema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    try {
      // Create new content using service
      const contentId = await locals.contentService.addContent(form.data);
      
      // Redirect to content listing after successful save
      throw redirect(303, '/admin/content');
    } catch (error) {
      if (error instanceof Response) throw error;
      
      console.error('Error creating content:', error);
      return fail(500, {
        form,
        error: 'Failed to create content. Please try again.'
      });
    }
  }
}; 