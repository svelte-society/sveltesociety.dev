<script lang="ts">
	import type { Component } from 'svelte'
	import type { RemoteForm } from '@sveltejs/kit'
	import { getContext } from 'svelte'
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
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

	let showDialog = $state(false)
	let isSubmitting = $state(false)
	const action = $derived(form?.for(ctx.id))

	function handleClick() {
		if (onclick) {
			onclick()
		} else if (form && confirm) {
			showDialog = true
		}
	}
</script>

{#snippet iconWithTooltip()}
	<Icon class={['h-5 w-5', isSubmitting && 'animate-spin']} weight="bold" />
	{#if tooltip}
		<span
			class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
		>
			{tooltip}
		</span>
	{/if}
{/snippet}

{#if form && action && !confirm}
	<form
		{...action.enhance(async ({ submit }) => {
			isSubmitting = true
			try {
				await submit()
				if (action.result?.success === true) {
					toast.success(action.result.text)
				} else {
					toast.error(action.result?.text || 'Something  broke, please try again.')
				}
			} catch {
				toast.error('Something broke, please try again.')
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
{:else}
	<Button
		type="button"
		onclick={handleClick}
		variant={variant as ButtonVariant}
		size="icon"
		class="group relative"
		aria-label={label || tooltip}
		data-testid={testId}
	>
		{@render iconWithTooltip()}
	</Button>
{/if}

{#if showDialog && form && action}
	<div class="fixed inset-0 z-5000 flex items-center justify-center bg-black/30">
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-bold">{confirm}</h2>
			<div class="flex justify-end space-x-2">
				<Button onclick={() => (showDialog = false)} variant="secondary">Cancel</Button>
				<form
					{...action.enhance(async ({ submit }) => {
						await submit()
						showDialog = false
					})}
				>
					<input {...action.fields.id.as('hidden', ctx.id)} />
					<Button type="submit" disabled={!!action.pending}>
						{action.pending ? 'Processing...' : 'Confirm'}
					</Button>
				</form>
			</div>
		</div>
	</div>
{/if}
