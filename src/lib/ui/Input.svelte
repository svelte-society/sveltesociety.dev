<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { inputVariants } from './input.variants'

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
		type,
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
		<input
			{type}
			{...rest}
			{placeholder}
			class={[inputVariants({ error: hasErrors }), 'mt-2']}
			data-testid={computedTestId}
		/>
	</label>
	{#if hasErrors}
		{#each issues as issue}
			<div class="text-xs text-red-600">{issue.message}</div>
		{/each}
	{:else}
		<div class="text-xs text-slate-500">{description}</div>
	{/if}
</div>
