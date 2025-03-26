## Form Implementation Pattern

When implementing forms, follow this pattern:

### Server-side (+page.server.ts):

```ts
import { superValidate, message } from 'sveltekit-superforms/server'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { schema } from './schema' // Import schema from separate file

export const load = (async ({ locals }) => {
	// Load any data needed for the form (e.g., options)
	const tags = locals.tagService.getTags({ limit: 50 })

	// Create the form using Superforms with the zod adapter
	const form = await superValidate(zod(schema))

	return { form, tags }
}) satisfies PageServerLoad

export const actions = {
	submit: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema))

		// Validate the form data
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			// Process form data (e.g., save to database)
			const userId = locals.user?.id || 'anonymous'

			// Example: adding to moderation queue
			const submissionData = {
				// Form data processing
				title: form.data.title,
				data: JSON.stringify(form.data),
				submitted_by: userId
			}

			// Process the data
			const result = locals.someService.processData(submissionData)

			// Return success message
			return {
				form,
				success: true,
				message: 'Your submission has been received.'
			}
		} catch (error) {
			console.error('Error processing form:', error)
			return message(form, {
				type: 'error',
				text: 'There was an error processing your submission. Please try again.'
			})
		}
	}
} satisfies Actions
```

### Client-side (+page.svelte):

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { schema, options } from './schema'

	let { data } = $props()

	const form = superForm(data.form, {
		resetForm: true,
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		validators: zodClient(schema)
	})

	const { form: formData, submitting } = form
</script>

<div class="mx-auto grid max-w-3xl gap-6">
	<h1 class="mb-6 text-2xl font-bold">Form Title</h1>

	<Form {form} action="?/submit">
		<Input
			name="fieldName"
			label="Field Label"
			description="Field description"
			placeholder="Enter value..."
		/>

		<Textarea
			name="textArea"
			label="Text Area"
			description="Enter longer text here"
			placeholder="Enter text..."
		/>

		<Select name="selectField" label="Select Option" description="Choose from dropdown" {options} />

		<Button type="submit" primary disabled={$submitting}>
			{$submitting ? 'Submitting...' : 'Submit'}
		</Button>
	</Form>
</div>
```

### Schema Definition (schema.ts):

```ts
import { z } from 'zod'

export const schema = z.object({
	fieldName: z.string().min(1, 'This field is required'),
	textArea: z.string().optional(),
	selectField: z.string().min(1, 'Please select an option')
	// Add other fields as needed
})

export const options = [
	{ value: 'option1', label: 'Option 1' },
	{ value: 'option2', label: 'Option 2' }
	// Add other options as needed
]
```
