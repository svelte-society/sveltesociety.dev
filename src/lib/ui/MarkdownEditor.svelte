<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import { onMount, tick } from 'svelte'
	import FormFieldFeedback from './FormFieldFeedback.svelte'

	interface Props extends HTMLTextareaAttributes {
		label?: string
		description?: string
		issues?: RemoteFormIssue[]
	}

	let {
		label,
		description,
		placeholder,
		rows = 10,
		issues,
		value = $bindable(''),
		'data-testid': testId,
		...rest
	}: Props = $props()

	const hasErrors = $derived(issues && issues.length > 0)

	// Carta components - loaded dynamically on client
	let Editor: typeof import('carta-md').MarkdownEditor | null = $state(null)
	let carta: import('carta-md').Carta | null = $state(null)
	let ready = $state(false)
	let content = $state(String(value ?? ''))
	let editorWrapper: HTMLDivElement | null = $state(null)

	// Keep content and value in sync
	$effect(() => {
		if (ready) value = content
	})

	$effect(() => {
		if (!ready && value) content = String(value)
	})

	// Add prose classes to the renderer after it mounts
	$effect(() => {
		if (ready && editorWrapper) {
			tick().then(() => {
				const renderer = editorWrapper?.querySelector('.carta-renderer')
				if (renderer) {
					renderer.classList.add('prose', 'prose-sm', 'max-w-none')
				}
			})
		}
	})

	onMount(async () => {
		const [{ Carta, MarkdownEditor }, DOMPurify] = await Promise.all([
			import('carta-md'),
			import('isomorphic-dompurify'),
			import('carta-md/default.css')
		])

		Editor = MarkdownEditor
		carta = new Carta({
			sanitizer: (html) => DOMPurify.default.sanitize(html)
		})
		ready = true
	})
</script>

<div class="flex flex-col gap-2">
	{#if label}
		<label class="text-xs font-medium" for={testId}>
			{label}
		</label>
	{/if}

	<!-- Textarea: visible fallback before JS loads, hidden after -->
	<textarea
		id={testId}
		data-testid={testId}
		{rows}
		{placeholder}
		class={[
			ready ? 'sr-only' : 'w-full rounded-md border-2 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200',
			{
				'border-red-300 bg-red-50 text-red-600': !ready && hasErrors,
				'border-transparent bg-slate-100': !ready && !hasErrors
			}
		]}
		bind:value={content}
		{...rest}
	></textarea>

	<!-- Carta editor: appears when ready -->
	{#if ready && Editor && carta}
		<div bind:this={editorWrapper} class={[{ 'rounded-md ring-2 ring-red-300': hasErrors }]}>
			<Editor {carta} bind:value={content} mode="tabs" {placeholder} />
		</div>
	{/if}

	<FormFieldFeedback {issues} {description} />
</div>

<style>
	/* Match site's input styling */
	:global(.carta-editor) {
		background-color: rgb(241 245 249); /* bg-slate-100 */
		border-radius: 0.375rem;
		overflow: hidden;
	}

	:global(.carta-toolbar-left) {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
</style>
