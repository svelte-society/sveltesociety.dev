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
		<div class="rounded-2xl border-2 border-svelte-200 bg-gradient-to-br from-svelte-50 via-white to-svelte-50/50 shadow-sm">
			<div class="border-b border-svelte-100 bg-gradient-to-r from-svelte-100/50 to-white px-6 py-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
						<Info class="h-5 w-5 text-white" weight="duotone" />
					</div>
					<h3 class="text-lg font-bold text-gray-900">External Source Information</h3>
				</div>
			</div>
			<div class="p-6">
				<dl class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Source</dt>
						<dd class="mt-2 text-lg font-bold capitalize text-gray-900">{data.content?.metadata?.externalSource?.source}</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">External ID</dt>
						<dd class="mt-2 font-mono text-sm font-medium text-gray-900">{data.content?.metadata?.externalSource?.externalId}</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:col-span-2">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">URL</dt>
						<dd class="mt-2">
							<a
								href={data.content?.metadata?.externalSource?.url}
								target="_blank"
								rel="noopener noreferrer"
								class="break-all text-sm font-medium text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700"
							>
								{data.content?.metadata?.externalSource?.url}
							</a>
						</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:col-span-2">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Last Fetched</dt>
						<dd class="mt-2 text-sm font-medium text-gray-900">
							{new Date(data.content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	{/if}

	<ContentForm {form} {data} {isImported} isEditing />
</div>

<!-- Debug only in development -->
{#if import.meta.env?.DEV}
	<SuperDebug data={$formData} />
{/if}
