<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import { inputVariants } from './input.variants'
	import Field from './Field.svelte'

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name?: string
		rows?: number
		'data-testid'?: string
		rest?: HTMLTextareaAttributes
		id?: string
		issues?: RemoteFormIssue[]
	}
	let {
		label,
		description,
		placeholder,
		name,
		rows = 4,
		id,
		'data-testid': testId,
		issues,
		...rest
	}: TextInputProps = $props()

	// Auto-generate test ID from name if not explicitly provided
	const computedTestId = $derived(testId ?? (name ? `textarea-${name}` : undefined))
	const hasErrors = $derived(issues && issues.length > 0)
</script>

<Field {label} {description} {issues}>
	<textarea
		{name}
		{rows}
		class={[inputVariants({ error: hasErrors }), 'mt-2']}
		{placeholder}
		data-testid={computedTestId}
		{...rest}
	></textarea>
</Field>
