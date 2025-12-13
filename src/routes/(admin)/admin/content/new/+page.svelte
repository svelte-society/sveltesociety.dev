<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Info from 'phosphor-svelte/lib/Info'
	import ContentForm from '../ContentForm.svelte'
	import { createContent, getTags, getAvailableChildren } from '../content.remote'

	const tagOptions = await getTags()
	const childrenOptions = await getAvailableChildren()
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Create New Content"
		description="Add a new recipe, announcement, or collection"
		icon={FileText}
	/>

	<div class="rounded-2xl border-2 border-svelte-200 bg-gradient-to-br from-svelte-50 via-white to-svelte-50/50 shadow-sm">
		<div class="border-b border-svelte-100 bg-gradient-to-r from-svelte-100/50 to-white px-6 py-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
					<Info class="h-5 w-5 text-white" weight="duotone" />
				</div>
				<h3 class="text-lg font-bold text-gray-900">Important Information</h3>
			</div>
		</div>
		<div class="p-6">
			<div class="flex items-start gap-4">
				<div class="flex-1">
					<h4 class="font-semibold text-gray-900">Looking to add a video or library?</h4>
					<p class="mt-2 text-sm leading-relaxed text-gray-700">
						Videos and libraries should be imported from their external sources. Use the
						<a href="/admin/external-content" class="font-semibold text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700">External Content</a>
						page to import from YouTube or GitHub, or use the
						<a href="/admin/bulk-import" class="font-semibold text-svelte-600 underline decoration-2 underline-offset-2 transition-colors hover:text-svelte-700">Bulk Import</a>
						feature for multiple items at once.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Content Details</p>
			</div>
		</div>

		<div class="p-8">
			<ContentForm
				mode="create"
				form={createContent}
				{tagOptions}
				{childrenOptions}
			/>
		</div>
	</div>
</div>
