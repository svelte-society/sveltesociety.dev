<script lang="ts">
	import Form from '$lib/ui/form/Form.svelte'
	import Button from '$lib/ui/Button.svelte'
	import type { Snippet } from 'svelte'
	import type { SuperForm } from 'sveltekit-superforms'

	interface Props {
		title: string
		form: SuperForm<any>
		cancelHref: string
		submitLabel?: string
		children?: Snippet
		action?: string
	}

	let { title, form, cancelHref, submitLabel = 'Save', children, action }: Props = $props()

	const { submitting } = form
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">{title}</h1>

	<Form {form} {action}>
		{@render children?.()}

		<div class="mt-6 flex gap-4">
			<Button type="submit" primary fullWidth disabled={$submitting}>
				{$submitting ? 'Saving...' : submitLabel}
			</Button>
			<Button href={cancelHref} secondary>Cancel</Button>
		</div>
	</Form>
</div>
