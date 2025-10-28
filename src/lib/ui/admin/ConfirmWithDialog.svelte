<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { RemoteForm } from '@sveltejs/kit'
	import { enhance, applyAction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import Button from '../Button.svelte'

	let showDialog = $state(false)

	interface BaseProps {
		title: string
		id: string
		confirmButtonText?: string
		cancelButtonText?: string
	}

	interface PropsWithAction extends BaseProps {
		action: string
		remoteForm?: never
		description?: string
		children?: Snippet
	}

	interface PropsWithRemoteForm extends BaseProps {
		action?: never
		remoteForm: RemoteForm<any, any>
		description?: string
		children?: Snippet
	}

	type Props = PropsWithAction | PropsWithRemoteForm

	let { title, description, action, remoteForm, id, confirmButtonText, cancelButtonText, children }: Props =
		$props()
</script>

<button
	type="button"
	onclick={() => (showDialog = !showDialog)}
	class="cursor-pointer text-red-600 hover:text-red-900"
	aria-label="Delete item"
>
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
		></path>
	</svg>
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
				{#if remoteForm}
					{@const form = remoteForm.for(id)}
					<form {...form}>
						<input type="hidden" name="id" value={id} />
						<Button disabled={form.pending}>{confirmButtonText}</Button>
					</form>
				{:else}
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
						<Button>{confirmButtonText}</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
