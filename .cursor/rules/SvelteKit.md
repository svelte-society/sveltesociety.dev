Always follow these templates when creating new routes unless specifically asked to implement a server endpoint:

```ts
//+page.server.ts // handles everything on the backend for this route.
import { fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

// Load data and pass it to the frontend
export const load: PageServerLoad = async ({ url, locals }) => {
	// Example of something that can be done in the load function
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	const roles = locals.roleService.getRoles()
	
	const count = roles.length

	return {
		roles,
		pagination: {
			count,
			perPage,
			currentPage: page
		}
	}
}

export const actions: Actions = {

	// Name of form action used on the front-end. Corresponds to the action in a form: `<form action="?/delete">`
	delete: async ({ request, locals }) => {
		// Examples of what can be done in a form action - here a user role is deleted.
		const data = await request.formData()
		const id = data.get('id') as unknown as number

		if (!id) {
			return fail(400, { message: 'No role id provided.' })
		}

		const deleted_role = locals.roleService.deleteRole(id)

		if (!deleted_role) {
			return { message: 'Something went wrong.' }
		}

		return { message: `Role deleted.` }
	}
}
```

Here is the corresponding frontend part of the route:

```html
<script lang="ts">
import Pagination from '$lib/ui/Pagination.svelte'

let { data } = $props() // Data is where data we returned in the load function comes from. `data.roles` or `data.pagination` in this case.
</script>

<div class="container mx-auto px-2 py-4">
	{#each data.roles as role}
		<p>{role.name}</p>
	{/each}
	
	{#if data.pagination}
		<Pagination 
			count={data.pagination.count} 
			perPage={data.pagination.perPage} 
		/>
	{/if}
</div>
```