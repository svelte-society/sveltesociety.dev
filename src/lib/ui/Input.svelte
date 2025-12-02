<script lang="ts">
	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		type?: string
		'data-testid'?: string
	}
	let {
		label,
		description,
		placeholder,
		type,
		'data-testid': testId,
		...rest
	}: TextInputProps = $props()

	const computedTestId = $derived(testId)
</script>

<div class="flex flex-col gap-2">
	<label class="text-xs font-medium outline-none">
		{label}
		<input
			{type}
			{...rest}
			{placeholder}
			class="w-full mt-2 rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
			data-testid={computedTestId}
		/>
	</label>
	<div class="text-xs text-slate-500 data-fs-error:sr-only">{description}</div>
</div>
