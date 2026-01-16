<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { inputVariants } from './input.variants'
	import Field from './Field.svelte'

	type TextInputProps = {
		label?: string
		description?: string
		placeholder?: string
		name: string
		type?: string
		'data-testid'?: string
		issues?: RemoteFormIssue[]
	} & HTMLInputAttributes
	let {
		label,
		description,
		placeholder,
		name,
		type,
		'data-testid': testId,
		issues,
		...rest
	}: TextInputProps = $props()

	// Auto-generate test ID from name if not explicitly provided
	const computedTestId = $derived(testId ?? (name ? `input-${name}` : undefined))
	const hasErrors = $derived(issues && issues.length > 0)
</script>

<Field {label} {description} {issues}>
	<input
		{name}
		{type}
		{...rest}
		{placeholder}
		class={[inputVariants({ error: hasErrors }), 'mt-2']}
		data-testid={computedTestId}
	/>
</Field>
