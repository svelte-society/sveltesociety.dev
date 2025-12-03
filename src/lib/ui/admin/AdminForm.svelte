<script lang="ts">
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import type { Snippet } from 'svelte'
	import type { SuperForm } from 'sveltekit-superforms'
	import type { Icon } from 'phosphor-svelte'

	interface Props {
		title: string
		description: string
		icon: typeof Icon
		form: SuperForm<any>
		cancelHref: string
		submitLabel?: string
		children?: Snippet
		action?: string
	}

	let {
		title,
		description,
		icon,
		form,
		cancelHref,
		submitLabel = 'Save',
		children,
		action
	}: Props = $props()

	const { submitting } = $derived(form)
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader {title} {description} {icon} />

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Form Details</p>
			</div>
		</div>

		<div class="p-8">
			<Form {form} {action}>
				<div class="grid gap-6 lg:grid-cols-2">
					{@render children?.()}
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button type="submit" width="full" disabled={$submitting}>
						{$submitting ? 'Saving...' : submitLabel}
					</Button>
					<Button href={cancelHref} variant="secondary">Cancel</Button>
				</div>
			</Form>
		</div>
	</div>
</div>
