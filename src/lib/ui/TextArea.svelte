<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		rows?: number
		'data-testid'?: string
		rest?: HTMLTextareaAttributes
		id?: string
	}
	let {
		label,
		description,
		placeholder,
		rows = 4,
		id,
		'data-testid': testId,
		...rest
	}: TextInputProps = $props()

	const computedTestId = $derived(testId)
</script>

<div class="flex flex-col gap-2">
	<label class="text-xs font-medium outline-none">
		{label}
		<textarea
			{rows}
			class="w-full rounded-md mt-2 border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
			{placeholder}
			data-testid={computedTestId}
			{...rest}
		></textarea>
	</label>
	<div class="text-xs text-slate-500 data-fs-error:sr-only">{description}</div>
</div>
