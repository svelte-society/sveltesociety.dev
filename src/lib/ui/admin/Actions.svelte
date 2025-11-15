<script lang="ts">
	import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
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
		class="group relative text-svelte-500 hover:text-svelte-900 transition-colors"
		aria-label="Edit {type}"
		data-testid="edit-button"
	>
		<svg
			class="h-4 w-4"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
			></path>
		</svg>
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
