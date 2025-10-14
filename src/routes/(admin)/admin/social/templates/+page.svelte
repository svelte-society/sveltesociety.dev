<script lang="ts">
	import Table from '$lib/ui/admin/Table.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import { getTemplates, deleteTemplate } from './data.remote'

	const templates = $derived(await getTemplates())

	const contentTypeBadgeColor = (type: string) => {
		switch (type) {
			case 'recipe':
				return 'success'
			case 'video':
				return 'info'
			case 'library':
				return 'warning'
			case 'announcement':
				return 'danger'
			case 'collection':
				return 'primary'
			default:
				return 'default'
		}
	}

	const platformBadgeColor = (platform: string) => {
		switch (platform) {
			case 'bluesky':
				return 'info'
			case 'nostr':
				return 'warning'
			case 'linkedin':
				return 'success'
			default:
				return 'default'
		}
	}
</script>

<AdminList
	title="Social Media Templates"
	newHref="/admin/social/templates/new"
	newLabel="New Template"
>
	<div class="mb-4 rounded-md bg-blue-50 p-4">
		<h3 class="mb-2 text-sm font-medium text-blue-800">Template Variables</h3>
		<p class="mb-2 text-xs text-blue-700">
			You can use the following placeholders in your templates:
		</p>
		<ul class="grid grid-cols-2 gap-2 text-xs text-blue-600 md:grid-cols-3">
			<li><code class="rounded bg-blue-100 px-1">{'{{title}}'}</code> - Content title</li>
			<li><code class="rounded bg-blue-100 px-1">{'{{description}}'}</code> - Description</li>
			<li><code class="rounded bg-blue-100 px-1">{'{{slug}}'}</code> - URL slug</li>
			<li><code class="rounded bg-blue-100 px-1">{'{{url}}'}</code> - Full URL</li>
			<li><code class="rounded bg-blue-100 px-1">{'{{tags}}'}</code> - Comma-separated tags</li>
			<li>
				<code class="rounded bg-blue-100 px-1">{'{{author}}'}</code> - Author name (if available)
			</li>
		</ul>
	</div>

	<Table action={true} data={templates}>
		{#snippet header(classes)}
			<th scope="col" class={classes}>Content Type</th>
			<th scope="col" class={classes}>Platform</th>
			<th scope="col" class={classes}>Template Preview</th>
			<th scope="col" class={classes}>Default</th>
		{/snippet}
		{#snippet row(template, classes)}
			<td class={classes}>
				<Badge text={template.content_type} color={contentTypeBadgeColor(template.content_type)} />
			</td>
			<td class={classes}>
				<Badge text={template.platform} color={platformBadgeColor(template.platform)} />
			</td>
			<td class={classes}>
				<div class="max-w-md truncate font-mono text-sm text-gray-600">
					{template.template}
				</div>
			</td>
			<td class={classes}>
				{#if template.is_default}
					<Badge text="Default" color="success" />
				{:else}
					<span class="text-gray-400">-</span>
				{/if}
			</td>
		{/snippet}
		{#snippet actionCell(template)}
			<Button size="sm" variant="secondary" href="/admin/social/templates/{template.id}">
				Edit
			</Button>
			<form {...deleteTemplate.for(template.id)}>
				<Button
					size="sm"
					variant="error"
					name="id"
					value={template.id}
					type="submit"
					disabled={template.is_default}
				>
					Delete
				</Button>
			</form>
		{/snippet}
	</Table>
</AdminList>
