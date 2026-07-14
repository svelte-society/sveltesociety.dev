<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Star from 'phosphor-svelte/lib/Star'
	import { getTemplates, deleteTemplate } from '../data.remote'
	import type { SocialTemplate } from '$lib/types/social'

	const templates = $derived(await getTemplates())

	const contentTypeLabels: Record<string, string> = {
		video: 'Video',
		library: 'Library',
		recipe: 'Recipe',
		resource: 'Resource',
		job: 'Job',
		sponsor: 'Sponsor',
		custom: 'Custom'
	}

	const contentTypeColors: Record<string, string> = {
		video: 'danger',
		library: 'purple',
		recipe: 'success',
		resource: 'amber',
		job: 'default',
		sponsor: 'purple',
		custom: 'default'
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Post Templates"
		description="Manage templates for social media posts"
		icon={FileText}
	>
		{#snippet actions()}
			<a
				href="/admin/social"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
			>
				Back to Posts
			</a>
			<a
				href="/admin/social/templates/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90"
				data-testid="new-template-button"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Template
			</a>
		{/snippet}
	</PageHeader>

	{#if templates && templates.length > 0}
		<Table action={true} data={templates} testId="templates-table" emptyMessage="No templates configured">
			{#snippet header(classes)}
				<th class={classes}>Name</th>
				<th class={[classes, 'text-center']}>Content Type</th>
				<th class={[classes, 'text-center']}>Default</th>
				<th class={classes}>Created</th>
			{/snippet}
			{#snippet row(template: SocialTemplate, classes: string)}
				<td class="{classes} font-medium">
					<a
						href={`/admin/social/templates/${template.id}`}
						class="hover:text-svelte-500"
						data-testid="template-edit-link"
					>
						{template.name}
					</a>
					{#if template.description}
						<p class="text-xs text-gray-500 mt-0.5">{template.description}</p>
					{/if}
				</td>
				<td class={[classes, 'text-center']}>
					<Badge
						color={contentTypeColors[template.content_type] || 'default'}
						text={contentTypeLabels[template.content_type] || template.content_type}
					/>
				</td>
				<td class={[classes, 'text-center']}>
					{#if template.is_default}
						<span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
							<Star class="h-3 w-3" weight="fill" />
							Default
						</span>
					{:else}
						<span class="text-gray-400">-</span>
					{/if}
				</td>
				<td class={classes}>
					{formatRelativeDate(template.created_at)}
				</td>
			{/snippet}
			{#snippet actionCell(template: SocialTemplate)}
				<Actions id={template.id}>
					<Action.Edit href={`/admin/social/templates/${template.id}`} />
					<Action.Delete form={deleteTemplate} confirm={`Delete template "${template.name}"?`} />
				</Actions>
			{/snippet}
		</Table>
	{:else}
		<div class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
			<FileText class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-4 text-lg font-medium text-gray-900">No templates yet</h3>
			<p class="mt-2 text-sm text-gray-500">
				Create templates to standardize your social media posts across different content types.
			</p>
			<a
				href="/admin/social/templates/new"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-svelte-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-svelte-600"
			>
				<Plus class="h-4 w-4" weight="bold" />
				Create First Template
			</a>
		</div>
	{/if}
</div>
