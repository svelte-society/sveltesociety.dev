<script lang="ts">
	import type { z } from 'zod/v4'

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		type?: string
		'data-testid'?: string
		issues?: z.core.$ZodIssue[]
	}
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
			class="w-full mt-2 rounded-md border-2 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 {hasErrors
				? 'border-red-300 bg-red-50 text-red-600'
				: 'border-transparent bg-slate-100'}"
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
