<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import type { Snippet } from 'svelte'

	/**
	 * Label styles:
	 * - 'wrap': Input nested inside <label> (default, used by Input, TextArea, Select)
	 * - 'for': Label separate with for attribute (used by MarkdownEditor) - requires id
	 * - 'text': Just a <span> label, no association (used by ImageUpload)
	 */
	type BaseProps = {
		label?: string
		description?: string
		issues?: RemoteFormIssue[]
		error?: string
		children: Snippet
	}

	type WrapProps = BaseProps & {
		labelStyle?: 'wrap'
		id?: string
	}

	type ForProps = BaseProps & {
		labelStyle: 'for'
		id: string // Required for accessibility when using 'for' style
	}

	type TextProps = BaseProps & {
		labelStyle: 'text'
		id?: string
	}

	type Props = WrapProps | ForProps | TextProps

	let {
		label,
		description,
		issues,
		error,
		id,
		labelStyle = 'wrap',
		children
	}: Props = $props()

	const hasErrors = $derived((issues && issues.length > 0) || !!error)
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
		{#if hasErrors}
			{#if error}
				<div class="text-xs text-red-600">{error}</div>
			{/if}
			{#if issues}
				{#each issues as issue, i (i)}
					<div class="text-xs text-red-600">{issue.message}</div>
				{/each}
			{/if}
		{:else if description}
			<div class="text-xs text-slate-500">{description}</div>
		{/if}
	</div>
{:else}
	{@render children()}
{/if}
