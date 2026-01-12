<script lang="ts">
	import type { Component } from 'svelte'
	import type { RemoteForm } from '@sveltejs/kit'
	import { getContext } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { invalidateAll } from '$app/navigation'
	import Button from '$lib/ui/Button.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'
	import type { ButtonVariant } from '$lib/ui/button.variants'

	type Variant = 'ghost' | 'danger' | 'warning' | 'info' | 'secondary'

	type ActionResult = { success: boolean; text: string }

	type BaseProps = {
		icon: Component
		variant?: Variant
		tooltip?: string
		label?: string
		testId?: string
	}

	type FormProps = BaseProps & {
		form: RemoteForm<{ id: string }, ActionResult>
		confirm?: string
		onclick?: never
	}

	type ClickProps = BaseProps & {
		onclick: () => void
		form?: never
		confirm?: never
	}

	type Props = FormProps | ClickProps

	let {
		icon: Icon,
		variant = 'secondary',
		tooltip,
		label,
		testId,
		form,
		confirm,
		onclick
	}: Props = $props()

	const ctx = getContext<{ id: string }>('actions')

	let isSubmitting = $state(false)
	const action = $derived(form?.for(ctx.id))
	const dialogId = `action-dialog-${ctx.id}`
</script>

{#snippet iconWithTooltip()}
	<Icon class={['h-5 w-5', isSubmitting && 'animate-spin']} weight="bold" />
	{#if tooltip}
		<span
			class="pointer-events-none absolute bottom-full right-0 mb-1 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
		>
			{tooltip}
		</span>
	{/if}
{/snippet}

{#if form && action && !confirm}
	<!-- Form without confirm: direct submit -->
	<form
		{...action.enhance(async ({ submit }) => {
			isSubmitting = true
			await submit()
			if (action.result?.success === true) {
				toast.success(action.result.text)
				await invalidateAll()
			} else {
				toast.error(action.result?.text || 'Something broke, please try again.')
			}
			isSubmitting = false
		})}
	>
		<input {...action.fields.id.as('hidden', ctx.id)} />
		<Button
			type="submit"
			disabled={isSubmitting}
			variant={variant as ButtonVariant}
			size="icon"
			class="group relative"
			aria-label={label || tooltip}
			data-testid={testId}
		>
			{@render iconWithTooltip()}
		</Button>
	</form>
{:else if form && action && confirm}
	<!-- Form with confirm: opens dialog first -->
	<DialogTrigger
		target={dialogId}
		variant={variant as ButtonVariant}
		size="icon"
		class="group relative"
		aria-label={label || tooltip}
		data-testid={testId}
	>
		{@render iconWithTooltip()}
	</DialogTrigger>

	{#snippet confirmButton()}
		<form
			{...action.enhance(async ({ submit }) => {
				await submit()
				(document.getElementById(dialogId) as HTMLDialogElement)?.close()
				await invalidateAll()
			})}
		>
			<input {...action.fields.id.as('hidden', ctx.id)} />
			<Button type="submit" disabled={!!action.pending}>
				{action.pending ? 'Processing...' : 'Confirm'}
			</Button>
		</form>
	{/snippet}

	<ConfirmDialog id={dialogId} title={confirm} confirm={confirmButton} />
{:else if onclick}
	<!-- Click handler only -->
	<Button
		type="button"
		{onclick}
		variant={variant as ButtonVariant}
		size="icon"
		class="group relative"
		aria-label={label || tooltip}
		data-testid={testId}
	>
		{@render iconWithTooltip()}
	</Button>
{/if}
