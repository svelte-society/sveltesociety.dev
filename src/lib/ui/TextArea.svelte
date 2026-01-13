<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import { inputVariants } from './input.variants'
	import FormFieldFeedback from './FormFieldFeedback.svelte'

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
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
		rows = 4,
		id,
		'data-testid': testId,
		issues,
		...rest
	}: TextInputProps = $props()

	const computedTestId = $derived(testId)
	const hasErrors = $derived(issues && issues.length > 0)
</script>

<div class="flex flex-col gap-2">
	<label class="text-xs font-medium outline-none">
		{label}
		<textarea
			{rows}
			class={[inputVariants({ error: hasErrors }), 'mt-2']}
			{placeholder}
			data-testid={computedTestId}
			{...rest}
		></textarea>
	</label>
	<FormFieldFeedback {issues} {description} />
</div>
