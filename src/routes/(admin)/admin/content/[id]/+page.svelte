<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { toast } from 'svelte-sonner'
	import ContentForm from '../ContentForm.svelte'

	// Get data passed from server
	let { data } = $props()

	// Setup form with client-side validation
	let form = superForm(data.form, {
		invalidateAll: 'force',
		dataType: 'json',
		onUpdated: ({ form }) => {
			form?.message?.success ? toast.success(form.message.text) : toast.error(form.message.text)
		}
	})

	const { form: formData, submitting } = form

	const isImported = $derived(data.content?.metadata?.externalSource !== undefined)
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Content</h1>

	{#if isImported}
		<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
			<h2 class="mb-2 text-sm font-semibold text-blue-800">External Source Information</h2>
			<dl class="space-y-1 text-sm text-blue-700">
				<div class="flex gap-2">
					<dt class="font-medium">Source:</dt>
					<dd class="capitalize">{data.content?.metadata?.externalSource?.source}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">External ID:</dt>
					<dd>{data.content?.metadata?.externalSource?.externalId}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">URL:</dt>
					<dd>
						<a
							href={data.content?.metadata?.externalSource?.url}
							target="_blank"
							rel="noopener noreferrer"
							class="underline"
						>
							{data.content?.metadata?.externalSource?.url}
						</a>
					</dd>
				</div>
				<div class="flex gap-2">
					<dt class="font-medium">Last Fetched:</dt>
					<dd>
						{new Date(data.content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}
					</dd>
				</div>
			</dl>
		</div>
	{/if}

	<ContentForm {form} {data} {isImported} isEditing />
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
