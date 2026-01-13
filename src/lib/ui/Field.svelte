<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import type { Snippet } from 'svelte'
	import FormFieldFeedback from './FormFieldFeedback.svelte'

	/**
	 * Label styles:
	 * - 'wrap': Input nested inside <label> (default, used by Input, TextArea, Select)
	 * - 'for': Label separate with for attribute (used by MarkdownEditor)
	 * - 'text': Just a <span> label, no association (used by ImageUpload)
	 */
	type LabelStyle = 'wrap' | 'for' | 'text'

	interface Props {
		label?: string
		description?: string
		issues?: RemoteFormIssue[]
		error?: string
		id?: string
		labelStyle?: LabelStyle
		children: Snippet
	}

	let {
		label,
		description,
		issues,
		error,
		id,
		labelStyle = 'wrap',
		children
	}: Props = $props()
</script>

{#if label}
	<div class="flex flex-col gap-2">
		{#if labelStyle === 'wrap'}
			<label class="text-xs font-medium outline-none">
				{label}
				{@render children()}
			</label>
		{:else if labelStyle === 'for'}
			<label class="text-xs font-medium outline-none" for={id}>
				{label}
			</label>
			{@render children()}
		{:else}
			<span class="text-xs font-medium">{label}</span>
			{@render children()}
		{/if}
		<FormFieldFeedback {issues} {description} {error} />
	</div>
{:else}
	{@render children()}
{/if}
