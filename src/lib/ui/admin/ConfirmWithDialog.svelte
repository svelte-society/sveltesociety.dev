<script lang="ts">
	import type { Snippet } from 'svelte'
	import { enhance, applyAction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import Button from '../Button.svelte'
	import Trash from 'phosphor-svelte/lib/Trash'

	let showDialog = $state(false)

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

	let { title, description, action, id, confirmButtonText, cancelButtonText, children }: Props =
		$props()
</script>

<button
	type="button"
	onclick={() => (showDialog = !showDialog)}
	class="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-900 hover:shadow-sm"
	aria-label="Delete item"
>
	<Trash class="h-5 w-5" weight="bold" />
</button>

{#if showDialog}
	<div class="fixed inset-0 z-5000 flex items-center justify-center bg-black/30">
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-bold">{title}</h2>
			{#if children}
				{@render children()}
			{:else}
				<p class="mb-4">{description}</p>
			{/if}
			<div class="flex justify-end space-x-2">
				<Button onclick={() => (showDialog = false)} variant="secondary">{cancelButtonText}</Button>
				<form
					{action}
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								showDialog = false
								await invalidateAll()
							}
							await applyAction(result)
						}
					}}
				>
					<input type="hidden" name="id" value={id} />
					<Button data-testid="confirm-delete-button">{confirmButtonText}</Button>
				</form>
			</div>
		</div>
	</div>
{/if}
