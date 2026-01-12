<script lang="ts">
	import type { Snippet } from 'svelte'
	import { enhance, applyAction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import Button from '../Button.svelte'
	import Trash from 'phosphor-svelte/lib/Trash'
	import { DialogTrigger, ConfirmDialog } from '../Dialog'

	interface BaseProps {
		title: string
		action: string
		id: string
		confirmButtonText?: string
		cancelButtonText?: string
	}

	interface PropsWithDescription extends BaseProps {
		description: string
		children?: never
	}

	interface PropsWithChildren extends BaseProps {
		description?: never
		children: Snippet
	}

	type Props = PropsWithDescription | PropsWithChildren

	let {
		title,
		description,
		action,
		id,
		confirmButtonText = 'Delete',
		cancelButtonText = 'Cancel',
		children
	}: Props = $props()

	let dialogOpen = $state(false)
</script>

<DialogTrigger onclick={() => (dialogOpen = true)} variant="danger" size="icon" aria-label="Delete item">
	<Trash class="h-5 w-5" weight="bold" />
</DialogTrigger>

{#snippet confirm()}
	<form
		{action}
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					dialogOpen = false
					await invalidateAll()
				}
				await applyAction(result)
			}
		}}
	>
		<input type="hidden" name="id" value={id} />
		<Button data-testid="confirm-delete-button">{confirmButtonText}</Button>
	</form>
{/snippet}

{#if description}
	<ConfirmDialog id={`confirm-delete-${id}`} bind:open={dialogOpen} {title} {description} cancelText={cancelButtonText} {confirm} />
{:else if children}
	<ConfirmDialog id={`confirm-delete-${id}`} bind:open={dialogOpen} {title} cancelText={cancelButtonText} {confirm}>
		{@render children()}
	</ConfirmDialog>
{/if}
