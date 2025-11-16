<script lang="ts">
	import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple'
	let {
		route,
		id,
		type,
		canDelete = true,
		canEdit = true
	}: { route: string; id: string; type: string; canDelete: boolean; canEdit: boolean } = $props()
</script>

{#if canEdit}
	<a
		href="/admin/{route}/{id}"
		class="inline-flex items-center justify-center rounded-lg bg-svelte-50 p-2 text-svelte-500 transition-all hover:bg-svelte-100 hover:text-svelte-900 hover:shadow-sm"
		aria-label="Edit {type}"
		data-testid="edit-button"
	>
		<PencilSimple class="h-5 w-5" weight="bold" />
	</a>
{/if}
{#if canDelete}
	<ConfirmWithDialog
		title="Are you sure you want to delete {type}?"
		description="This action cannot be undone."
		action="?/delete"
		confirmButtonText="Delete"
		cancelButtonText="Cancel"
		{id}
	/>
{/if}
