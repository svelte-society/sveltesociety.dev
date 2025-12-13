<script lang="ts">
	import { page } from '$app/state'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Info from 'phosphor-svelte/lib/Info'
	import { initForm } from '$lib/utils/form.svelte'
	import ContentForm from '../ContentForm.svelte'
	import {
		updateContent,
		getContentById,
		getTags,
		getUsers,
		getAvailableChildrenForEdit
	} from '../content.remote'

	const contentId = page.params.id!
	const content = await getContentById({ id: contentId })
	const tagOptions = await getTags()
	const users = await getUsers()
	const childrenOptions = await getAvailableChildrenForEdit({ id: contentId })

	initForm(updateContent, () => ({
		id: contentId,
		title: content?.title ?? '',
		slug: content?.slug ?? '',
		description: content?.description ?? '',
		status: content?.status ?? 'draft',
		tags: (content?.tags as unknown as { id: string }[] | undefined)?.map((tag) => tag.id) ?? [],
		author_id: content?.author_id ?? '',
		body: (content as unknown as { body?: string })?.body ?? '',
		children:
			content?.type === 'collection' &&
			(content as unknown as { children?: { id: string }[] })?.children
				? (content as unknown as { children: { id: string }[] }).children.map((child) => child.id)
				: [],
		metadata: content?.metadata ?? {}
	}))

	const isImported = $derived(content?.metadata?.externalSource !== undefined)
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
						<dd class="mt-2 text-lg font-bold capitalize text-gray-900">{content?.metadata?.externalSource?.source}</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">External ID</dt>
						<dd class="mt-2 font-mono text-sm font-medium text-gray-900">{content?.metadata?.externalSource?.externalId}</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:col-span-2">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">URL</dt>
						<dd class="mt-2">
							<a
								href={content?.metadata?.externalSource?.url}
								target="_blank"
								rel="noopener noreferrer"
								class="break-all text-sm font-medium text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700"
							>
								{content?.metadata?.externalSource?.url}
							</a>
						</dd>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:col-span-2">
						<dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Last Fetched</dt>
						<dd class="mt-2 text-sm font-medium text-gray-900">
							{new Date(content?.metadata?.externalSource?.lastFetched || '').toLocaleString()}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	{/if}

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Content Details</p>
			</div>
		</div>

		<div class="p-8">
			<ContentForm
				mode="edit"
				form={updateContent}
				{contentId}
				{content}
				{users}
				{tagOptions}
				{childrenOptions}
			/>
		</div>
	</div>
</div>
