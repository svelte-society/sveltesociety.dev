import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Hard-coded OAuth providers
  const authProviders = [
    { name: 'GitHub', icon: 'github', color: 'bg-slate-900 text-white' },
  ];

  return {
    authProviders
  };
}; 