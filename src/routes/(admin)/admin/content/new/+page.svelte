<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { createContentSchema } from '$lib/schema/content'
	import { toast } from 'svelte-sonner'
	import ContentForm from '../ContentForm.svelte'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	const form = superForm(data.form, {
		validators: zodClient(createContentSchema),
		dataType: 'json',
		invalidateAll: 'force',
		onUpdated: ({ form }) => {
			if (form?.message) {
				form.message.success ? toast.success(form.message.text) : toast.error(form.message.text)
			}
		}
	})

	const { form: formData, submitting } = form
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Content</h1>

	<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
		<h2 class="mb-2 font-semibold text-blue-900">Looking to add a video or library?</h2>
		<p class="text-sm text-blue-800">
			Videos and libraries should be imported from their external sources. Use the
			<a href="/admin/external-content" class="font-medium underline hover:text-blue-700"
				>External Content</a
			>
			page to import from YouTube or GitHub, or use the
			<a href="/admin/bulk-import" class="font-medium underline hover:text-blue-700">Bulk Import</a>
			feature for multiple items at once.
		</p>
	</div>

	<ContentForm {form} {data} isImported={false} />
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
