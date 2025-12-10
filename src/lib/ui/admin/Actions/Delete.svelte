<script lang="ts">
	import { getContext } from 'svelte'
	import { toast } from 'svelte-sonner'
	import type { RemoteForm } from '@sveltejs/kit'
	import Trash from 'phosphor-svelte/lib/Trash'
	import Button from '$lib/ui/Button.svelte'

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

	let showDialog = $state(false)
	let isSubmitting = $state(false)
	const remove = $derived(form.for(ctx.id))
</script>

<Button
	type="button"
	onclick={() => (showDialog = true)}
	variant="danger"
	size="icon"
	aria-label={label}
	data-testid="delete-button"
>
	<Trash class="h-5 w-5" weight="bold" />
</Button>

{#if showDialog}
	<div class="fixed inset-0 z-5000 flex items-center justify-center bg-black/30">
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-bold">{confirm}</h2>
			<p class="mb-4">This action cannot be undone.</p>
			<div class="flex justify-end space-x-2">
				<Button onclick={() => (showDialog = false)} variant="secondary">Cancel</Button>
				<form
					{...remove.enhance(async ({ submit }) => {
						isSubmitting = true
						try {
							await submit()
							if (remove.result?.success === true) {
								toast.success(remove.result.text)
							} else {
								toast.error(remove.result?.text || 'Something  broke, please try again.')
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
			</div>
		</div>
	</div>
{/if}
