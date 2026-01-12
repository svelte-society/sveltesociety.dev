<script lang="ts">
	import { getContext } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { invalidateAll } from '$app/navigation'
	import type { RemoteForm } from '@sveltejs/kit'
	import Trash from 'phosphor-svelte/lib/Trash'
	import Button from '$lib/ui/Button.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'

	type DeleteResult = { success: boolean; text: string }

	type Props = {
		form: RemoteForm<{ id: string }, DeleteResult>
		confirm?: string
		label?: string
	}

	let {
		form,
		confirm = 'Are you sure you want to delete this?',
		label = 'Delete'
	}: Props = $props()

	const ctx = getContext<{ id: string }>('actions')

	let isSubmitting = $state(false)
	const remove = $derived(form.for(ctx.id))
	const dialogId = `delete-dialog-${ctx.id}`
</script>

<DialogTrigger
	target={dialogId}
	variant="danger"
	size="icon"
	aria-label={label}
	data-testid="delete-button"
>
	<Trash class="h-5 w-5" weight="bold" />
</DialogTrigger>

{#snippet confirmButton()}
	<form
		{...remove.enhance(async ({ submit }) => {
			isSubmitting = true
			try {
				await submit()
				if (remove.result?.success === true) {
					toast.success(remove.result.text)
					;(document.getElementById(dialogId) as HTMLDialogElement)?.close()
					await invalidateAll()
				} else if (remove.result?.success === false) {
					toast.error(remove.result.text || 'Something broke, please try again.')
				}
			} catch {
				toast.error('Something broke, please try again.')
			}
			isSubmitting = false
		})}
	>
		<input {...remove.fields.id.as('hidden', ctx.id)} />
		<Button type="submit" disabled={!!remove.pending} data-testid="confirm-delete-button">
			{remove.pending ? 'Deleting...' : 'Delete'}
		</Button>
	</form>
{/snippet}

<ConfirmDialog
	id={dialogId}
	title={confirm}
	description="This action cannot be undone."
	confirm={confirmButton}
/>
