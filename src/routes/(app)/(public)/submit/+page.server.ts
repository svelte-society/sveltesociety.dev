import { redirect } from '@sveltejs/kit'

export const load = (async ({ locals, url }) => {
  if (!locals.user) {
    throw redirect(302, '/login?redirectTo=' + encodeURIComponent(url.pathname))
  }

  if (url.pathname.endsWith("/submit") || url.pathname.endsWith("/submit/")) {
    redirect(302, '/submit/recipe')
  }

})
