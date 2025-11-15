<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { toast } from 'svelte-sonner'
	import ContentForm from '../ContentForm.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Info from 'phosphor-svelte/lib/Info'

	let { data } = $props()

	let form = superForm(data.form, {
		invalidateAll: 'force',
		dataType: 'json',
		onUpdated: ({ form }) => {
			form?.message?.success ? toast.success(form.message.text) : toast.error(form.message.text)
		}
	})

	const { form: formData } = form

	const isImported = $derived(data.content?.metadata?.externalSource !== undefined)
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Content"
		description="Update content information and settings"
		icon={FileText}
	/>

	{#if isImported}
		<div class="rounded-xl border border-svelte-200 bg-gradient-to-br from-svelte-50 to-white p-6 shadow-sm">
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-svelte-100">
					<Info class="h-5 w-5 text-svelte-700" weight="duotone" />
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-gray-900">External Source Information</h3>
					<dl class="mt-3 grid gap-3 sm:grid-cols-2">
						<div class="rounded-lg bg-white p-3 shadow-sm">
							<dt class="text-xs font-medium text-gray-500">Source</dt>
							<dd class="mt-1 font-medium capitalize text-gray-900">{data.content?.metadata?.externalSource?.source}</dd>
						</div>
						<div class="rounded-lg bg-white p-3 shadow-sm">
							<dt class="text-xs font-medium text-gray-500">External ID</dt>
							<dd class="mt-1 font-mono text-sm text-gray-900">{data.content?.metadata?.externalSource?.externalId}</dd>
						</div>
						<div class="rounded-lg bg-white p-3 shadow-sm sm:col-span-2">
							<dt class="text-xs font-medium text-gray-500">URL</dt>
							<dd class="mt-1">
								<a
									href={data.content?.metadata?.externalSource?.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-svelte-600 underline hover:text-svelte-700"
								>
									{data.content?.metadata?.externalSource?.url}
								</a>
							</dd>
						</div>
						<div class="rounded-lg bg-white p-3 shadow-sm sm:col-span-2">
							<dt class="text-xs font-medium text-gray-500">Last Fetched</dt>
							<dd class="mt-1 text-sm text-gray-900">
								{new Date(data.content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-4xl">
		<ContentForm {form} {data} {isImported} isEditing />
	</div>
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
