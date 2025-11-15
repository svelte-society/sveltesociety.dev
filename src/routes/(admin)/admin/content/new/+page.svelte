<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { createContentSchema } from '$lib/schema/content'
	import { toast } from 'svelte-sonner'
	import ContentForm from '../ContentForm.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Info from 'phosphor-svelte/lib/Info'

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

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Create New Content"
		description="Add a new recipe, announcement, or collection"
		icon={FileText}
	/>

	<div class="rounded-xl border border-svelte-200 bg-gradient-to-br from-svelte-50 to-white p-6 shadow-sm">
		<div class="flex items-start gap-4">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-svelte-100">
				<Info class="h-5 w-5 text-svelte-700" weight="duotone" />
			</div>
			<div>
				<h3 class="font-semibold text-gray-900">Looking to add a video or library?</h3>
				<p class="mt-1 text-sm text-gray-700">
					Videos and libraries should be imported from their external sources. Use the
					<a href="/admin/external-content" class="font-medium text-svelte-600 underline hover:text-svelte-700"
						>External Content</a
					>
					page to import from YouTube or GitHub, or use the
					<a href="/admin/bulk-import" class="font-medium text-svelte-600 underline hover:text-svelte-700">Bulk Import</a>
					feature for multiple items at once.
				</p>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-4xl">
		<ContentForm {form} {data} />
	</div>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
