import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    meta: {
      title: 'Terms of Service - Svelte Society',
      description: 'Terms of Service for the Svelte Society website and community resources'
    }
  };
}; 