<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import Toggle from '$lib/ui/Toggle.svelte'
	import { marked } from 'marked'

	interface Props extends HTMLTextareaAttributes {
		label?: string
		description?: string
		placeholder?: string
		rows?: number
		'data-testid'?: string
		issues?: RemoteFormIssue[]
	}

	let {
		label,
		description,
		placeholder,
		rows = 20,
		'data-testid': testId,
		issues,
		...rest
	}: Props = $props()

	let preview = $state(false)
	const hasErrors = $derived(issues && issues.length > 0)
	const previewContent = $derived(String(rest.value ?? ''))
</script>

<div class="flex flex-col gap-2">
	<div class="relative flex flex-col gap-2">
		<div class="flex justify-between">
			<label class="text-xs font-medium outline-none" for={testId}>
				{label}
			</label>
			<Toggle text="Preview" name="preview-toggle" bind:checked={preview} />
		</div>
		<textarea
			id={testId}
			{rows}
			class="w-full rounded-md border-2 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 {hasErrors
				? 'border-red-300 bg-red-50 text-red-600'
				: 'border-transparent bg-slate-100'}"
			{placeholder}
			data-testid={testId}
			{...rest}
		></textarea>
		{#if preview && previewContent}
			<div
				class="prose absolute top-7 right-0 bottom-0 left-0 max-w-none overflow-y-auto rounded-md border bg-white p-4"
			>
				{@html marked(previewContent)}
			</div>
		{/if}
	</div>
	{#if hasErrors}
		{#each issues as issue}
			<div class="text-xs text-red-600">{issue.message}</div>
		{/each}
	{:else}
		<div class="text-xs text-slate-500">{description}</div>
	{/if}
</div>
