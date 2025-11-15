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

	<div class="rounded-2xl border-2 border-svelte-200 bg-gradient-to-br from-svelte-50 via-white to-svelte-50/50 p-6 shadow-sm">
		<div class="flex items-start gap-4">
			<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-lg">
				<Info class="h-6 w-6 text-white" weight="duotone" />
			</div>
			<div class="flex-1">
				<h3 class="text-lg font-bold text-gray-900">Looking to add a video or library?</h3>
				<p class="mt-2 text-sm leading-relaxed text-gray-700">
					Videos and libraries should be imported from their external sources. Use the
					<a href="/admin/external-content" class="font-semibold text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700"
						>External Content</a
					>
					page to import from YouTube or GitHub, or use the
					<a href="/admin/bulk-import" class="font-semibold text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700">Bulk Import</a>
					feature for multiple items at once.
				</p>
			</div>
		</div>
	</div>

	<ContentForm {form} {data} />
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
