<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import { toast } from 'svelte-sonner'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { ADMIN_ROUTES } from '$lib/admin'
	import Tag from 'phosphor-svelte/lib/Tag'
	import Plus from 'phosphor-svelte/lib/Plus'
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple'
	import Trash from 'phosphor-svelte/lib/Trash'
	import { getTags, deleteTag } from './tags.remote'
	import type { Tag as TagType } from '$lib/schema/tags'

	const tags = getTags()

	function confirmDelete() {
		return confirm('Are you sure you want to delete this tag? This action cannot be undone.')
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Tags Management"
		description="Organize and manage content categories"
		icon={Tag}
	>
		{#snippet actions()}
			<a
				href={ADMIN_ROUTES.tags.new}
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Tag
			</a>
		{/snippet}
	</PageHeader>

	<Table action={true} data={await tags} testId="tags-table">
		{#snippet header(classes)}
			<th class={classes}>Name</th>
			<th class={classes}>Created</th>
		{/snippet}
		{#snippet row(tag: TagType, classes)}
			<td class={classes}>
				<div>{tag.name}</div>
				<div class="mt-1 text-xs text-gray-400">{tag.slug}</div>
			</td>
			<td class={classes}>{formatRelativeDate(tag.created_at)}</td>
		{/snippet}
		{#snippet actionCell(tag: TagType)}
			{@const remove = deleteTag.for(tag.id)}
			<a
				href="/admin/tags/{tag.id}"
				class="inline-flex items-center justify-center rounded-lg bg-svelte-50 p-2 text-svelte-500 transition-all hover:bg-svelte-100 hover:text-svelte-900 hover:shadow-sm"
				aria-label="Edit {tag.name}"
				data-testid="edit-button"
			>
				<PencilSimple class="h-5 w-5" weight="bold" />
			</a>

			<form
				{...remove.enhance(async ({ submit }) => {
					if (!confirmDelete()) return
					const result = await submit()
					if (result) {
						result.success ? toast.success(result.text) : toast.error(result.text)
					}
				})}
			>
				<input {...remove.fields.id.as('hidden', tag.id)} />
				<button
					type="submit"
					disabled={!!remove.pending}
					class="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Delete {tag.name}"
					data-testid="delete-button"
				>
					<Trash class="h-5 w-5" weight="bold" />
				</button>
			</form>
		{/snippet}
	</Table>
</div>
