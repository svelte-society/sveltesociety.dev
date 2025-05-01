import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  return {
    meta: {
      title: 'Privacy Policy - Svelte Society',
      description: 'Privacy Policy for the Svelte Society website and community resources',
      url: url.toString()
    }
  };
}; 