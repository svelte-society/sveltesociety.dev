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

	let { title, description, icon, form, cancelHref, submitLabel = 'Save', children, action }: Props = $props()

	const { submitting } = form
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader {title} {description} {icon} />

	<div class="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
		<Form {form} {action}>
			{@render children?.()}

			<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
				<Button type="submit" width="full" disabled={$submitting}>
					{$submitting ? 'Saving...' : submitLabel}
				</Button>
				<Button href={cancelHref} variant="secondary">Cancel</Button>
			</div>
		</Form>
	</div>
</div>
